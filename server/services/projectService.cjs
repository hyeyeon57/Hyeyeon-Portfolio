const path = require('path');
const { existsSync } = require('fs');
const mongoose = require('mongoose');
const Project = require('../models/Project.cjs');
const { PUBLIC_DIR } = require('../utils/pathHelpers.cjs');
const { saveFiles, isS3Enabled } = require('./storageService.cjs');

const isConnected = () => mongoose.connection.readyState === 1;

const findProjectById = async (id) => {
  let project = null;
  if (mongoose.isValidObjectId(id)) {
    project = await Project.findById(id);
  }
  if (!project) {
    project = await Project.findOne({ id });
  }
  return project;
};

const listProjects = async () => {
  try {
    if (!isConnected()) {
      console.error('[projectService] MongoDB 연결되지 않음');
      return { ok: false, status: 503, message: 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.' };
    }

    console.log('[projectService] 프로젝트 조회 시작...');
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .lean()
      .select('id title subtitle description fullDescription image images tags category date startDate endDate role duration team achievements link featured designPdf detailPdf previewPdf designLink figmaLink designFile gallery retrospective createdAt updatedAt')
      .maxTimeMS(5000); // 5초 타임아웃

    console.log(`[projectService] 프로젝트 조회 완료: ${projects.length}개`);

    const normalized = projects.map((p) => ({
      ...p,
      images: (p.images && p.images.length ? p.images : (p.gallery || [])),
    }));

    return { ok: true, data: normalized };
  } catch (error) {
    console.error('[projectService] 프로젝트 조회 중 에러:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return { ok: false, status: 500, message: `프로젝트 조회 실패: ${error.message || '알 수 없는 오류'}` };
  }
};

const getProject = async (id) => {
  if (!isConnected()) {
    return { ok: false, status: 503, message: 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.' };
  }

  const project = await findProjectById(id);
  if (!project) {
    return { ok: false, status: 404, message: '프로젝트를 찾을 수 없습니다.' };
  }
  const normalized = {
    ...project.toObject ? project.toObject() : project,
    images: (project.images && project.images.length ? project.images : (project.gallery || [])),
  };
  return { ok: true, data: normalized };
};

const computeDuration = (start, end) => {
  if (!start || !end) return '';
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || e < s) return '';
  const diffDays = Math.floor((e - s) / (1000 * 60 * 60 * 24));
  let days = diffDays;
  const years = Math.floor(days / 365);
  days %= 365;
  let months = Math.floor(days / 30);
  days %= 30;
  let weeks = Math.floor(days / 7);
  days %= 7;
  // 12주 이상이면 개월로 올리기 (주→개월 환산)
  if (weeks >= 12) {
    months += Math.floor(weeks / 4);
    weeks = weeks % 4;
  }
  const parts = [];
  if (years > 0) {
    parts.push(`${years}년`);
    if (months > 0) parts.push(`${months}개월`);
  } else if (months > 0) {
    parts.push(`${months}개월`);
    if (weeks > 0) parts.push(`${weeks}주`);
  } else if (weeks > 0) {
    parts.push(`${weeks}주`);
    if (days > 0) parts.push(`${days}일`);
  } else if (days > 0) {
    parts.push(`${days}일`);
  }
  return parts.join(' ');
};

const formatDateRange = (start, end) => {
  if (!start || !end) return '';
  return `${start} ~ ${end}`;
};

const createProject = async ({ payload, files }) => {
  if (!isConnected()) {
    return { ok: false, status: 503, message: 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.' };
  }

  const projectData = payload.project ? JSON.parse(payload.project) : payload;
  if (projectData.startDate && projectData.endDate) {
    projectData.duration = computeDuration(projectData.startDate, projectData.endDate) || projectData.duration;
    projectData.date = formatDateRange(projectData.startDate, projectData.endDate) || projectData.date;
  }
  if (projectData.startDate && projectData.endDate) {
    projectData.duration = computeDuration(projectData.startDate, projectData.endDate) || projectData.duration;
    projectData.date = formatDateRange(projectData.startDate, projectData.endDate) || projectData.date;
  }
  const normalizeImages = (arr) => Array.isArray(arr) ? arr.filter(Boolean) : null;
  if (projectData.removeMainImage === true || projectData.removeMainImage === 'true') {
    projectData.image = '';
  }
  if (projectData.removeDesignPdf === true || projectData.removeDesignPdf === 'true') {
    projectData.designPdf = '';
  }
  if (projectData.removeDetailPdf === true || projectData.removeDetailPdf === 'true') {
    projectData.detailPdf = '';
  }
  const initialImages = normalizeImages(projectData.images) || normalizeImages(projectData.gallery);
  if (initialImages) {
    projectData.images = initialImages;
    projectData.gallery = initialImages;
  }
  if (files) {
    if (files.mainImage && files.mainImage.length > 0) {
      const [mainImagePath] = await saveFiles(files.mainImage, 'img');
      projectData.image = mainImagePath;
    }
    if (files.images && Array.isArray(files.images) && files.images.length > 0) {
      const galleryPaths = await saveFiles(files.images, 'img');
      projectData.images = galleryPaths;
      projectData.gallery = galleryPaths;
    }
  }
  if (!projectData.id) {
    projectData.id = Date.now().toString();
  }

  const newProject = await Project.create(projectData);
  return { ok: true, data: newProject };
};

const updateProject = async ({ id, payload, files }) => {
  if (!isConnected()) {
    return { ok: false, status: 503, message: 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.' };
  }

  const project = await findProjectById(id);
  if (!project) {
    return { ok: false, status: 404, message: '프로젝트를 찾을 수 없습니다.' };
  }

  const projectData = payload.project ? JSON.parse(payload.project) : payload;
  if (files) {
    if (files.mainImage && files.mainImage.length > 0) {
      const [mainImagePath] = await saveFiles(files.mainImage, 'img');
      projectData.image = mainImagePath;
    }
    if (files.images && Array.isArray(files.images) && files.images.length > 0) {
      const existingGallery = projectData.images && projectData.images.length
        ? projectData.images
        : (project.images && project.images.length ? project.images : project.gallery || []);
      const galleryPaths = await saveFiles(files.images, 'img');
      const merged = [...(existingGallery || []), ...galleryPaths];
      projectData.images = merged;
      projectData.gallery = merged;
    }
  }
  projectData.id = project.id || id;

  const updatedProject = await Project.findOneAndUpdate(
    { _id: project._id },
    { $set: projectData },
    { new: true, runValidators: true }
  );

  return { ok: true, data: updatedProject };
};

const deleteProject = async (id) => {
  if (!isConnected()) {
    return { ok: false, status: 503, message: 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.' };
  }

  const project = await findProjectById(id);
  if (!project) {
    return { ok: false, status: 404, message: '프로젝트를 찾을 수 없습니다.' };
  }

  await Project.findByIdAndDelete(project._id);
  return { ok: true, message: '프로젝트가 삭제되었습니다.' };
};

const getProjectFiles = async ({ id, baseUrl }) => {
  const projectResult = await getProject(id);
  if (!projectResult.ok) return projectResult;

  const project = projectResult.data;
  const files = [];
  const makeUrl = (relative) => {
    if (/^https?:\/\//.test(relative)) return relative;
    return `${baseUrl}${relative.startsWith('/') ? relative : '/' + relative}`;
  };

  if (project.image) {
    files.push({
      name: project.image.split('/').pop() || 'image.jpg',
      path: project.image,
      url: makeUrl(project.image),
    });
  }

  const galleryImages = project.images && Array.isArray(project.images) && project.images.length
    ? project.images
    : (project.gallery || []);

  if (galleryImages && Array.isArray(galleryImages)) {
    galleryImages.forEach((img) => {
      if (img && !files.find((f) => f.path === img)) {
        files.push({
          name: img.split('/').pop() || 'image.jpg',
          path: img,
          url: makeUrl(img),
        });
      }
    });
  }

  // PDF 관련 필드도 파일 목록에 포함
  const pdfEntries = [
    { key: 'designPdf', label: 'design' },
    { key: 'detailPdf', label: 'detail' },
    { key: 'previewPdf', label: 'preview' },
  ];

  pdfEntries.forEach(({ key, label }) => {
    const val = project[key];
    if (val) {
      files.push({
        name: val.split('/').pop() || `${label}.pdf`,
        path: val,
        url: makeUrl(val),
        type: 'pdf',
      });
    }
  });

  return { ok: true, data: files };
};

const resolveProjectFilePath = async ({ id, filename }) => {
  const projectResult = await getProject(id);
  if (!projectResult.ok) return projectResult;

  const project = projectResult.data;
  let filePath = null;
  let remoteUrl = null;
  const galleryImages = project.images && Array.isArray(project.images) && project.images.length
    ? project.images
    : (project.gallery || []);

  if (project.image && project.image.includes(filename)) {
    if (/^https?:\/\//.test(project.image)) {
      remoteUrl = project.image;
    } else {
      filePath = path.join(PUBLIC_DIR, project.image.replace(/^\//, ''));
    }
  }

  if (!filePath && galleryImages && Array.isArray(galleryImages)) {
    const matchedImage = galleryImages.find((img) => img && img.includes(filename));
    if (matchedImage) {
      if (/^https?:\/\//.test(matchedImage)) {
        remoteUrl = matchedImage;
      } else {
        filePath = path.join(PUBLIC_DIR, matchedImage.replace(/^\//, ''));
      }
    }
  }

  if (!filePath) {
    const foImgPath = path.join(PUBLIC_DIR, '..', '..', 'public', 'img', filename);
    if (existsSync(foImgPath)) {
      filePath = foImgPath;
    }
  }

  if (!filePath) {
    const foProjectPath = path.join(PUBLIC_DIR, '..', '..', 'public', 'projects', filename);
    if (existsSync(foProjectPath)) {
      filePath = foProjectPath;
    }
  }

  if (remoteUrl) {
    return { ok: true, remoteUrl };
  }

  if (!filePath || !existsSync(filePath)) {
    return { ok: false, status: 404, message: '파일을 찾을 수 없습니다.' };
  }

  return { ok: true, path: filePath };
};

module.exports = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectFiles,
  resolveProjectFilePath,
};

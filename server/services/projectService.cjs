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
      .sort({ order: 1, featured: -1, createdAt: -1 })
      .lean()
      .select('id title subtitle description fullDescription image images tags category date startDate endDate role duration team achievements link featured designPdf detailPdf previewPdf designLink figmaLink designFile gallery retrospective order createdAt updatedAt')
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
  
  // category 필드를 배열로 정규화 (문자열이면 배열로 변환)
  if (projectData.category !== undefined) {
    if (Array.isArray(projectData.category)) {
      // 이미 배열이면 그대로 사용
      projectData.category = projectData.category.filter(c => c && c.trim() !== '');
    } else if (typeof projectData.category === 'string' && projectData.category.trim() !== '') {
      // 문자열이면 배열로 변환
      projectData.category = [projectData.category.trim()];
    } else {
      // 빈 값이면 빈 배열로 설정
      projectData.category = [];
    }
    // 빈 배열이면 필수 필드이므로 오류
    if (projectData.category.length === 0) {
      return { ok: false, status: 400, message: '카테고리를 최소 1개 이상 선택해주세요.' };
    }
  }
  
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
  
  // 디버깅: 받은 payload 확인
  console.log('[projectService] 받은 payload에서 PDF 필드 확인:', {
    designPdf: projectData.designPdf,
    detailPdf: projectData.detailPdf,
    designPdfType: typeof projectData.designPdf,
    detailPdfType: typeof projectData.detailPdf,
    designPdfExists: 'designPdf' in projectData,
    detailPdfExists: 'detailPdf' in projectData,
    designPdfLength: projectData.designPdf ? projectData.designPdf.length : 0,
    detailPdfLength: projectData.detailPdf ? projectData.detailPdf.length : 0,
    removeDesignPdf: projectData.removeDesignPdf,
    removeDetailPdf: projectData.removeDetailPdf,
  });
  
  // 삭제 플래그 처리
  if (projectData.removeMainImage === true) {
    projectData.image = null;
    delete projectData.removeMainImage;
  } else if (projectData.image !== undefined) {
    // image 필드가 있으면 유효성 검사
    if (projectData.image === null) {
      // null은 명시적 삭제이므로 그대로 사용
      console.log('[projectService] image null (삭제)');
    } else if (typeof projectData.image === 'string' && projectData.image.trim() !== '') {
      // 유효한 URL이 있으면 그대로 사용
      console.log('[projectService] image 저장:', projectData.image);
    } else {
      // 빈 문자열이거나 유효하지 않은 값이면 필드 제거 (기존 값 유지)
      console.log('[projectService] image 값 없음 또는 빈 문자열, 필드 제거 (기존 값 유지)', {
        value: projectData.image,
        type: typeof projectData.image,
        exists: 'image' in projectData
      });
      delete projectData.image;
    }
  }
  
  // PDF 필드 처리 (단순화)
  // 1. 삭제 플래그가 있으면 null로 설정
  // 2. 값이 있으면 그대로 사용
  // 3. 값이 없거나 빈 문자열이면 필드 제거 (기존 값 유지)
  
  if (projectData.removeDesignPdf === true || projectData.removeDesignPdf === 'true') {
    projectData.designPdf = null;
    console.log('[projectService] designPdf 삭제 플래그 감지, null로 설정');
    delete projectData.removeDesignPdf;
  } else if (projectData.designPdf && typeof projectData.designPdf === 'string' && projectData.designPdf.trim() !== '') {
    // 유효한 값이 있으면 그대로 사용
    console.log('[projectService] designPdf 저장:', projectData.designPdf);
    console.log('[projectService] designPdf 값 검증:', {
      value: projectData.designPdf,
      type: typeof projectData.designPdf,
      length: projectData.designPdf.length,
      trimmed: projectData.designPdf.trim(),
      trimmedLength: projectData.designPdf.trim().length,
      isEmpty: projectData.designPdf.trim() === ''
    });
  } else {
    // 값이 없거나 빈 문자열이면 필드 제거 (기존 값 유지)
    console.log('[projectService] designPdf 값 없음, 필드 제거 (기존 값 유지)', {
      value: projectData.designPdf,
      type: typeof projectData.designPdf,
      exists: 'designPdf' in projectData
    });
    delete projectData.designPdf;
  }
  
  if (projectData.removeDetailPdf === true || projectData.removeDetailPdf === 'true') {
    projectData.detailPdf = null;
    console.log('[projectService] detailPdf 삭제 플래그 감지, null로 설정');
    delete projectData.removeDetailPdf;
  } else if (projectData.detailPdf && typeof projectData.detailPdf === 'string' && projectData.detailPdf.trim() !== '') {
    // 유효한 값이 있으면 그대로 사용
    console.log('[projectService] detailPdf 저장:', projectData.detailPdf);
    console.log('[projectService] detailPdf 값 검증:', {
      value: projectData.detailPdf,
      type: typeof projectData.detailPdf,
      length: projectData.detailPdf.length,
      trimmed: projectData.detailPdf.trim(),
      trimmedLength: projectData.detailPdf.trim().length,
      isEmpty: projectData.detailPdf.trim() === ''
    });
  } else {
    // 값이 없거나 빈 문자열이면 필드 제거 (기존 값 유지)
    console.log('[projectService] detailPdf 값 없음, 필드 제거 (기존 값 유지)', {
      value: projectData.detailPdf,
      type: typeof projectData.detailPdf,
      exists: 'detailPdf' in projectData
    });
    delete projectData.detailPdf;
  }
  
  // 파일 업로드 처리 (files 파라미터가 있는 경우만)
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
  
  // images와 gallery 배열이 빈 배열인 경우 처리
  if (Array.isArray(projectData.images) && projectData.images.length === 0) {
    projectData.images = [];
    projectData.gallery = [];
  }
  
  // category 필드를 배열로 정규화 (문자열이면 배열로 변환)
  if (projectData.category !== undefined) {
    if (Array.isArray(projectData.category)) {
      // 이미 배열이면 그대로 사용
      projectData.category = projectData.category.filter(c => c && c.trim() !== '');
    } else if (typeof projectData.category === 'string' && projectData.category.trim() !== '') {
      // 문자열이면 배열로 변환
      projectData.category = [projectData.category.trim()];
    } else {
      // 빈 값이면 빈 배열로 설정
      projectData.category = [];
    }
    // 빈 배열이면 필수 필드이므로 제거하지 않음 (기존 값 유지)
    if (projectData.category.length === 0) {
      delete projectData.category;
    }
  }
  
  // undefined/null 필드와 remove 플래그 제거 (MongoDB $set에 포함되지 않도록)
  const cleanedProjectData = {};
  for (const [key, value] of Object.entries(projectData)) {
    // undefined, null이 아닌 값만 포함 (단, null은 명시적 삭제이므로 포함)
    if (value !== undefined) {
      cleanedProjectData[key] = value;
    }
  }
  
  // id는 항상 포함
  cleanedProjectData.id = project.id || id;
  
  // remove 플래그는 제거 (이미 처리됨)
  delete cleanedProjectData.removeMainImage;
  delete cleanedProjectData.removeDesignPdf;
  delete cleanedProjectData.removeDetailPdf;
  
  // 디버깅: PDF 필드가 cleanedProjectData에 포함되었는지 확인
  console.log('[projectService] 정리된 프로젝트 데이터:', {
    id: cleanedProjectData.id,
    image: cleanedProjectData.image,
    images: cleanedProjectData.images,
    gallery: cleanedProjectData.gallery,
    designPdf: cleanedProjectData.designPdf,
    detailPdf: cleanedProjectData.detailPdf,
    designPdfInObject: 'designPdf' in cleanedProjectData,
    detailPdfInObject: 'detailPdf' in cleanedProjectData,
    designPdfBeforeClean: projectData.designPdf,
    detailPdfBeforeClean: projectData.detailPdf,
    designPdfInProjectData: 'designPdf' in projectData,
    detailPdfInProjectData: 'detailPdf' in projectData,
  });
  
  // PDF 필드가 projectData에 있었는데 cleanedProjectData에 없으면 경고
  if ('designPdf' in projectData && !('designPdf' in cleanedProjectData)) {
    console.error('[projectService] ⚠️ designPdf가 projectData에 있었는데 cleanedProjectData에서 사라졌습니다!', {
      projectDataValue: projectData.designPdf,
      projectDataType: typeof projectData.designPdf,
      isUndefined: projectData.designPdf === undefined,
      isNull: projectData.designPdf === null,
    });
  }
  if ('detailPdf' in projectData && !('detailPdf' in cleanedProjectData)) {
    console.error('[projectService] ⚠️ detailPdf가 projectData에 있었는데 cleanedProjectData에서 사라졌습니다!', {
      projectDataValue: projectData.detailPdf,
      projectDataType: typeof projectData.detailPdf,
      isUndefined: projectData.detailPdf === undefined,
      isNull: projectData.detailPdf === null,
    });
  }
  
  console.log('[projectService] MongoDB 업데이트 시작...');
  const updatedProject = await Project.findOneAndUpdate(
    { _id: project._id },
    { $set: cleanedProjectData },
    { new: true, runValidators: true }
  );

  console.log('[projectService] MongoDB 업데이트 완료:', {
    id: updatedProject?.id || updatedProject?._id,
    image: updatedProject?.image,
    images: updatedProject?.images,
    gallery: updatedProject?.gallery,
    designPdf: updatedProject?.designPdf,
    detailPdf: updatedProject?.detailPdf,
  });

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

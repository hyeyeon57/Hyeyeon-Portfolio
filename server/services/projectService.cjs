const path = require('path');
const { existsSync } = require('fs');
const mongoose = require('mongoose');
const Project = require('../models/Project.cjs');
const { PUBLIC_DIR } = require('../utils/pathHelpers.cjs');
const { saveFiles, isS3Enabled } = require('./storageService.cjs');

const isConnected = () => mongoose.connection.readyState === 1;

const findProjectById = async (id) => {
  let project = await Project.findById(id);
  if (!project) {
    project = await Project.findOne({ id });
  }
  return project;
};

const listProjects = async () => {
  if (!isConnected()) {
    return { ok: false, status: 503, message: 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.' };
  }

  const projects = await Project.find()
    .sort({ createdAt: -1 })
    .lean()
    .select('id title subtitle description fullDescription image images tags category date role duration team achievements link featured designPdf detailPdf previewPdf designLink figmaLink designFile gallery retrospective createdAt updatedAt');

  return { ok: true, data: projects };
};

const getProject = async (id) => {
  if (!isConnected()) {
    return { ok: false, status: 503, message: 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.' };
  }

  const project = await findProjectById(id);
  if (!project) {
    return { ok: false, status: 404, message: '프로젝트를 찾을 수 없습니다.' };
  }
  return { ok: true, data: project };
};

const createProject = async ({ payload, files }) => {
  if (!isConnected()) {
    return { ok: false, status: 503, message: 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.' };
  }

  const projectData = payload.project ? JSON.parse(payload.project) : payload;
  if (files) {
    if (files.mainImage && files.mainImage.length > 0) {
      const [mainImagePath] = await saveFiles(files.mainImage, 'projects');
      projectData.image = mainImagePath;
    }
    if (files.images && Array.isArray(files.images) && files.images.length > 0) {
      const galleryPaths = await saveFiles(files.images, 'projects');
      projectData.images = galleryPaths;
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
      const [mainImagePath] = await saveFiles(files.mainImage, 'projects');
      projectData.image = mainImagePath;
    }
    if (files.images && Array.isArray(files.images) && files.images.length > 0) {
      const galleryPaths = await saveFiles(files.images, 'projects');
      projectData.images = [...(project.images || []), ...galleryPaths];
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

  if (project.images && Array.isArray(project.images)) {
    project.images.forEach((img) => {
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

  if (project.image && project.image.includes(filename)) {
    if (/^https?:\/\//.test(project.image)) {
      remoteUrl = project.image;
    } else {
      filePath = path.join(PUBLIC_DIR, project.image.replace(/^\//, ''));
    }
  }

  if (!filePath && project.images && Array.isArray(project.images)) {
    const matchedImage = project.images.find((img) => img && img.includes(filename));
    if (matchedImage) {
      if (/^https?:\/\//.test(matchedImage)) {
        remoteUrl = matchedImage;
      } else {
        filePath = path.join(PUBLIC_DIR, matchedImage.replace(/^\//, ''));
      }
    }
  }

  if (!filePath) {
    const foImagePath = path.join(PUBLIC_DIR, '..', '..', 'public', 'projects', filename);
    if (existsSync(foImagePath)) {
      filePath = foImagePath;
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

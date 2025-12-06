const { ok, fail } = require('../utils/httpResponse.cjs');
const {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectFiles,
  resolveProjectFilePath,
} = require('../services/projectService.cjs');
const { saveFiles } = require('../services/storageService.cjs');

const getProjects = async (req, res) => {
  try {
    console.log('[projectController] 프로젝트 목록 조회 요청');
    
    // MongoDB 연결 확인
    const mongoose = require('mongoose');
    const isConnected = mongoose.connection.readyState === 1;
    
    if (!isConnected) {
      console.error('[projectController] MongoDB 연결되지 않음, 연결 시도...');
      const { connectDB } = require('../config/database.cjs');
      const connected = await connectDB();
      
      if (!connected) {
        console.error('[projectController] MongoDB 연결 실패');
        return fail(res, 503, 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.');
      }
    }
    
    const result = await listProjects();
    
    if (!result.ok) {
      console.error('[projectController] 프로젝트 목록 조회 실패:', result.message);
      return fail(res, result.status || 500, result.message);
    }
    
    console.log(`[projectController] 프로젝트 목록 조회 성공: ${result.data?.length || 0}개`);
    return ok(res, { data: result.data || [] });
  } catch (error) {
    console.error('[projectController] 프로젝트 목록 조회 중 예외 발생:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return fail(res, 500, `프로젝트를 불러오는데 실패했습니다: ${error.message || '알 수 없는 오류'}`);
  }
};

const getProjectDetail = async (req, res) => {
  const result = await getProject(req.params.id);
  if (!result.ok) {
    return fail(res, result.status, result.message);
  }
  return ok(res, { data: result.data });
};

const postProject = async (req, res) => {
  const result = await createProject({ payload: req.body, files: req.files });
  if (!result.ok) {
    return fail(res, result.status, result.message);
  }
  return ok(res, { data: result.data });
};

const putProject = async (req, res) => {
  const result = await updateProject({ id: req.params.id, payload: req.body, files: req.files });
  if (!result.ok) {
    return fail(res, result.status, result.message);
  }
  return ok(res, { data: result.data });
};

const deleteProjectById = async (req, res) => {
  const result = await deleteProject(req.params.id);
  if (!result.ok) {
    return fail(res, result.status, result.message);
  }
  return ok(res, { message: result.message });
};

const getProjectFilesHandler = async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const result = await getProjectFiles({ id: req.params.id, baseUrl });
  if (!result.ok) {
    return fail(res, result.status, result.message);
  }
  return ok(res, { data: result.data });
};

const downloadProjectFile = async (req, res) => {
  const result = await resolveProjectFilePath({ id: req.params.id, filename: req.params.filename });
  if (!result.ok) {
    return fail(res, result.status, result.message);
  }

  if (result.remoteUrl) {
    return res.redirect(302, result.remoteUrl);
  }

  return res.download(result.path, req.params.filename, (err) => {
    if (err && !res.headersSent) {
      fail(res, 500, '파일 다운로드에 실패했습니다.');
    }
  });
};

module.exports = {
  getProjects,
  getProjectDetail,
  postProject,
  putProject,
  deleteProjectById,
  getProjectFilesHandler,
  downloadProjectFile,
};

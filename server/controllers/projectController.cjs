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
  const result = await listProjects();
  if (!result.ok) {
    return fail(res, result.status, result.message);
  }
  return ok(res, { data: result.data });
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

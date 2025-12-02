const path = require('path');

// 프로젝트 루트 기준 절대 경로 (Next 서버리스에서도 올바르게 계산)
const PROJECT_ROOT = process.cwd();
const SERVER_ROOT = path.join(PROJECT_ROOT, 'server');

const PUBLIC_DIR = path.join(SERVER_ROOT, 'public');
const ADMIN_DIR = path.join(SERVER_ROOT, 'admin');
const PROJECT_UPLOAD_DIR = path.join(PUBLIC_DIR, 'projects');
const PROJECT_PDF_DIR = path.join(PROJECT_UPLOAD_DIR, 'pdfs');
const IMAGE_UPLOAD_DIR = path.join(PUBLIC_DIR, 'img');
const DATA_DIR = path.join(PROJECT_ROOT, 'data');

module.exports = {
  SERVER_ROOT,
  PROJECT_ROOT,
  PUBLIC_DIR,
  ADMIN_DIR,
  PROJECT_UPLOAD_DIR,
  PROJECT_PDF_DIR,
  IMAGE_UPLOAD_DIR,
  DATA_DIR,
};

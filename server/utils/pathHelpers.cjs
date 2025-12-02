const path = require('path');

// server 폴더 기준 절대 경로
const SERVER_ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.resolve(SERVER_ROOT, '..');

const PUBLIC_DIR = path.join(SERVER_ROOT, 'public');
const ADMIN_DIR = path.join(SERVER_ROOT, 'admin');
const PROJECT_UPLOAD_DIR = path.join(PUBLIC_DIR, 'projects');
const PROJECT_PDF_DIR = path.join(PROJECT_UPLOAD_DIR, 'pdfs');
const DATA_DIR = path.join(PROJECT_ROOT, 'data');

module.exports = {
  SERVER_ROOT,
  PROJECT_ROOT,
  PUBLIC_DIR,
  ADMIN_DIR,
  PROJECT_UPLOAD_DIR,
  PROJECT_PDF_DIR,
  DATA_DIR,
};

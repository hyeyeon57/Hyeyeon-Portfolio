const express = require('express');
const path = require('path');
const { existsSync } = require('fs');
const { requireAuth } = require('../../middleware/auth.cjs');
const { ADMIN_DIR } = require('../../utils/pathHelpers.cjs');

const router = express.Router();

const sendHtml = (res, filePath, errorMessage) => {
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(errorMessage, err);
      res.status(500).send(errorMessage);
    }
  });
};

router.get('/', requireAuth, (req, res) => {
  const adminPath = path.join(ADMIN_DIR, 'dashboard.html');
  sendHtml(res, adminPath, '관리자 페이지를 불러올 수 없습니다.');
});

router.get('/create', requireAuth, (req, res) => {
  const createPath = path.join(ADMIN_DIR, 'project-create.html');
  sendHtml(res, createPath, '프로젝트 생성 페이지를 불러올 수 없습니다.');
});

router.get('/login', (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    return res.redirect('/admin');
  }

  const loginPath = path.join(ADMIN_DIR, 'login.html');
  if (!existsSync(loginPath)) {
    return res.status(500).send('로그인 페이지를 불러올 수 없습니다.');
  }
  return res.sendFile(loginPath);
});

router.get('/viewer', (req, res) => {
  const adminPath = path.join(ADMIN_DIR, 'dashboard.html');
  if (!existsSync(adminPath)) {
    return res.status(500).send('관리자 페이지를 불러올 수 없습니다.');
  }
  return res.sendFile(adminPath);
});

module.exports = router;

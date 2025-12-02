require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const { ALLOWED_ORIGINS, SESSION_CONFIG, ADMIN_CONFIG } = require('./config/constants');
const adminRoutes = require('./admin/routes/adminRoutes.cjs');
const authRoutes = require('./admin/routes/authRoutes.cjs');
const visitorRoutes = require('./routes/visitorRoutes.cjs');
const projectRoutes = require('./routes/projectRoutes.cjs');
const contactRoutes = require('./routes/contactRoutes.cjs');
const fileRoutes = require('./routes/fileRoutes.cjs');
const healthRoutes = require('./routes/healthRoutes.cjs');
const { PUBLIC_DIR } = require('./utils/pathHelpers.cjs');
const { asyncHandler } = require('./utils/asyncHandler.cjs');
const { connectDB } = require('./config/database.cjs');

/**
 * 공통 Express 앱 생성기
 * @param {object} options
 * @param {boolean} options.withDbMiddleware - 요청 시 DB 연결을 보장할지 (서버리스용)
 * @returns {import('express').Express}
 */
const createApp = ({ withDbMiddleware = false } = {}) => {
  const app = express();

  // 미들웨어
  app.use(cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(session({
    name: SESSION_CONFIG.COOKIE_NAME,
    secret: SESSION_CONFIG.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // 개발 환경에서는 false, 프로덕션에서는 true
      httpOnly: true,
      sameSite: 'lax', // CSRF 보호
      path: '/',
      maxAge: SESSION_CONFIG.MAX_AGE_MS,
    },
  }));

  if (withDbMiddleware) {
    app.use(asyncHandler(async (req, res, next) => {
      if (connectDB) {
        await connectDB();
      }
      next();
    }));
  }

  // 루트 → 로그인 페이지
  app.get('/', (req, res) => res.redirect('/admin/login'));

  // 관리자/정적 페이지
  app.use('/admin', adminRoutes);
  app.use('/bo-api/admin', adminRoutes); // 서버리스 경로 대응

  // 관리자 템플릿/모듈 (대시보드 JS import용)
  const adminTemplatesDir = path.join(__dirname, 'admin', 'templates');
  app.use('/templates', express.static(adminTemplatesDir));
  app.use('/bo-api/templates', express.static(adminTemplatesDir));

  // 인증 API (/api와 /bo-api 공용)
  app.use('/api/auth', authRoutes);
  app.use('/bo-api/auth', authRoutes);

  // 방문자
  app.use('/api/visitors', visitorRoutes);
  app.use('/bo-api/visitors', visitorRoutes);

  // 프로젝트
  app.use('/api/projects', projectRoutes);
  app.use('/bo-api/projects', projectRoutes);

  // 연락
  app.use('/api/contacts', contactRoutes);
  app.use('/bo-api/contacts', contactRoutes);

  // 파일(PDF) 업로드
  app.use('/api', fileRoutes);
  app.use('/bo-api', fileRoutes);

  // bo-api 프록시 (서버 환경에서만 사용, 서버리스에서는 무한 리다이렉트 방지)
  if (!process.env.SERVERLESS_EXPRESS) {
    app.use('/bo-api', (req, res, next) => {
      if (req.path === '/visitors/monthly') return next();
      if (req.path === '/upload-pdf') return next();
      return res.redirect(307, '/api' + req.url);
    });
  }

  // 헬스체크
  app.use('/api', healthRoutes);
  app.use('/bo-api', healthRoutes);

  // 정적 파일
  app.use(express.static(PUBLIC_DIR));

  return app;
};

module.exports = { createApp, ADMIN_CONFIG };

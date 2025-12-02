require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
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
    secret: SESSION_CONFIG.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
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

  // 인증 API (/api와 /api/bo 공용)
  app.use('/api/auth', authRoutes);
  app.use('/api/bo/auth', authRoutes);

  // 방문자
  app.use('/api/visitors', visitorRoutes);
  app.use('/bo-api/visitors', visitorRoutes);

  // 프로젝트
  app.use('/api/projects', projectRoutes);

  // 연락
  app.use('/api/contacts', contactRoutes);

  // 파일(PDF) 업로드
  app.use('/api', fileRoutes);
  app.use('/bo-api', fileRoutes);

  // bo-api 프록시 (monthly/ upload-pdf 제외)
  app.use('/bo-api', (req, res, next) => {
    if (req.path === '/visitors/monthly') return next();
    if (req.path === '/upload-pdf') return next();
    return res.redirect(307, '/api' + req.url);
  });

  // 헬스체크
  app.use('/api', healthRoutes);

  // 정적 파일
  app.use(express.static(PUBLIC_DIR));

  return app;
};

module.exports = { createApp, ADMIN_CONFIG };

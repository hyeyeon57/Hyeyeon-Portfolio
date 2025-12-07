require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

// 모듈 로드를 try-catch로 감싸서 에러 처리
let ALLOWED_ORIGINS, SESSION_CONFIG, ADMIN_CONFIG;
let adminRoutes, authRoutes, visitorRoutes, projectRoutes, contactRoutes, fileRoutes, documentRoutes, healthRoutes;
let PUBLIC_DIR;
let asyncHandler, connectDB;

try {
  const constants = require('./config/constants');
  ALLOWED_ORIGINS = constants.ALLOWED_ORIGINS;
  SESSION_CONFIG = constants.SESSION_CONFIG;
  ADMIN_CONFIG = constants.ADMIN_CONFIG;
  
  adminRoutes = require('./admin/routes/adminRoutes.cjs');
  authRoutes = require('./admin/routes/authRoutes.cjs');
  visitorRoutes = require('./routes/visitorRoutes.cjs');
  projectRoutes = require('./routes/projectRoutes.cjs');
  contactRoutes = require('./routes/contactRoutes.cjs');
  fileRoutes = require('./routes/fileRoutes.cjs');
  documentRoutes = require('./routes/documentRoutes.cjs');
  healthRoutes = require('./routes/healthRoutes.cjs');
  
  const pathHelpers = require('./utils/pathHelpers.cjs');
  PUBLIC_DIR = pathHelpers.PUBLIC_DIR;
  
  asyncHandler = require('./utils/asyncHandler.cjs').asyncHandler;
  connectDB = require('./config/database.cjs').connectDB;
  
  console.log('[app.cjs] All modules loaded successfully');
} catch (moduleError) {
  console.error('[app.cjs] Module loading failed:', {
    message: moduleError?.message,
    stack: moduleError?.stack,
    name: moduleError?.name,
  });
  throw moduleError; // 모듈 로드 실패는 치명적이므로 throw
}

/**
 * 공통 Express 앱 생성기
 * @param {object} options
 * @param {boolean} options.withDbMiddleware - 요청 시 DB 연결을 보장할지 (서버리스용)
 * @returns {import('express').Express}
 */
const createApp = ({ withDbMiddleware = false } = {}) => {
  try {
    const app = express();

    // 에러 핸들링 미들웨어 (라우트 이후에 추가)
    // Express는 4개 파라미터를 가진 함수를 에러 핸들러로 인식

  // 미들웨어
  app.use(cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
      try {
        if (connectDB) {
          await connectDB();
        }
      } catch (dbError) {
        // MongoDB 연결 실패해도 요청은 계속 처리 (에러는 로그만)
        console.warn('[createApp] MongoDB connection failed in middleware:', dbError?.message);
        // 연결 실패해도 요청은 계속 진행 (일부 엔드포인트는 DB 없이도 작동 가능)
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

  // 문서 관리 (이력서/자기소개서)
  app.use('/api/documents', documentRoutes);
  app.use('/bo-api/documents', documentRoutes);

  // 파일(PDF) 업로드 - 더 구체적인 경로이므로 문서 라우트 이후에 등록
  app.use('/api/upload-pdf', fileRoutes);
  app.use('/bo-api/upload-pdf', fileRoutes);

  // bo-api 프록시 (서버 환경에서만 사용, 서버리스에서는 무한 리다이렉트 방지)
  if (!process.env.SERVERLESS_EXPRESS) {
    app.use('/bo-api', (req, res, next) => {
      // 이미 등록된 라우트는 통과
      if (req.path.startsWith('/visitors')) return next();
      if (req.path.startsWith('/projects')) return next();
      if (req.path.startsWith('/contacts')) return next();
      if (req.path.startsWith('/documents')) return next();
      if (req.path.startsWith('/auth')) return next();
      if (req.path.startsWith('/admin')) return next();
      if (req.path.startsWith('/templates')) return next();
      if (req.path === '/upload-pdf') return next();
      return res.redirect(307, '/api' + req.url);
    });
  }

  // 헬스체크
  app.use('/api', healthRoutes);
  app.use('/bo-api', healthRoutes);

  // 정적 파일
  app.use(express.static(PUBLIC_DIR));

  // 에러 핸들링 미들웨어 (모든 라우트 이후에 추가)
  app.use((err, req, res, next) => {
    console.error('[Express] Unhandled error:', err);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: err?.message || 'Unknown error',
        ...(process.env.NODE_ENV === 'development' && { stack: err?.stack }),
      });
    }
  });

  // 404 핸들러
  app.use((req, res) => {
    if (!res.headersSent) {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.url} not found`,
      });
    }
  });

    console.log('[createApp] Express app initialization completed successfully');
    return app;
  } catch (error) {
    console.error('[createApp] Error creating Express app:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      isVercel: !!process.env.VERCEL,
      nodeEnv: process.env.NODE_ENV,
    });
    throw error; // 에러를 다시 throw하여 호출자가 처리할 수 있도록
  }
};

module.exports = { createApp, ADMIN_CONFIG };

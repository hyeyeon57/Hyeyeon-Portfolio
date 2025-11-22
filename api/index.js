// Vercel 서버리스 함수로 Express 서버 래핑
const express = require('express');
const cors = require('cors');
const path = require('path');
const { existsSync, mkdirSync, readdirSync, readFileSync } = require('fs');
const multer = require('multer');
const mongoose = require('mongoose');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// 상대 경로로 모듈 import
const { connectDB } = require('../server/config/database.cjs');
const Project = require('../server/models/Project.cjs');
const Visitor = require('../server/models/Visitor.cjs');
const Contact = require('../server/models/Contact.cjs');

const app = express();

// Vercel 서버리스 환경 감지
const isVercel = process.env.VERCEL === '1';

// 미들웨어
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3005',
    'https://hyeyeon-portfolio.vercel.app',
    'https://hyeyeon-portfolio-admin.vercel.app',
    process.env.FRONTEND_URL || 'https://hyeyeon-portfolio.vercel.app',
    process.env.BACKOFFICE_URL || 'https://hyeyeon-portfolio-admin.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 세션 설정 (Vercel 서버리스 환경에 맞게 MemoryStore 사용)
// 주의: Vercel 서버리스 환경에서는 각 함수 인스턴스가 독립적이므로
// 세션은 신뢰할 수 없습니다. JWT 쿠키를 주 인증 방식으로 사용합니다.
const isProduction = isVercel || process.env.NODE_ENV === 'production';
app.use(session({
  secret: process.env.SESSION_SECRET || 'vibe-coding-portfolio-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000 // 24시간
  }),
  cookie: {
    secure: isProduction, // Vercel 환경 고려 (HTTPS 필수)
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24시간
    sameSite: isProduction ? 'none' : 'lax', // 크로스 도메인 쿠키 전달 지원 (프로덕션: none, 개발: lax)
    path: '/', // 모든 경로에서 쿠키 사용 가능
    // domain은 명시하지 않음 (현재 도메인에 자동 설정)
  },
  name: 'admin.sid' // 세션 쿠키 이름 명시
}));

// 파일 업로드 설정 (Vercel에서는 /tmp 디렉토리 사용)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = '/tmp/projects'; // Vercel의 임시 디렉토리
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}_${originalName}`);
  }
});

const upload = multer({ storage });

// 관리자 계정 정보
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'hing0915';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dpffla525';

// JWT 설정
// SESSION_SECRET을 사용 (JWT와 세션 모두 동일한 secret 사용)
const JWT_SECRET = process.env.SESSION_SECRET || 'vibe-coding-portfolio-secret-key-2025';
const JWT_COOKIE_NAME = 'admin_token';
const JWT_EXPIRES_IN = '24h'; // 24시간

// JWT_SECRET 로드 확인 로그
console.log('🔑 JWT_SECRET 초기화 (SESSION_SECRET 사용):', {
  hasSessionSecretEnv: !!process.env.SESSION_SECRET,
  finalJWTSecret: JWT_SECRET ? '설정됨' : '없음',
  jwtSecretLength: JWT_SECRET?.length || 0,
  jwtSecretPreview: JWT_SECRET ? JWT_SECRET.substring(0, 10) + '...' : '없음',
  isVercel: isVercel,
  note: 'SESSION_SECRET을 JWT와 세션 모두에 사용'
});

// 로그인 체크 미들웨어 (JWT 우선, 세션 폴백)
// Vercel 서버리스 환경에서는 JWT 쿠키가 주 인증 방식입니다.
const requireAuth = (req, res, next) => {
  // 1. JWT 토큰 확인 (쿠키 또는 Authorization 헤더)
  const token = req.cookies[JWT_COOKIE_NAME] || req.headers.authorization?.replace('Bearer ', '');
  
  // 디버깅: 쿠키 정보 확인
  const allCookies = req.headers.cookie || '';
  const hasAdminToken = allCookies.includes(JWT_COOKIE_NAME);
  
  // 상세 디버깅 로그 (프로덕션에서는 제거 가능)
  const debugInfo = {
    path: req.path,
    method: req.method,
    hasToken: !!token,
    hasAdminTokenCookie: hasAdminToken,
    cookieHeader: allCookies ? '있음' : '없음',
    cookieCount: allCookies.split(';').length,
    userAgent: req.headers['user-agent']?.substring(0, 50),
    origin: req.headers.origin,
    referer: req.headers.referer
  };
  
  console.log('🔐 인증 체크:', debugInfo);
  
  // 2. JWT 토큰 검증 (우선순위 1)
  if (token) {
    try {
      // JWT_SECRET 확인 로그
      console.log('🔑 JWT 검증 시도:', {
        tokenLength: token.length,
        tokenPreview: token.substring(0, 20) + '...',
        hasJWTSecret: !!JWT_SECRET,
        jwtSecretLength: JWT_SECRET?.length || 0,
        jwtSecretPreview: JWT_SECRET ? JWT_SECRET.substring(0, 10) + '...' : '없음'
      });
      
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      console.log('✅ JWT 인증 성공:', {
        username: decoded.username,
        path: req.path,
        decoded: decoded
      });
      return next();
    } catch (error) {
      console.log('❌ JWT 토큰 검증 실패:', {
        error: error.message,
        errorName: error.name,
        path: req.path,
        tokenLength: token.length,
        tokenPreview: token.substring(0, 30) + '...',
        hasJWTSecret: !!JWT_SECRET,
        jwtSecretLength: JWT_SECRET?.length || 0
      });
      // JWT 실패 시 세션 확인으로 폴백
    }
  }
  
  // 3. 세션 확인 (폴백, Vercel에서는 신뢰할 수 없음)
  if (req.session && req.session.isAuthenticated) {
    console.log('✅ 세션 인증 성공 (폴백):', {
      username: req.session.username,
      path: req.path,
      sessionID: req.sessionID
    });
    return next();
  }
  
  // 4. 인증 실패 - 상세 로그
  console.log('🔐 인증 실패 - 리다이렉트:', {
    path: req.path,
    hasToken: !!token,
    hasSession: !!req.session,
    isAuthenticated: req.session?.isAuthenticated,
    cookies: req.headers.cookie ? '있음' : '없음',
    cookieHeader: allCookies.substring(0, 200) // 처음 200자
  });
  
  // 5. AJAX 요청인 경우 JSON 응답
  if (req.headers['x-requested-with'] === 'XMLHttpRequest' || 
      req.headers['content-type']?.includes('application/json') ||
      req.headers['accept']?.includes('application/json')) {
    return res.status(401).json({ 
      success: false, 
      error: '인증이 필요합니다.',
      redirect: '/admin/login'
    });
  }
  
  // 6. 일반 요청인 경우 로그인 페이지로 리다이렉트
  res.redirect('/admin/login');
};

// 루트 경로 핸들러 (Vercel rewrites로 인해 루트로 요청이 올 수 있음)
app.get('/', (req, res) => {
  console.log('🏠 루트 경로 요청:', {
    url: req.url,
    path: req.path,
    method: req.method,
    headers: {
      cookie: req.headers.cookie ? '있음' : '없음',
      referer: req.headers.referer
    }
  });
  
  // 관리자 페이지로 리다이렉트
  return res.redirect('/admin');
});

// 백오피스 관리자 페이지 라우트 (정적 파일 서빙보다 먼저 정의)
// Vercel 서버리스 환경에서 안전한 파일 경로 생성
const getAdminFilePath = (filename) => {
  // Vercel 환경에서는 process.cwd() 사용, 로컬에서는 __dirname 사용
  const basePath = isVercel ? process.cwd() : __dirname;
  const filePath = path.join(basePath, 'server', 'admin', filename);
  
  // 파일 존재 여부 확인 및 로깅
  if (!existsSync(filePath)) {
    console.error(`❌ 파일을 찾을 수 없음: ${filePath}`);
    console.error(`현재 작업 디렉토리: ${process.cwd()}`);
    console.error(`__dirname: ${__dirname}`);
    console.error(`isVercel: ${isVercel}`);
  } else {
    console.log(`✅ 파일 경로 확인: ${filePath}`);
  }
  
  return filePath;
};

app.get('/admin/login', (req, res) => {
  // JWT 토큰 확인
  const token = req.cookies[JWT_COOKIE_NAME] || req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      // JWT 토큰이 유효하면 관리자 페이지로 리다이렉트
      return res.redirect('/admin');
    } catch (error) {
      // JWT 토큰이 유효하지 않으면 로그인 페이지 표시
    }
  }
  
  // 세션 확인
  if (req.session && req.session.isAuthenticated) {
    return res.redirect('/admin');
  }
  
  const loginPath = getAdminFilePath('login.html');
  res.sendFile(loginPath, (err) => {
    if (err) {
      console.error('❌ 로그인 페이지 로드 오류:', err);
      res.status(500).send('로그인 페이지를 불러올 수 없습니다.');
    }
  });
});

app.get('/admin/viewer', (req, res) => {
  const adminPath = getAdminFilePath('index.html');
  res.sendFile(adminPath, (err) => {
    if (err) {
      console.error('❌ 관리자 페이지 로드 오류:', err);
      res.status(500).send('관리자 페이지를 불러올 수 없습니다.');
    }
  });
});

app.get('/admin', requireAuth, (req, res) => {
  const adminPath = getAdminFilePath('index.html');
  res.sendFile(adminPath, (err) => {
    if (err) {
      console.error('❌ 관리자 페이지 로드 오류:', err);
      res.status(500).send('관리자 페이지를 불러올 수 없습니다.');
    }
  });
});

app.get('/admin/create', requireAuth, (req, res) => {
  console.log('📝 /admin/create 요청 처리:', {
    authenticated: !!req.user,
    username: req.user?.username,
    path: req.path,
    url: req.url,
    hasToken: !!req.cookies[JWT_COOKIE_NAME],
    cookies: req.headers.cookie ? '있음' : '없음',
    origin: req.headers.origin,
    referer: req.headers.referer
  });
  
  const createPath = getAdminFilePath('create.html');
  res.sendFile(createPath, (err) => {
    if (err) {
      console.error('❌ 프로젝트 생성 페이지 로드 오류:', err);
      res.status(500).send('프로젝트 생성 페이지를 불러올 수 없습니다.');
    }
  });
});

// API Routes
// 인증 API 핸들러
const handleLogin = (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // 세션 설정 (기존 방식 유지)
    req.session.isAuthenticated = true;
    req.session.username = username;
    
    // JWT 토큰 생성
    console.log('🔐 로그인 시 JWT 토큰 생성:', {
      username: username,
      jwtSecretLength: JWT_SECRET?.length || 0,
      jwtSecretPreview: JWT_SECRET ? JWT_SECRET.substring(0, 10) + '...' : '없음',
      expiresIn: JWT_EXPIRES_IN
    });
    
    const token = jwt.sign(
      { username, id: 'admin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    console.log('✅ JWT 토큰 생성 완료:', {
      tokenLength: token.length,
      tokenPreview: token.substring(0, 30) + '...'
    });
    
    // JWT 토큰을 쿠키에 설정
    // Vercel 환경에서는 항상 HTTPS이므로 secure: true
    const isProduction = isVercel || process.env.NODE_ENV === 'production';
    
    // 쿠키 옵션 설정 (Vercel 서버리스 환경 최적화)
    // Vercel에서는 항상 HTTPS이므로 secure: true 필수
    // 크로스 도메인 쿠키 전달을 위해 sameSite: 'none' 필요 (FO → BO)
    const cookieOptions = {
      httpOnly: true, // XSS 공격 방지
      secure: isProduction, // HTTPS에서만 전송 (Vercel은 항상 HTTPS, sameSite: 'none'일 때 필수)
      sameSite: isProduction ? 'none' : 'lax', // 크로스 도메인 쿠키 전달 지원 (프로덕션: none, 개발: lax)
      maxAge: 24 * 60 * 60 * 1000, // 24시간
      path: '/', // 모든 경로에서 쿠키 사용 가능
      // domain은 명시하지 않음 (현재 도메인에 자동 설정)
      // Vercel에서는 도메인을 명시하지 않아야 모든 서브도메인에서 작동
    };
    
    console.log('🍪 JWT 쿠키 설정:', {
      cookieName: JWT_COOKIE_NAME,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge,
      isVercel: isVercel,
      isProduction: isProduction,
      host: req.headers.host,
      origin: req.headers.origin
    });
    
    // 쿠키 설정
    res.cookie(JWT_COOKIE_NAME, token, cookieOptions);
    
    // 쿠키가 제대로 설정되었는지 확인을 위한 응답 헤더 로깅
    const setCookieHeader = res.getHeader('Set-Cookie');
    console.log('✅ 쿠키 설정 완료:', {
      setCookieHeader: setCookieHeader ? '설정됨' : '설정 안됨',
      cookieHeaderPreview: setCookieHeader ? (Array.isArray(setCookieHeader) ? setCookieHeader[0].substring(0, 100) : setCookieHeader.substring(0, 100)) : '없음',
      tokenLength: token.length,
      cookieOptions: {
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        httpOnly: cookieOptions.httpOnly,
        path: cookieOptions.path
      },
      origin: req.headers.origin,
      host: req.headers.host
    });
    
    // 세션 저장 확인
    req.session.save((err) => {
      if (err) {
        console.error('세션 저장 오류:', err);
        // 세션 저장 실패해도 JWT가 있으면 계속 진행
      }
      
      console.log('✅ 로그인 성공:', {
        sessionID: req.sessionID,
        username: username,
        hasJWT: true,
        isAuthenticated: req.session.isAuthenticated
      });
      
      res.json({ success: true, message: '로그인 성공' });
    });
  } else {
    res.status(401).json({ success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
  }
};

const handleLogout = (req, res) => {
  // JWT 쿠키 삭제
  const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
  res.clearCookie(JWT_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax', // 크로스 도메인 쿠키 삭제 지원
    path: '/'
  });
  
  // 세션 삭제
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: '로그아웃 실패' });
    }
    res.json({ success: true, message: '로그아웃 성공' });
  });
};

const handleAuthCheck = (req, res) => {
  // JWT 토큰 확인
  const token = req.cookies[JWT_COOKIE_NAME] || req.headers.authorization?.replace('Bearer ', '');
  let authenticated = false;
  let username = null;
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      authenticated = true;
      username = decoded.username;
    } catch (error) {
      // JWT 토큰이 유효하지 않음
    }
  }
  
  // JWT가 없으면 세션 확인
  if (!authenticated && req.session && req.session.isAuthenticated) {
    authenticated = true;
    username = req.session.username;
  }
  
  // 디버깅 로그
  console.log('🔍 인증 상태 확인:', {
    hasToken: !!token,
    hasSession: !!req.session,
    isAuthenticated: authenticated,
    username: username
  });
  
  res.json({
    success: true,
    authenticated: authenticated,
    username: username
  });
};

// /api/auth와 /api/bo/auth 모두 처리
app.post('/api/auth/login', handleLogin);
app.post('/api/bo/auth/login', handleLogin);
app.post('/api/auth/logout', handleLogout);
app.post('/api/bo/auth/logout', handleLogout);
app.get('/api/auth/check', handleAuthCheck);
app.get('/api/bo/auth/check', handleAuthCheck);

// MongoDB 연결 초기화
let dbConnected = false;
const initDB = async () => {
  if (!dbConnected) {
    dbConnected = await connectDB();
  }
  return dbConnected;
};

// 정적 프로젝트 데이터를 MongoDB로 자동 마이그레이션
const migrateStaticProjects = async () => {
  try {
    // MongoDB 연결 시도
    await initDB();
    
    // MongoDB 연결 확인
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️  MongoDB 연결되지 않음, 마이그레이션 건너뜀');
      return false;
    }
    
    // 이미 프로젝트가 있는지 확인
    const existingCount = await Project.countDocuments();
    if (existingCount > 0) {
      console.log(`✅ MongoDB에 이미 ${existingCount}개의 프로젝트가 있습니다. 마이그레이션 건너뜀`);
      return true;
    }
    
    // 정적 프로젝트 데이터 로드
    const projectsJsonPath = path.join(__dirname, '../data/projects.json');
    
    if (!existsSync(projectsJsonPath)) {
      console.log('⚠️  data/projects.json 파일을 찾을 수 없습니다. 마이그레이션 건너뜀');
      return false;
    }
    
    const projectsData = JSON.parse(readFileSync(projectsJsonPath, 'utf-8'));
    
    if (projectsData.length === 0) {
      console.log('⚠️  마이그레이션할 프로젝트 데이터가 없습니다.');
      return false;
    }
    
    console.log(`\n📦 ${projectsData.length}개의 정적 프로젝트를 MongoDB로 마이그레이션합니다...\n`);
    
    let added = 0;
    let updated = 0;
    let skipped = 0;
    
    for (const projectData of projectsData) {
      try {
        // id로 기존 프로젝트 찾기
        const existing = await Project.findOne({ id: projectData.id });
        
        if (existing) {
          // 기존 프로젝트 업데이트
          await Project.findOneAndUpdate(
            { id: projectData.id },
            projectData,
            { new: true, runValidators: true }
          );
          updated++;
        } else {
          // 새 프로젝트 추가
          await Project.create(projectData);
          added++;
        }
      } catch (error) {
        console.error(`❌ 프로젝트 "${projectData.title}" (ID: ${projectData.id}) 처리 실패:`, error.message);
        skipped++;
      }
    }
    
    console.log(`✨ 마이그레이션 완료! (추가: ${added}개, 업데이트: ${updated}개, 실패: ${skipped}개)\n`);
    return added > 0 || updated > 0;
  } catch (error) {
    console.error('❌ 마이그레이션 오류:', error);
    console.error('❌ 마이그레이션 오류 상세:', error.stack);
    return false;
  }
};

// 방문자 로그 API
const handlePostVisitor = async (req, res) => {
  try {
    await initDB();
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: false, error: 'MongoDB에 연결되지 않았습니다.' });
    }
    const { ip, userAgent, path: visitPath } = req.body;
    const clientIp = ip || req.ip || req.connection.remoteAddress;
    const clientUserAgent = userAgent || req.get('user-agent');
    const clientPath = visitPath || '/';
    const now = new Date();
    const fiveSecondsAgo = new Date(now.getTime() - 5 * 1000);

    const existingVisit = await Visitor.findOne({
      ip: clientIp,
      userAgent: clientUserAgent,
      path: clientPath,
      date: { $gte: fiveSecondsAgo, $lt: now }
    });

    if (existingVisit) {
      await Visitor.updateOne(
        { _id: existingVisit._id },
        { $set: { date: now } }
      );
      return res.json({ success: true, message: '방문자 로그 업데이트 완료 (중복 방지)' });
    }

    await Visitor.create({
      ip: clientIp,
      userAgent: clientUserAgent,
      path: clientPath,
      date: now,
    });

    res.json({ success: true, message: '방문자 로그 저장 완료' });
  } catch (error) {
    console.error('❌ 방문자 로그 저장 오류:', error);
    res.json({ success: false, error: '방문자 로그 저장 실패' });
  }
};

app.post('/api/visitors', handlePostVisitor);
app.post('/api/bo/visitors', handlePostVisitor);

const handleGetVisitorStats = async (req, res) => {
  try {
    await initDB();
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        today: 0,
        total: 0
      });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCount = await Visitor.countDocuments({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const todayCountCreatedAt = await Visitor.countDocuments({
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const finalTodayCount = Math.max(todayCount, todayCountCreatedAt);
    const totalCount = await Visitor.countDocuments();

    res.json({
      success: true,
      today: finalTodayCount,
      total: totalCount
    });
  } catch (error) {
    console.error('❌ 방문자 통계 조회 오류:', error);
    res.json({
      success: true,
      today: 0,
      total: 0
    });
  }
};

app.get('/api/visitors/stats', handleGetVisitorStats);
app.get('/api/bo/visitors/stats', handleGetVisitorStats);

const handleGetVisitors = async (req, res) => {
  try {
    await initDB();
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: false,
        error: 'MongoDB에 연결되지 않았습니다.'
      });
    }
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const visitors = await Visitor.find()
      .sort({ date: -1, createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Visitor.countDocuments();

    res.json({
      success: true,
      data: visitors,
      total: total,
      page: page,
      limit: limit
    });
  } catch (error) {
    console.error('❌ 방문자 목록 조회 오류:', error);
    res.status(500).json({ success: false, error: '방문자 목록을 불러오는데 실패했습니다.' });
  }
};

app.get('/api/visitors', handleGetVisitors);
app.get('/api/bo/visitors', handleGetVisitors);

// 프로젝트 목록 조회 (백오피스 API)
const handleGetProjects = async (req, res) => {
  try {
    // MongoDB 연결 시도
    const connected = await initDB();
    
    if (!connected || mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB 연결 실패');
      return res.status(503).json({
        success: false,
        error: 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.'
      });
    }
    
    // 프로젝트가 없으면 자동 마이그레이션 실행
    let projectCount = 0;
    try {
      projectCount = await Project.countDocuments();
      if (projectCount === 0) {
        console.log('📦 프로젝트가 없어 자동 마이그레이션을 실행합니다...');
        const migrationResult = await migrateStaticProjects();
        if (migrationResult) {
          console.log('✅ 마이그레이션 성공');
        } else {
          console.log('⚠️  마이그레이션 실패, 빈 배열 반환');
        }
        // 마이그레이션 후 다시 카운트
        projectCount = await Project.countDocuments();
      }
    } catch (migrationError) {
      console.error('❌ 마이그레이션 중 오류:', migrationError);
      // 마이그레이션 실패해도 계속 진행
    }
    
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('프로젝트 조회 오류:', error);
    res.status(500).json({ success: false, error: '프로젝트를 불러오는데 실패했습니다: ' + error.message });
  }
};

// /api/projects와 /api/bo/projects 모두 처리 (무한 루프 방지)
app.get('/api/projects', handleGetProjects);
app.get('/api/bo/projects', handleGetProjects);

// 프로젝트 생성 핸들러
const handlePostProject = async (req, res) => {
  try {
    console.log('📝 프로젝트 생성 요청:', {
      method: req.method,
      path: req.path,
      url: req.url,
      hasAuth: !!req.user,
      username: req.user?.username,
      bodyKeys: Object.keys(req.body),
      contentType: req.headers['content-type'],
      hasCookies: !!req.headers.cookie,
      origin: req.headers.origin,
      referer: req.headers.referer
    });

    // 인증 확인 (requireAuth를 통과했지만 추가 확인)
    if (!req.user && !req.session?.isAuthenticated) {
      console.error('❌ 인증되지 않은 프로젝트 생성 시도');
      return res.status(401).json({
        success: false,
        error: '인증이 필요합니다.'
      });
    }

    await initDB();
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB 연결 실패');
      return res.status(503).json({
        success: false,
        error: 'MongoDB가 연결되지 않았습니다.'
      });
    }
    
    const projectData = req.body.project ? JSON.parse(req.body.project) : req.body;
    
    console.log('📝 프로젝트 데이터:', {
      title: projectData.title,
      category: projectData.category,
      hasImages: !!projectData.images,
      imageCount: projectData.images?.length || 0
    });
    if (req.files && Array.isArray(req.files)) {
      // Vercel에서는 파일을 클라우드 스토리지에 업로드해야 함
      // 여기서는 경로만 저장 (실제 배포 시 S3 등 사용 권장)
      const imagePaths = req.files.map(file => `/tmp/projects/${file.filename}`);
      projectData.images = imagePaths;
    }
    if (!projectData.id) {
      projectData.id = Date.now().toString();
    }
    
    const newProject = await Project.create(projectData);
    
    console.log('✅ 프로젝트 생성 성공:', {
      id: newProject.id,
      title: newProject.title,
      _id: newProject._id
    });
    
    res.json({ success: true, data: newProject });
  } catch (error) {
    console.error('❌ 프로젝트 생성 오류:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // MongoDB 검증 오류 처리
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message).join(', ');
      return res.status(400).json({ 
        success: false, 
        error: `입력 데이터 오류: ${errors}` 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message || '프로젝트 생성에 실패했습니다.' 
    });
  }
};

// 프로젝트 수정 핸들러
const handlePutProject = async (req, res) => {
  try {
    await initDB();
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'MongoDB가 연결되지 않았습니다.'
      });
    }
    let project = await Project.findById(req.params.id);
    if (!project) {
      project = await Project.findOne({ id: req.params.id });
    }
    if (!project) {
      return res.status(404).json({ success: false, error: '프로젝트를 찾을 수 없습니다.' });
    }

    const projectData = req.body.project ? JSON.parse(req.body.project) : req.body;
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const imagePaths = req.files.map(file => `/tmp/projects/${file.filename}`);
      projectData.images = [...(project.images || []), ...imagePaths];
    }
    projectData.id = project.id || req.params.id;

    const updatedProject = await Project.findOneAndUpdate(
      { _id: project._id },
      projectData,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedProject });
  } catch (error) {
    console.error('프로젝트 수정 오류:', error);
    res.status(500).json({ success: false, error: '프로젝트 수정에 실패했습니다.' });
  }
};

// 프로젝트 삭제 핸들러
const handleDeleteProject = async (req, res) => {
  try {
    await initDB();
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'MongoDB가 연결되지 않았습니다.'
      });
    }
    let project = await Project.findById(req.params.id);
    if (!project) {
      project = await Project.findOne({ id: req.params.id });
    }
    if (!project) {
      return res.status(404).json({ success: false, error: '프로젝트를 찾을 수 없습니다.' });
    }

    await Project.findByIdAndDelete(project._id);
    res.json({ success: true, message: '프로젝트가 삭제되었습니다.' });
  } catch (error) {
    console.error('프로젝트 삭제 오류:', error);
    res.status(500).json({ success: false, error: '프로젝트 삭제에 실패했습니다.' });
  }
};

// /api/projects와 /api/bo/projects 모두 처리
app.post('/api/projects', requireAuth, upload.array('images', 9), handlePostProject);
app.post('/api/bo/projects', requireAuth, upload.array('images', 9), handlePostProject);
app.put('/api/projects/:id', upload.array('images', 9), handlePutProject);
app.put('/api/bo/projects/:id', upload.array('images', 9), handlePutProject);
app.delete('/api/projects/:id', handleDeleteProject);
app.delete('/api/bo/projects/:id', handleDeleteProject);

// 강제 마이그레이션 API (관리자용) - 두 경로 모두 지원
const handleMigrate = async (req, res) => {
  try {
    await initDB();
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.'
      });
    }
    
    const result = await migrateStaticProjects();
    if (result) {
      const projectCount = await Project.countDocuments();
      res.json({ 
        success: true, 
        message: '마이그레이션이 완료되었습니다.',
        projectCount: projectCount
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: '마이그레이션에 실패했습니다.' 
      });
    }
  } catch (error) {
    console.error('마이그레이션 API 오류:', error);
    res.status(500).json({ 
      success: false, 
      error: '마이그레이션 중 오류가 발생했습니다: ' + error.message 
    });
  }
};

app.post('/api/migrate', requireAuth, handleMigrate);
app.post('/api/bo/migrate', requireAuth, handleMigrate);

// 프로젝트 상세 조회
app.get('/api/projects/:id', async (req, res) => {
  try {
    await initDB();
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'MongoDB가 연결되지 않았습니다.'
      });
    }
    let project = await Project.findById(req.params.id);
    if (!project) {
      project = await Project.findOne({ id: req.params.id });
    }
    if (project) {
      res.json({ success: true, data: project });
    } else {
      res.status(404).json({ success: false, error: '프로젝트를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('프로젝트 조회 오류:', error);
    res.status(500).json({ success: false, error: '프로젝트를 불러오는데 실패했습니다.' });
  }
});

// 연락처 API
const handlePostContact = async (req, res) => {
  try {
    await initDB();
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: false, error: 'MongoDB에 연결되지 않았습니다.' });
    }
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: '이름, 이메일, 메시지를 모두 입력해주세요.' });
    }
    const newContact = await Contact.create({ name, email, message });
    res.json({ success: true, data: newContact });
  } catch (error) {
    console.error('연락처 저장 오류:', error);
    res.status(500).json({ success: false, error: '연락처 저장에 실패했습니다.' });
  }
};

const handleGetContacts = async (req, res) => {
  try {
    await initDB();
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: false, error: 'MongoDB에 연결되지 않았습니다.' });
    }
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error('연락처 목록 조회 오류:', error);
    res.status(500).json({ success: false, error: '연락처 목록을 불러오는데 실패했습니다.' });
  }
};

const handlePutContactRead = async (req, res) => {
  try {
    await initDB();
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: false, error: 'MongoDB에 연결되지 않았습니다.' });
    }
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!contact) {
      return res.status(404).json({ success: false, error: '연락처를 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('연락처 읽음 처리 오류:', error);
    res.status(500).json({ success: false, error: '연락처 읽음 처리에 실패했습니다.' });
  }
};

const handleDeleteContact = async (req, res) => {
  try {
    await initDB();
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: false, error: 'MongoDB에 연결되지 않았습니다.' });
    }
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, error: '연락처를 찾을 수 없습니다.' });
    }
    res.json({ success: true, message: '연락처가 삭제되었습니다.' });
  } catch (error) {
    console.error('연락처 삭제 오류:', error);
    res.status(500).json({ success: false, error: '연락처 삭제에 실패했습니다.' });
  }
};

// /api/contacts와 /api/bo/contacts 모두 처리
app.post('/api/contacts', handlePostContact);
app.post('/api/bo/contacts', handlePostContact);
app.get('/api/contacts', handleGetContacts);
app.get('/api/bo/contacts', handleGetContacts);
app.put('/api/contacts/:id/read', handlePutContactRead);
app.put('/api/bo/contacts/:id/read', handlePutContactRead);
app.delete('/api/contacts/:id', handleDeleteContact);
app.delete('/api/bo/contacts/:id', handleDeleteContact);

// Vercel 서버리스 함수 핸들러
// Vercel 환경에서는 서버리스 함수로, 로컬에서는 Express 앱으로 동작
if (isVercel) {
  // Vercel 서버리스 함수 형식
  module.exports = (req, res) => {
    // CORS 헤더 추가
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    return app(req, res);
  };
} else {
  // 로컬 개발 환경
  module.exports = app;
}


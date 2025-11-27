/* eslint-disable @typescript-eslint/no-require-imports */
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
// CORS 설정: 별도 프론트엔드 서버와 Vercel 프리뷰 배포 URL 허용
app.use(cors({
  origin: (origin, callback) => {
    // 허용할 origin 목록
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3005',
      'https://hyeyeon-portfolio.vercel.app', // 별도 프론트엔드 프로젝트
      'https://hyeyeon-portfolio-admin.vercel.app', // 백엔드 프로젝트
      process.env.FRONTEND_URL,
      process.env.BACKOFFICE_URL
    ].filter(Boolean); // undefined 제거

    // Vercel 프리뷰 배포 URL 패턴 허용 (프론트엔드와 백엔드 모두)
    const isVercelPreview = origin && (
      (origin.includes('hyeyeon-portfolio') || origin.includes('hyeyeon-portfolio-admin')) && 
      origin.includes('.vercel.app')
    );

    // origin이 없거나 (서버 사이드 요청) 허용 목록에 있거나 Vercel 프리뷰면 허용
    if (!origin || allowedOrigins.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      console.warn('🚫 CORS 차단:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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
// Vercel 서버리스 환경에서 안전한 파일 읽기
const getAdminFile = (filename) => {
  console.log(`\n🔍 [${new Date().toISOString()}] 파일 찾기 시작: ${filename}`);
  console.log(`🌍 환경: ${isVercel ? 'Vercel 서버리스' : '로컬 개발'}`);
  console.log(`📂 process.cwd(): ${process.cwd()}`);
  console.log(`📂 __dirname: ${__dirname}`);
  
  // Vercel 서버리스 환경에서는 process.cwd()가 프로젝트 루트를 가리킴
  // api/index.js는 /api 폴더에 있으므로, server/admin은 루트에서 상대 경로
  const basePaths = [];
  
  if (isVercel) {
    // Vercel 환경: /var/task가 프로젝트 루트
    // process.cwd()도 시도하지만, /var/task가 더 확실함
    basePaths.push('/var/task');
    basePaths.push(process.cwd());
    // __dirname에서 상위로 올라가서 루트 찾기 시도
    // api/index.js는 /var/task/api/index.js이므로, 상위는 /var/task
    const parentDir = path.dirname(__dirname);
    if (parentDir !== __dirname) {
      basePaths.push(parentDir);
    }
  } else {
    // 로컬 환경: __dirname 기준
    basePaths.push(path.join(__dirname, '..'));
    basePaths.push(__dirname);
  }
  
  // 여러 경로 시도
  const possiblePaths = [];
  
  // Vercel 환경에서는 /var/task/server/admin/filename을 최우선으로 시도
  // 주의: /var/task/api/admin/ 경로는 잘못된 경로이므로 제외
  if (isVercel) {
    const vercelPath = `/var/task/server/admin/${filename}`;
    possiblePaths.push(vercelPath);
    console.log(`🎯 Vercel 우선 경로: ${vercelPath}`);
  }
  
  basePaths.forEach(base => {
    const serverAdminPath = path.join(base, 'server', 'admin', filename);
    const serverAdminPath2 = path.join(base, 'server/admin', filename);
    
    // 잘못된 경로(/api/admin/) 제외
    if (!serverAdminPath.includes('/api/admin/') && !serverAdminPath2.includes('/api/admin/')) {
      possiblePaths.push(serverAdminPath);
      possiblePaths.push(serverAdminPath2);
    }
    
    // 절대 경로도 시도 (잘못된 경로 제외)
    if (path.isAbsolute(base)) {
      const resolvedPath = path.resolve(base, 'server', 'admin', filename);
      if (!resolvedPath.includes('/api/admin/')) {
        possiblePaths.push(resolvedPath);
      }
    }
  });
  
  // 중복 제거
  const uniquePaths = [...new Set(possiblePaths)];
  
  console.log(`📁 시도할 경로들 (${uniquePaths.length}개):`);
  uniquePaths.forEach((p, i) => {
    const exists = existsSync(p);
    console.log(`  ${i + 1}. ${p} ${exists ? '✅ 존재' : '❌ 없음'}`);
  });
  
  // 디렉토리 탐색으로 파일 찾기 시도
  for (const basePath of basePaths) {
    try {
      // 잘못된 경로(/api/admin/) 제외
      if (basePath.includes('/api/admin/')) {
        continue;
      }
      
      // server 폴더 확인
      const serverPath = path.join(basePath, 'server');
      if (existsSync(serverPath)) {
        console.log(`📂 server 폴더 발견: ${serverPath}`);
        
        // admin 폴더 확인
        const adminPath = path.join(serverPath, 'admin');
        if (existsSync(adminPath)) {
          console.log(`📂 admin 폴더 발견: ${adminPath}`);
          
          // 파일 확인
          const filePath = path.join(adminPath, filename);
          if (existsSync(filePath)) {
            console.log(`✅ 파일 찾음 (탐색): ${filePath}`);
            try {
              const content = readFileSync(filePath, 'utf-8');
              console.log(`✅ 파일 읽기 성공, 크기: ${content.length} bytes`);
              
              // 파일 내용 확인 (디버깅용)
              if (filename === 'index.html' && content.includes('BO화면')) {
                console.log(`✅ "BO화면" 텍스트 확인됨`);
              } else if (filename === 'index.html' && content.includes('bo화면')) {
                console.warn(`⚠️ "bo화면" (소문자) 텍스트 발견 - "BO화면"으로 업데이트 필요`);
              } else if (filename === 'index.html') {
                console.warn(`⚠️ "BO화면" 텍스트를 찾을 수 없음. 내용 일부: ${content.substring(0, 200)}`);
              }
              
              return { content, path: filePath };
            } catch (error) {
              console.error(`❌ 파일 읽기 오류:`, error);
            }
          }
        }
      }
    } catch (error) {
      // 디렉토리 탐색 중 오류는 무시
      continue;
    }
  }
  
  // 직접 경로 시도
  for (const filePath of uniquePaths) {
    try {
      // 잘못된 경로(/api/admin/) 제외
      if (filePath.includes('/api/admin/')) {
        console.log(`⚠️ 잘못된 경로 제외: ${filePath}`);
        continue;
      }
      
      if (existsSync(filePath)) {
        console.log(`✅ 파일 찾음 (직접): ${filePath}`);
        const content = readFileSync(filePath, 'utf-8');
        console.log(`✅ 파일 읽기 성공, 크기: ${content.length} bytes`);
        
        // 파일 내용 확인 (디버깅용)
        if (filename === 'index.html' && content.includes('BO화면')) {
          console.log(`✅ "BO화면" 텍스트 확인됨`);
        } else if (filename === 'index.html' && content.includes('bo화면')) {
          console.warn(`⚠️ "bo화면" (소문자) 텍스트 발견 - "BO화면"으로 업데이트 필요`);
        } else if (filename === 'index.html') {
          console.warn(`⚠️ "BO화면" 텍스트를 찾을 수 없음. 내용 일부: ${content.substring(0, 200)}`);
        }
        
        return { content, path: filePath };
      }
    } catch (error) {
      // 파일 존재 확인 중 오류는 무시하고 다음 경로 시도
      continue;
    }
  }
  
  // 모든 경로 실패 - 상세 로그
  console.error(`\n❌ 파일을 찾을 수 없음: ${filename}`);
  console.error(`📋 최종 확인 - 시도한 경로들:`);
  uniquePaths.forEach((p, i) => {
    const exists = existsSync(p);
    console.error(`  ${i + 1}. ${p} ${exists ? '✅' : '❌'}`);
  });
  
  // 디렉토리 구조 확인
  try {
    console.error(`\n📂 디렉토리 구조 확인:`);
    for (const basePath of basePaths) {
      if (existsSync(basePath)) {
        console.error(`  ${basePath}:`);
        try {
          const items = readdirSync(basePath);
          console.error(`    - 항목들: ${items.slice(0, 10).join(', ')}${items.length > 10 ? '...' : ''}`);
        } catch (e) {
          console.error(`    - 읽기 불가`);
        }
      }
    }
  } catch (error) {
    console.error(`디렉토리 구조 확인 실패:`, error);
  }
  
  return null;
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
  
  const loginFile = getAdminFile('login.html');
  if (loginFile) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(loginFile.content);
  } else {
    res.status(500).send('로그인 페이지를 불러올 수 없습니다.');
  }
});

app.get('/admin/viewer', (req, res) => {
  const adminFile = getAdminFile('index.html');
  if (adminFile) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(adminFile.content);
  } else {
    res.status(500).send('관리자 페이지를 불러올 수 없습니다.');
  }
});

app.get('/admin', requireAuth, (req, res) => {
  console.log('📄 /admin 요청 처리 시작');
  const adminFile = getAdminFile('index.html');
  if (adminFile) {
    console.log('✅ admin 파일 읽기 성공, 내용 길이:', adminFile.content.length);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // 강력한 캐시 무효화 헤더
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Last-Modified', new Date().toUTCString());
    res.setHeader('ETag', `"${Date.now()}-${Math.random()}"`);
    // Vercel 캐시 무효화를 위한 헤더
    res.setHeader('X-Vercel-Cache-Control', 'no-cache');
    res.send(adminFile.content);
  } else {
    console.error('❌ admin 파일을 찾을 수 없음');
    res.status(500).send('관리자 페이지를 불러올 수 없습니다.');
  }
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
  
  const createFile = getAdminFile('create.html');
  if (createFile) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(createFile.content);
  } else {
    res.status(500).send('프로젝트 생성 페이지를 불러올 수 없습니다.');
  }
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

// /api/auth와 /api/bo/auth, /bo-api/auth 모두 처리
app.post('/api/auth/login', handleLogin);
app.post('/api/bo/auth/login', handleLogin);
app.post('/bo-api/auth/login', handleLogin);
app.post('/api/auth/logout', handleLogout);
app.post('/api/bo/auth/logout', handleLogout);
app.post('/bo-api/auth/logout', handleLogout);
app.get('/api/auth/check', handleAuthCheck);
app.get('/api/bo/auth/check', handleAuthCheck);
app.get('/bo-api/auth/check', handleAuthCheck);

// MongoDB 연결 초기화 (서버리스 환경 최적화)
// Vercel 서버리스 환경에서는 연결을 재사용하지 않고 매번 새로 연결하는 것이 안전
let dbConnected = false;
let connectionAttempts = 0;
const MAX_RETRIES = 1; // 재시도 횟수 최소화
const RETRY_DELAY = 200; // 재시도 간격 최소화
const CONNECTION_TIMEOUT = 4000; // 전체 연결 타임아웃 4초로 단축

const initDB = async (forceReconnect = false) => {
  const currentState = mongoose.connection.readyState;
  const isConnected = currentState === 1;
  
  // 서버리스 환경에서는 연결을 재사용하지 않고 매번 새로 연결
  const isVercel = process.env.VERCEL === '1';
  
  // 이미 연결되어 있고 서버리스가 아니면 재사용
  if (!forceReconnect && !isVercel && isConnected && dbConnected) {
    return true;
  }
  
  // 연결이 끊어지는 중이거나 연결 중이면 기다리지 않고 즉시 새 연결 시도
  if (currentState === 2 || currentState === 3) {
    console.log(`⚠️ MongoDB 연결 상태: ${currentState} (${currentState === 2 ? 'connecting' : 'disconnecting'}), 새 연결 시도`);
    // 기다리지 않고 즉시 새 연결 시도
    try {
      await mongoose.connection.close().catch(() => {}); // 기존 연결 강제 종료
    } catch (e) {
      // 무시
    }
  }
  
  // 재시도 횟수 초기화
  if (forceReconnect || !dbConnected) {
    connectionAttempts = 0;
  }
  
  // 최대 재시도 횟수 확인
  if (connectionAttempts >= MAX_RETRIES) {
    console.error(`❌ MongoDB 연결 실패: 최대 재시도 횟수(${MAX_RETRIES}) 초과`);
    return false;
  }
  
  try {
    connectionAttempts++;
    console.log(`🔄 MongoDB 연결 시도 (${connectionAttempts}/${MAX_RETRIES})...`);
    
    // 기존 연결이 있으면 먼저 닫기 (타임아웃 적용)
    if (currentState !== 0 && currentState !== 1) {
      try {
        await Promise.race([
          mongoose.connection.close(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Close timeout')), 1000))
        ]).catch(() => {}); // 타임아웃 무시
        console.log('   - 기존 연결 종료');
        // 연결이 완전히 닫힐 때까지 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (closeError) {
        console.log('   - 기존 연결 종료 실패 (무시)');
      }
    }
    
    // 새 연결 시도 (타임아웃 적용)
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), CONNECTION_TIMEOUT)
    );
    
    dbConnected = await Promise.race([connectPromise, timeoutPromise]);
    
    if (dbConnected && mongoose.connection.readyState === 1) {
      connectionAttempts = 0; // 성공 시 재시도 횟수 초기화
      console.log('✅ MongoDB 연결 성공');
      return true;
    } else {
      dbConnected = false;
      if (connectionAttempts < MAX_RETRIES) {
        console.log(`   ⏳ ${RETRY_DELAY}ms 후 재시도...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return await initDB(true); // 재귀적으로 재시도
      }
      return false;
    }
  } catch (error) {
    console.error(`❌ MongoDB 연결 시도 ${connectionAttempts} 실패:`, error.message);
    dbConnected = false;
    
    if (connectionAttempts < MAX_RETRIES) {
      console.log(`   ⏳ ${RETRY_DELAY}ms 후 재시도...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return await initDB(true); // 재귀적으로 재시도
    }
    
    return false;
  }
};

// MongoDB 연결 상태 확인 헬스체크
const handleHealthCheck = async (req, res) => {
  try {
    await initDB();
    const isConnected = mongoose.connection.readyState === 1;
    const connectionState = mongoose.connection.readyState;
    const stateText = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }[connectionState] || 'unknown';

    res.json({
      success: true,
      mongodb: {
        connected: isConnected,
        state: connectionState,
        stateText: stateText,
        host: isConnected ? mongoose.connection.host : null,
        database: isConnected ? mongoose.connection.name : null,
        hasMongoURI: !!process.env.MONGODB_URI
      },
      vercel: process.env.VERCEL === '1',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      success: false,
      mongodb: {
        connected: false,
        error: error.message
      },
      timestamp: new Date().toISOString()
    });
  }
};

app.get('/api/health', handleHealthCheck);
app.get('/api/bo/health', handleHealthCheck);
app.get('/bo-api/health', handleHealthCheck);

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
          // 기존 프로젝트 업데이트 시 featured 필드는 보존 (사용자가 설정한 featured 상태 유지)
          // featured 필드를 제외한 나머지 필드만 업데이트
          const updateData = { ...projectData };
          delete updateData.featured; // featured 필드 제거하여 기존 값 유지
          
          await Project.findOneAndUpdate(
            { id: projectData.id },
            updateData,
            { new: true, runValidators: true }
          );
          updated++;
          console.log(`✅ 프로젝트 업데이트 (featured 보존): ${projectData.title}`);
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

// 방문자 로그 API (/api/visitors, /api/bo/visitors, /bo-api/visitors)
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
app.post('/bo-api/visitors', handlePostVisitor);

const handleGetVisitorStats = async (req, res) => {
  try {
    await initDB();
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        today: 0,
        thisWeek: 0,
        total: 0
      });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 이번 주 시작일 (월요일)
    const thisWeekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    thisWeekStart.setDate(today.getDate() - daysToMonday);
    thisWeekStart.setHours(0, 0, 0, 0);

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

    // 이번 주 방문자 수
    const thisWeekCount = await Visitor.countDocuments({
      $or: [
        {
          date: {
            $gte: thisWeekStart
          }
        },
        {
          createdAt: {
            $gte: thisWeekStart
          }
        }
      ]
    });

    const totalCount = await Visitor.countDocuments();

    res.json({
      success: true,
      today: finalTodayCount,
      thisWeek: thisWeekCount,
      total: totalCount
    });
  } catch (error) {
    console.error('❌ 방문자 통계 조회 오류:', error);
    res.json({
      success: true,
      today: 0,
      thisWeek: 0,
      total: 0
    });
  }
};

app.get('/api/visitors/stats', handleGetVisitorStats);
app.get('/api/bo/visitors/stats', handleGetVisitorStats);
app.get('/bo-api/visitors/stats', handleGetVisitorStats);

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
app.get('/bo-api/visitors', handleGetVisitors);

// 프로젝트 목록 조회 (백오피스 API)
const handleGetProjects = async (req, res) => {
  // 요청 타임아웃 설정 (전체 요청 처리 시간 제한)
  const requestTimeout = setTimeout(() => {
    if (!res.headersSent) {
      console.error('❌ 요청 타임아웃 (8초 초과)');
      res.status(504).json({
        success: false,
        error: '요청 처리 시간이 초과되었습니다. MongoDB 연결을 확인해주세요.',
        timeout: true,
        details: {
          message: 'MongoDB 연결이 8초 내에 완료되지 않았습니다.',
          troubleshooting: 'Vercel 환경 변수 MONGODB_URI와 MongoDB Atlas Network Access를 확인하세요.'
        }
      });
    }
  }, 8000); // 8초 타임아웃 (Vercel 서버리스 함수 제한 고려)

  try {
    // MongoDB 연결 시도 (강제 재연결 포함, 하지만 타임아웃 적용)
    console.log('🔄 MongoDB 연결 시작...');
    const connectionStartTime = Date.now();
    const connected = await Promise.race([
      initDB(true),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('MongoDB 연결 타임아웃 (5초)')), 5000)
      )
    ]).catch(error => {
      console.error('❌ MongoDB 연결 타임아웃:', error.message);
      return false;
    });
    
    const connectionTime = Date.now() - connectionStartTime;
    console.log(`⏱️ MongoDB 연결 시도 시간: ${connectionTime}ms`);
    
    clearTimeout(requestTimeout); // 성공 시 타임아웃 제거
    
    if (!connected || mongoose.connection.readyState !== 1) {
      const mongoURI = process.env.MONGODB_URI || '';
      const hasMongoURI = !!mongoURI;
      const mongoURIPreview = hasMongoURI 
        ? mongoURI.replace(/:[^:@]+@/, ':****@').substring(0, 100) + '...'
        : '없음';
      
      console.error('❌ MongoDB 연결 실패:', {
        connected,
        readyState: mongoose.connection.readyState,
        readyStateText: {
          0: 'disconnected',
          1: 'connected',
          2: 'connecting',
          3: 'disconnecting'
        }[mongoose.connection.readyState] || 'unknown',
        hasMongoURI: hasMongoURI,
        mongoURIPreview: mongoURIPreview,
        vercel: process.env.VERCEL === '1',
        nodeEnv: process.env.NODE_ENV
      });
      
      // 더 자세한 에러 메시지 제공
      let errorMessage = 'MongoDB가 연결되지 않았습니다.';
      let troubleshootingSteps = [];
      
      if (!hasMongoURI) {
        errorMessage += ' Vercel 환경 변수에 MONGODB_URI를 설정하세요.';
        troubleshootingSteps = [
          '1. Vercel Dashboard → hyeyeon-portfolio-admin → Settings → Environment Variables',
          '2. MONGODB_URI 환경 변수 추가',
          '3. MongoDB Atlas → Database → Connect → 연결 문자열 복사',
          '4. 연결 문자열에서 <password>를 실제 비밀번호로 교체',
          '5. 환경 변수 추가 후 반드시 Redeploy'
        ];
      } else {
        errorMessage += ' MongoDB Atlas Network Access 설정을 확인하세요.';
        troubleshootingSteps = [
          '1. MongoDB Atlas → Network Access → 0.0.0.0/0 추가 확인',
          '2. 연결 문자열 형식 확인: mongodb+srv://사용자명:비밀번호@클러스터주소/데이터베이스명?retryWrites=true&w=majority',
          '3. 비밀번호에 특수문자(@, #, %)가 있으면 URL 인코딩 확인',
          '4. MongoDB Atlas 클러스터가 일시 중지되지 않았는지 확인',
          '5. Vercel 환경 변수 추가 후 Redeploy 확인'
        ];
      }
      
      return res.status(503).json({
        success: false,
        error: errorMessage,
        details: {
          readyState: mongoose.connection.readyState,
          readyStateText: {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
          }[mongoose.connection.readyState] || 'unknown',
          hasMongoURI: hasMongoURI,
          mongoURIPreview: mongoURIPreview,
          vercel: process.env.VERCEL === '1',
          troubleshooting: troubleshootingSteps
        }
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
    
    // 프로젝트 조회 (서버리스 환경에서 세션 만료 방지)
    const isVercel = process.env.VERCEL === '1';
    let projects;
    try {
      // 연결 상태를 확인하고 필요시 재연결
      if (mongoose.connection.readyState !== 1) {
        console.warn('⚠️ MongoDB 연결 상태 불안정, 재연결 시도...');
        await mongoose.connection.close().catch(() => {});
        await new Promise(resolve => setTimeout(resolve, 100));
        const reconnected = await initDB(true);
        if (!reconnected) {
          throw new Error('재연결 실패');
        }
      }
      projects = await Project.find().sort({ createdAt: -1 });
    } catch (queryError) {
      // 세션 에러인 경우 재시도 (연결 재설정)
      if (queryError.name === 'MongoExpiredSessionError' || 
          queryError.name === 'MongoPoolClosedError' ||
          queryError.message.includes('session') ||
          queryError.message.includes('pool')) {
        console.warn('⚠️ MongoDB 세션/풀 에러 감지, 재연결 시도...', {
          error: queryError.name,
          message: queryError.message
        });
        try {
          await mongoose.connection.close().catch(() => {});
          await new Promise(resolve => setTimeout(resolve, 200));
          const reconnected = await initDB(true);
          if (reconnected && mongoose.connection.readyState === 1) {
            projects = await Project.find().sort({ createdAt: -1 });
          } else {
            throw new Error('재연결 실패');
          }
        } catch (retryError) {
          console.error('❌ 재연결 실패:', retryError.message);
          throw queryError; // 원래 에러를 다시 던짐
        }
      } else {
        throw queryError;
      }
    }
    
    // featured 프로젝트 개수 확인 및 로깅
    const featuredProjects = projects.filter(p => p.featured === true || p.featured === 'true');
    
    // featured 프로젝트가 1개보다 많으면 자동으로 정리 (가장 최근 것만 유지)
    if (featuredProjects.length > 1) {
      console.log(`⚠️  Featured 프로젝트가 ${featuredProjects.length}개입니다. 1개만 유지하고 나머지는 해제합니다.`);
      // createdAt이 가장 최근인 프로젝트만 유지
      const sortedFeatured = featuredProjects.sort((a, b) => {
        const dateA = a.createdAt || a.updatedAt || new Date(0);
        const dateB = b.createdAt || b.updatedAt || new Date(0);
        return dateB - dateA;
      });
      const keepProject = sortedFeatured[0];
      const unsetProjects = sortedFeatured.slice(1);
      
      // 나머지 프로젝트들의 featured를 false로 변경
      for (const project of unsetProjects) {
        await Project.findByIdAndUpdate(project._id, { $set: { featured: false } });
        console.log(`   - "${project.title}"의 featured를 false로 변경`);
      }
      
      // 업데이트된 프로젝트 목록 다시 가져오기
      const updatedProjects = await Project.find().sort({ createdAt: -1 });
      const updatedFeatured = updatedProjects.filter(p => p.featured === true || p.featured === 'true');
      
      console.log('📊 백엔드 프로젝트 데이터 (정리 후):', {
        total: updatedProjects.length,
        featured: updatedFeatured.length,
        featuredTitles: updatedFeatured.map(p => p.title),
        allProjects: updatedProjects.map(p => ({ title: p.title, featured: p.featured }))
      });
      
      clearTimeout(requestTimeout); // 성공 시 타임아웃 제거
      return res.json({ success: true, data: updatedProjects });
    }
    
    console.log('📊 백엔드 프로젝트 데이터:', {
      total: projects.length,
      featured: featuredProjects.length,
      featuredTitles: featuredProjects.map(p => p.title),
      allProjects: projects.map(p => ({ title: p.title, featured: p.featured }))
    });
    
    // 캐시 무효화를 위한 헤더 추가 (즐겨찾기 변경 즉시 반영)
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Last-Modified', new Date().toUTCString());
    res.setHeader('ETag', `"${Date.now()}"`);
    
    clearTimeout(requestTimeout); // 성공 시 타임아웃 제거
    res.json({ success: true, data: projects });
  } catch (error) {
    clearTimeout(requestTimeout); // 오류 시 타임아웃 제거
    console.error('프로젝트 조회 오류:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: '프로젝트를 불러오는데 실패했습니다: ' + error.message });
    }
  }
};

// /api/projects와 /api/bo/projects, /bo-api/projects 모두 처리 (무한 루프 방지)
app.get('/api/projects', handleGetProjects);
app.get('/api/bo/projects', handleGetProjects);
app.get('/bo-api/projects', handleGetProjects);

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

    // 요청 본문 파싱 (다양한 형식 지원)
    let projectData;
    if (typeof req.body === 'string') {
      projectData = JSON.parse(req.body);
    } else if (req.body.project) {
      projectData = typeof req.body.project === 'string' ? JSON.parse(req.body.project) : req.body.project;
    } else {
      projectData = req.body;
    }

    // 파일 업로드 처리
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const imagePaths = req.files.map(file => `/tmp/projects/${file.filename}`);
      projectData.images = [...(project.images || []), ...imagePaths];
    }
    
    // ID 유지
    projectData.id = project.id || req.params.id;
    
    // _id는 업데이트하지 않음 (MongoDB가 자동 처리)
    delete projectData._id;

    console.log('📝 프로젝트 수정 요청:', {
      projectId: req.params.id,
      currentFeatured: project.featured,
      newFeatured: projectData.featured,
      updateFields: Object.keys(projectData)
    });

    // featured 필드만 업데이트하는 경우 명시적으로 처리
    const updateData = {};
    let isFeaturedUpdate = false;
    let newFeaturedValue = null;
    
    if ('featured' in projectData) {
      newFeaturedValue = projectData.featured === true || projectData.featured === 'true';
      updateData.featured = newFeaturedValue;
      isFeaturedUpdate = true;
      console.log('🔖 featured 필드 업데이트:', {
        from: project.featured,
        to: newFeaturedValue
      });
    }
    
    // 다른 필드도 업데이트
    Object.keys(projectData).forEach(key => {
      if (key !== '_id' && key !== 'id') {
        updateData[key] = projectData[key];
      }
    });

    const updatedProject = await Project.findOneAndUpdate(
      { _id: project._id },
      { $set: updateData }, // $set 연산자 사용으로 명확한 업데이트
      { new: true, runValidators: true }
    );
    
    // featured를 true로 설정한 경우, 다른 프로젝트들의 featured를 false로 변경
    if (isFeaturedUpdate && newFeaturedValue === true) {
      const otherProjectsUpdated = await Project.updateMany(
        { _id: { $ne: project._id }, featured: true },
        { $set: { featured: false } }
      );
      if (otherProjectsUpdated.modifiedCount > 0) {
        console.log(`🔄 다른 ${otherProjectsUpdated.modifiedCount}개 프로젝트의 featured를 false로 변경`);
      }
    }

    console.log('✅ 프로젝트 수정 성공:', {
      _id: updatedProject._id,
      id: updatedProject.id,
      title: updatedProject.title,
      featured: updatedProject.featured,
      featuredType: typeof updatedProject.featured
    });

    // 캐시 무효화를 위한 헤더 추가
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.json({ success: true, data: updatedProject });
  } catch (error) {
    console.error('❌ 프로젝트 수정 오류:', error);
    res.status(500).json({ success: false, error: '프로젝트 수정에 실패했습니다: ' + error.message });
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

// /api/projects와 /api/bo/projects, /bo-api/projects 모두 처리
app.post('/api/projects', requireAuth, upload.array('images', 9), handlePostProject);
app.post('/api/bo/projects', requireAuth, upload.array('images', 9), handlePostProject);
app.post('/bo-api/projects', requireAuth, upload.array('images', 9), handlePostProject);
app.put('/api/projects/:id', upload.array('images', 9), handlePutProject);
app.put('/api/bo/projects/:id', upload.array('images', 9), handlePutProject);
app.put('/bo-api/projects/:id', upload.array('images', 9), handlePutProject);
app.delete('/api/projects/:id', handleDeleteProject);
app.delete('/api/bo/projects/:id', handleDeleteProject);
app.delete('/bo-api/projects/:id', handleDeleteProject);

// 강제 마이그레이션 API (관리자용) - /api, /api/bo, /bo-api 모두 지원
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
app.post('/bo-api/migrate', requireAuth, handleMigrate);

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

// 연락처 API (/api/contacts, /api/bo/contacts, /bo-api/contacts)
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

// /api/contacts와 /api/bo/contacts, /bo-api/contacts 모두 처리
app.post('/api/contacts', handlePostContact);
app.post('/api/bo/contacts', handlePostContact);
app.post('/bo-api/contacts', handlePostContact);
app.get('/api/contacts', handleGetContacts);
app.get('/api/bo/contacts', handleGetContacts);
app.get('/bo-api/contacts', handleGetContacts);
app.put('/api/contacts/:id/read', handlePutContactRead);
app.put('/api/bo/contacts/:id/read', handlePutContactRead);
app.put('/bo-api/contacts/:id/read', handlePutContactRead);
app.delete('/api/contacts/:id', handleDeleteContact);
app.delete('/api/bo/contacts/:id', handleDeleteContact);
app.delete('/bo-api/contacts/:id', handleDeleteContact);

// Vercel 서버리스 함수 핸들러
// Vercel 환경에서는 서버리스 함수로, 로컬에서는 Express 앱으로 동작
if (isVercel) {
  // Vercel 서버리스 함수 형식
  module.exports = (req, res) => {
    // CORS 처리는 Express의 cors 미들웨어에서 담당
    // (여기서 '*' Origin을 강제로 넣으면 credentials: true와 충돌 → CORS 에러 발생)
    if (req.method === 'OPTIONS') {
      // Express 앱에 OPTIONS 처리를 위임
      return app(req, res);
    }

    return app(req, res);
  };
} else {
  // 로컬 개발 환경
  module.exports = app;
}


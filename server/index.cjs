require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { existsSync, mkdirSync, readFileSync } = require('fs');
const multer = require('multer');
const mongoose = require('mongoose');
const session = require('express-session');
const { connectDB } = require('./config/database.cjs');
const Project = require('./models/Project.cjs');
const Visitor = require('./models/Visitor.cjs');
const Contact = require('./models/Contact.cjs');

const app = express();
const PORT = 3005;
// __dirname은 CommonJS에서 자동으로 제공됨

// 미들웨어
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 정적 파일 서빙은 라우트 이후로 이동 (라우트가 우선순위를 가짐)

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET || 'vibe-coding-portfolio-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // HTTPS에서는 true로 설정
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24시간
  }
}));

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public', 'projects');
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

// PDF 업로드 설정 (별도 스토리지)
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public', 'projects', 'pdfs');
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

const uploadPdf = multer({ 
  storage: pdfStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('PDF 파일만 업로드 가능합니다.'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB 제한
  }
});

// 관리자 계정 정보 (환경 변수 또는 기본값)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'hing0915';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dpffla525';

// 서버 시작 시 관리자 정보 출력 (디버깅용)
console.log('🔑 관리자 계정 정보:', {
  username: ADMIN_USERNAME,
  password: ADMIN_PASSWORD ? '***' : '없음',
  hasEnvUsername: !!process.env.ADMIN_USERNAME,
  hasEnvPassword: !!process.env.ADMIN_PASSWORD,
  envUsername: process.env.ADMIN_USERNAME || '없음',
  envPassword: process.env.ADMIN_PASSWORD ? '***' : '없음'
});

// 로그인 체크 미들웨어
const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/admin/login');
};

// 루트 경로 - 관리자 로그인 페이지로 리다이렉트
app.get('/', (req, res) => {
  res.redirect('/admin/login');
});

// 백오피스 관리자 페이지 라우트 (API 라우트보다 먼저 정의)
app.get('/admin/login', (req, res) => {
  console.log('✅ /admin/login GET 요청 받음!');
  console.log('요청 URL:', req.url);
  console.log('요청 경로:', req.path);
  
  // 이미 로그인되어 있으면 관리자 페이지로 리다이렉트
  if (req.session && req.session.isAuthenticated) {
    console.log('이미 로그인됨, /admin으로 리다이렉트');
    return res.redirect('/admin');
  }
  
  const loginPath = path.resolve(__dirname, 'admin', 'login.html');
  console.log('로그인 페이지 경로:', loginPath);
  console.log('파일 존재 여부:', require('fs').existsSync(loginPath));
  
  res.sendFile(loginPath, (err) => {
    if (err) {
      console.error('❌ 로그인 페이지 로드 오류:', err);
      console.error('경로:', loginPath);
      res.status(500).send('로그인 페이지를 불러올 수 없습니다.');
    } else {
      console.log('✅ 로그인 페이지 전송 성공');
    }
  });
});

// 비로그인 사용자를 위한 읽기 전용 관리자 화면 (더 구체적인 경로를 먼저 정의)
app.get('/admin/viewer', (req, res) => {
  console.log('✅ /admin/viewer GET 요청 받음!');
  console.log('요청 URL:', req.url);
  console.log('요청 경로:', req.path);
  
  const adminPath = path.resolve(__dirname, 'admin', 'index.html');
  console.log('관리자 페이지 경로:', adminPath);
  console.log('파일 존재 여부:', require('fs').existsSync(adminPath));
  
  res.sendFile(adminPath, (err) => {
    if (err) {
      console.error('❌ 관리자 페이지 로드 오류:', err);
      console.error('경로:', adminPath);
      res.status(500).send('관리자 페이지를 불러올 수 없습니다.');
    } else {
      console.log('✅ 관리자 페이지 전송 성공');
    }
  });
});

app.get('/admin', requireAuth, (req, res) => {
  // 로그인한 사용자만 접근 가능 (Viewer Access)
  const adminPath = path.resolve(__dirname, 'admin', 'index.html');
  res.sendFile(adminPath, (err) => {
    if (err) {
      console.error('관리자 페이지 로드 오류:', err);
      res.status(500).send('관리자 페이지를 불러올 수 없습니다.');
    }
  });
});

app.get('/admin/create', requireAuth, (req, res) => {
  const createPath = path.resolve(__dirname, 'admin', 'create.html');
  res.sendFile(createPath, (err) => {
    if (err) {
      console.error('프로젝트 생성 페이지 로드 오류:', err);
      res.status(500).send('프로젝트 생성 페이지를 불러올 수 없습니다.');
    }
  });
});

// API Routes

// 인증 API
const handleLogin = (req, res) => {
  const { username, password } = req.body;
  
  // 공백 제거 및 정규화
  const trimmedUsername = username ? username.trim() : '';
  const trimmedPassword = password ? password.trim() : '';
  
  console.log('🔐 로그인 요청 받음:', {
    receivedUsername: trimmedUsername,
    receivedPassword: trimmedPassword ? '***' : '없음',
    receivedUsernameLength: trimmedUsername.length,
    receivedPasswordLength: trimmedPassword.length,
    expectedUsername: ADMIN_USERNAME,
    expectedPassword: ADMIN_PASSWORD ? '***' : '없음',
    expectedUsernameLength: ADMIN_USERNAME.length,
    expectedPasswordLength: ADMIN_PASSWORD ? ADMIN_PASSWORD.length : 0,
    usernameMatch: trimmedUsername === ADMIN_USERNAME,
    passwordMatch: trimmedPassword === ADMIN_PASSWORD,
    usernameCharCodes: trimmedUsername.split('').map(c => c.charCodeAt(0)),
    expectedUsernameCharCodes: ADMIN_USERNAME.split('').map(c => c.charCodeAt(0)),
    body: req.body
  });
  
  if (trimmedUsername === ADMIN_USERNAME && trimmedPassword === ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    req.session.username = trimmedUsername;
    console.log('✅ 로그인 성공');
    res.json({ success: true, message: '로그인 성공' });
  } else {
    console.log('❌ 로그인 실패:', {
      usernameMatch: trimmedUsername === ADMIN_USERNAME,
      passwordMatch: trimmedPassword === ADMIN_PASSWORD,
      receivedUsername: `"${trimmedUsername}"`,
      expectedUsername: `"${ADMIN_USERNAME}"`,
      receivedPassword: trimmedPassword ? `"***"` : '없음',
      receivedPasswordLength: trimmedPassword.length,
      expectedPasswordLength: ADMIN_PASSWORD ? ADMIN_PASSWORD.length : 0
    });
    res.status(401).json({ success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
  }
};

const handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: '로그아웃 실패' });
    }
    res.json({ success: true, message: '로그아웃 성공' });
  });
};

const handleAuthCheck = (req, res) => {
  res.json({ 
    success: true, 
    authenticated: req.session && req.session.isAuthenticated || false 
  });
};

// /api/auth와 /api/bo/auth 모두 처리
app.post('/api/auth/login', handleLogin);
app.post('/api/bo/auth/login', handleLogin);
app.post('/api/auth/logout', handleLogout);
app.post('/api/bo/auth/logout', handleLogout);
app.get('/api/auth/check', handleAuthCheck);
app.get('/api/bo/auth/check', handleAuthCheck);

// 방문자 로그 API
app.post('/api/visitors', async (req, res) => {
  try {
    // MongoDB 연결 확인
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: false, error: 'MongoDB에 연결되지 않았습니다.' });
    }
    
    const { ip, userAgent, path } = req.body;
    const clientIp = ip || req.ip || req.connection.remoteAddress;
    const clientUserAgent = userAgent || req.get('user-agent');
    const clientPath = path || '/';
    const now = new Date();
    
    // 5초 이내 같은 IP, UserAgent, Path의 중복 로그 방지
    const fiveSecondsAgo = new Date(now.getTime() - 5000);
    const existingVisit = await Visitor.findOne({
      ip: clientIp,
      userAgent: clientUserAgent,
      path: clientPath,
      $or: [
        { date: { $gte: fiveSecondsAgo } },
        { createdAt: { $gte: fiveSecondsAgo } }
      ]
    });
    
    if (existingVisit) {
      // 중복 요청이면 기존 로그 업데이트만 (카운트 증가 방지)
      return res.json({ success: true, message: '중복 방문 로그 (무시됨)' });
    }
    
    // 방문자 로그 저장
    await Visitor.create({
      ip: clientIp,
      userAgent: clientUserAgent,
      path: clientPath,
      date: now,
    });
    
    res.json({ success: true, message: '방문자 로그 저장 완료' });
  } catch (error) {
    console.error('방문자 로그 저장 오류:', error);
    res.json({ success: false, error: '방문자 로그 저장 실패' });
  }
});
// /bo-api/* 경로 매핑

// 일일 방문자 수 조회 API
app.get('/api/visitors/stats', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️  MongoDB 연결되지 않음, 방문자 통계 0 반환');
      return res.json({ 
        success: true, 
        today: 0, 
        thisWeek: 0,
        total: 0,
        hourly: Array(24).fill(0),
        weekly: Array(7).fill(0),
        daily: Array(7).fill(0),
        dailyLabels: []
      });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // 오늘 방문자 수 (date 필드 기준)
    const todayCount = await Visitor.countDocuments({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    // createdAt 필드로도 확인 (백업)
    const todayCountByCreated = await Visitor.countDocuments({
      createdAt: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    // 더 큰 값을 사용
    const finalTodayCount = Math.max(todayCount, todayCountByCreated);
    
    // 이번 주 시작일 (월요일)
    const thisWeekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    thisWeekStart.setDate(today.getDate() - daysToMonday);
    thisWeekStart.setHours(0, 0, 0, 0);
    
    // 이번 주 방문자 수
    const thisWeekCount = await Visitor.countDocuments({
      $or: [
        { date: { $gte: thisWeekStart } },
        { createdAt: { $gte: thisWeekStart } }
      ]
    });
    
    // 전체 방문자 수
    const totalCount = await Visitor.countDocuments();
    
    // 오늘 시간대별 방문자 수 (0시~23시)
    const hourlyStats = Array(24).fill(0);
    const todayVisitors = await Visitor.find({
      $or: [
        { date: { $gte: today, $lt: tomorrow } },
        { createdAt: { $gte: today, $lt: tomorrow } }
      ]
    }).lean();
    
    todayVisitors.forEach(visitor => {
      const visitDate = visitor.date || visitor.createdAt;
      if (visitDate) {
        const hour = new Date(visitDate).getHours();
        if (hour >= 0 && hour < 24) {
          hourlyStats[hour]++;
        }
      }
    });
    
    // 이번 주 요일별 방문자 수 (월~일) - 병렬 처리로 최적화
    const weeklyStats = Array(7).fill(0);
    const weekVisitors = await Visitor.find({
      $or: [
        { date: { $gte: thisWeekStart } },
        { createdAt: { $gte: thisWeekStart } }
      ]
    }).lean();
    
    weekVisitors.forEach(visitor => {
      const visitDate = visitor.date || visitor.createdAt;
      if (visitDate) {
        const visitDay = new Date(visitDate);
        const dayOfWeek = visitDay.getDay();
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 월요일=0, 일요일=6
        if (adjustedDay >= 0 && adjustedDay < 7) {
          weeklyStats[adjustedDay]++;
        }
      }
    });
    
    // 최근 7일 방문자 수 (날짜별) - 병렬 처리로 최적화
    const dailyStats = Array(7).fill(0);
    const dailyLabels = [];
    const dailyQueries = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayLabel = `${date.getMonth() + 1}/${date.getDate()}`;
      dailyLabels.push(dayLabel);
      
      // 쿼리를 배열에 추가 (병렬 실행)
      dailyQueries.push(
        Visitor.countDocuments({
          $or: [
            { date: { $gte: date, $lt: nextDate } },
            { createdAt: { $gte: date, $lt: nextDate } }
          ]
        })
      );
    }
    
    // 모든 일별 쿼리를 병렬로 실행
    const dailyResults = await Promise.all(dailyQueries);
    dailyResults.forEach((count, index) => {
      dailyStats[index] = count;
    });
    
    console.log(`📊 방문자 통계: 오늘 ${finalTodayCount}명, 이번 주 ${thisWeekCount}명, 전체 ${totalCount}명`);
    
    res.json({ 
      success: true, 
      today: finalTodayCount,
      thisWeek: thisWeekCount,
      total: totalCount,
      hourly: hourlyStats,
      weekly: weeklyStats,
      daily: dailyStats,
      dailyLabels: dailyLabels
    });
  } catch (error) {
    console.error('방문자 통계 조회 오류:', error);
    res.json({ 
      success: true, 
      today: 0, 
      thisWeek: 0,
      total: 0,
      hourly: Array(24).fill(0),
      weekly: Array(7).fill(0),
      daily: Array(7).fill(0),
      dailyLabels: []
    });
  }
});

// 월별 방문자 통계 조회 API
app.get('/api/visitors/monthly', async (req, res) => {
  // /bo-api 경로에서도 접근 가능하도록 처리
  await handleMonthlyVisitors(req, res);
});

// /bo-api 경로로도 직접 접근 가능
app.get('/bo-api/visitors/monthly', async (req, res) => {
  await handleMonthlyVisitors(req, res);
});

// 월별 방문자 통계 처리 함수
async function handleMonthlyVisitors(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️  MongoDB 연결되지 않음, 월별 방문자 통계 0 반환');
      return res.json({ 
        success: true, 
        monthly: Array(31).fill(0),
        labels: []
      });
    }
    
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    
    // 해당 월의 시작일과 종료일
    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);
    const daysInMonth = endDate.getDate();
    
    // 일별 방문자 수 계산
    const monthlyStats = Array(daysInMonth).fill(0);
    const monthlyLabels = [];
    const monthlyQueries = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayLabel = `${day}`;
      monthlyLabels.push(dayLabel);
      
      monthlyQueries.push(
        Visitor.countDocuments({
          $or: [
            { date: { $gte: date, $lt: nextDate } },
            { createdAt: { $gte: date, $lt: nextDate } }
          ]
        })
      );
    }
    
    // 모든 일별 쿼리를 병렬로 실행
    const monthlyResults = await Promise.all(monthlyQueries);
    monthlyResults.forEach((count, index) => {
      monthlyStats[index] = count;
    });
    
    console.log(`📊 월별 방문자 통계: ${year}년 ${month}월`);
    
    res.json({ 
      success: true, 
      monthly: monthlyStats,
      labels: monthlyLabels,
      year: year,
      month: month,
      daysInMonth: daysInMonth
    });
  } catch (error) {
    console.error('월별 방문자 통계 조회 오류:', error);
    res.json({ 
      success: true, 
      monthly: Array(31).fill(0),
      labels: []
    });
  }
}

// 방문자 목록 조회 API
app.get('/api/visitors', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.error('🚨 /api/visitors: MongoDB not ready', {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      });
      return res.json({ 
        success: false, 
        error: 'MongoDB에 연결되지 않았습니다.' 
      });
    }
    
    const limit = parseInt(req.query.limit) || 50; // 기본 50개
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    // 날짜 범위 필터
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    
    console.log('방문자 목록 조회 요청:', { 
      startDate: req.query.startDate, 
      endDate: req.query.endDate, 
      sort: req.query.sort,
      parsedStartDate: startDate,
      parsedEndDate: endDate
    });
    
    // 쿼리 조건 생성
    const query = {};
    if (startDate || endDate) {
      // 시작일은 00:00:00으로 설정
      if (startDate) {
        startDate.setHours(0, 0, 0, 0);
      }
      // 종료일은 23:59:59.999로 설정
      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
      }
      
      // date 필드와 createdAt 필드 중 하나라도 조건을 만족하면 포함
      query.$or = [];
      if (startDate && endDate) {
        query.$or.push(
          { date: { $gte: startDate, $lte: endDate } },
          { createdAt: { $gte: startDate, $lte: endDate } }
        );
      } else if (startDate) {
        query.$or.push(
          { date: { $gte: startDate } },
          { createdAt: { $gte: startDate } }
        );
      } else if (endDate) {
        query.$or.push(
          { date: { $lte: endDate } },
          { createdAt: { $lte: endDate } }
        );
      }
    }
    
    console.log('쿼리 조건:', JSON.stringify(query, null, 2));
    
    // 정렬 옵션 (최신순: -1, 오래된순: 1)
    const sortOrder = req.query.sort === 'oldest' ? 1 : -1;
    // date 필드를 우선으로 정렬하고, 없으면 createdAt으로 정렬
    const sortOptions = { date: sortOrder, createdAt: sortOrder };
    
    // 방문자 목록 조회
    const visitors = await Visitor.find(query)
      .sort(sortOptions)
      .limit(limit)
      .skip(skip)
      .lean();
    
    // 필터링된 전체 방문자 수
    const total = await Visitor.countDocuments(query);
    
    console.log('조회된 방문자 수:', visitors.length, '전체:', total);
    
    res.json({ 
      success: true, 
      data: visitors,
      total: total,
      page: page,
      limit: limit
    });
  } catch (error) {
    console.error('방문자 목록 조회 오류:', error);
    res.json({ 
      success: false, 
      error: '방문자 목록을 불러오는데 실패했습니다.' 
    });
  }
});

// 방문자 기록 초기화 API (인증 필요)
app.delete('/api/visitors', async (req, res) => {
  try {
    // 인증 확인
    if (!req.session || !req.session.isAuthenticated) {
      return res.status(401).json({ 
        success: false, 
        error: '인증이 필요합니다.' 
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.json({ 
        success: false, 
        error: 'MongoDB에 연결되지 않았습니다.' 
      });
    }
    
    // 모든 방문자 기록 삭제
    const result = await Visitor.deleteMany({});
    
    console.log(`🗑️ 방문자 기록 초기화: ${result.deletedCount}개 삭제됨`);
    
    res.json({ 
      success: true, 
      message: `방문자 기록 ${result.deletedCount}개가 삭제되었습니다.`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('방문자 기록 초기화 오류:', error);
    res.status(500).json({ 
      success: false, 
      error: '방문자 기록 초기화에 실패했습니다.' 
    });
  }
});

// Health Check API (MongoDB 연결 상태 확인) - 개선된 버전
app.get('/api/health', async (req, res) => {
  try {
    const readyState = mongoose.connection.readyState;
    
    // 이미 연결되어 있으면 즉시 반환
    if (readyState === 1) {
      return res.json({
        success: true,
        connected: true,
        readyState: readyState,
        mongodb: {
          connected: true,
          host: mongoose.connection.host || null,
          database: mongoose.connection.name || null
        },
        host: mongoose.connection.host || null,
        database: mongoose.connection.name || null,
        hasMongoURI: !!process.env.MONGODB_URI,
        message: 'MongoDB 연결됨'
      });
    }
    
    // 연결되지 않았으면 연결 시도
    try {
      await connectDB();
      const newReadyState = mongoose.connection.readyState;
      
      res.json({
        success: true,
        connected: newReadyState === 1,
        readyState: newReadyState,
        mongodb: {
          connected: newReadyState === 1,
          host: mongoose.connection.host || null,
          database: mongoose.connection.name || null
        },
        host: mongoose.connection.host || null,
        database: mongoose.connection.name || null,
        hasMongoURI: !!process.env.MONGODB_URI,
        message: newReadyState === 1 ? 'MongoDB 연결됨' : 'MongoDB 연결 안됨'
      });
    } catch (connectError) {
      res.json({
        success: false,
        connected: false,
        readyState: mongoose.connection.readyState || 0,
        mongodb: {
          connected: false
        },
        error: connectError.message,
        message: 'MongoDB 연결 실패'
      });
    }
  } catch (error) {
    console.error('Health check 오류:', error);
    res.json({
      success: false,
      connected: false,
      readyState: mongoose.connection.readyState || 0,
      mongodb: {
        connected: false
      },
      error: error.message
    });
  }
});

// 프로젝트 목록 조회
app.get('/api/projects', async (req, res) => {
  try {
    // MongoDB 연결 확인
    if (mongoose.connection.readyState !== 1) {
      console.error('🚨 /api/projects: MongoDB not ready', {
        readyState: mongoose.connection.readyState,
        connected: mongoose.connection.readyState === 1,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      });
      return res.status(503).json({ 
        success: false, 
        error: 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.' 
      });
    }
    
    // .lean()으로 빠른 조회, 필요한 필드만 선택
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .lean()
      .select('id title subtitle description fullDescription image images tags category date role duration team achievements link featured createdAt updatedAt');
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('프로젝트 조회 오류:', error);
    res.status(500).json({ success: false, error: '프로젝트를 불러오는데 실패했습니다.' });
  }
});

// 프로젝트 상세 조회 (MongoDB _id 또는 id로 조회)
app.get('/api/projects/:id', async (req, res) => {
  try {
    // MongoDB 연결 확인
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        success: false, 
        error: 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.' 
      });
    }
    
    // MongoDB _id로 먼저 시도
    let project = await Project.findById(req.params.id);
    
    // _id로 찾지 못하면 id 필드로 검색
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

// 프로젝트 생성
app.post('/api/projects', upload.array('images', 9), async (req, res) => {
  try {
    // MongoDB 연결 확인
    if (mongoose.connection.readyState !== 1) {
      console.error('🚨 POST /api/projects: MongoDB not ready', {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      });
      return res.status(503).json({ 
        success: false, 
        error: 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.' 
      });
    }
    
    const projectData = req.body.project ? JSON.parse(req.body.project) : req.body;
    
    // 업로드된 이미지 경로 추가
    if (req.files && Array.isArray(req.files)) {
      const imagePaths = req.files.map(file => `/projects/${file.filename}`);
      projectData.images = imagePaths;
    }

    // id가 없으면 생성
    if (!projectData.id) {
      projectData.id = Date.now().toString();
    }

    const newProject = await Project.create(projectData);
    res.json({ success: true, data: newProject });
  } catch (error) {
    console.error('프로젝트 생성 오류:', error);
    res.status(500).json({ success: false, error: '프로젝트 생성에 실패했습니다.' });
  }
});

// 프로젝트 수정 (MongoDB _id 또는 id로 수정)
app.put('/api/projects/:id', upload.array('images', 9), async (req, res) => {
  try {
    // MongoDB 연결 확인
    if (mongoose.connection.readyState !== 1) {
      console.error('🚨 PUT /api/projects/:id: MongoDB not ready', {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      });
      return res.status(503).json({ 
        success: false, 
        error: 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.' 
      });
    }
    
    // MongoDB _id로 먼저 시도
    let project = await Project.findById(req.params.id);
    
    // _id로 찾지 못하면 id 필드로 검색
    if (!project) {
      project = await Project.findOne({ id: req.params.id });
    }
    
    if (!project) {
      return res.status(404).json({ success: false, error: '프로젝트를 찾을 수 없습니다.' });
    }

    const projectData = req.body.project ? JSON.parse(req.body.project) : req.body;
    
    // 업로드된 이미지 경로 추가
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const imagePaths = req.files.map(file => `/projects/${file.filename}`);
      projectData.images = [...(project.images || []), ...imagePaths];
    }

    // id는 변경하지 않음
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
});

// 프로젝트 삭제 (MongoDB _id 또는 id로 삭제)
app.delete('/api/projects/:id', async (req, res) => {
  try {
    // MongoDB 연결 확인
    if (mongoose.connection.readyState !== 1) {
      console.error('🚨 DELETE /api/projects/:id: MongoDB not ready', {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      });
      return res.status(503).json({ 
        success: false, 
        error: 'MongoDB가 연결되지 않았습니다. MongoDB를 실행하거나 .env 파일에 MONGODB_URI를 설정하세요.' 
      });
    }
    
    // MongoDB _id로 먼저 시도
    let project = await Project.findById(req.params.id);
    
    // _id로 찾지 못하면 id 필드로 검색
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
    res.status(500).json({ success: false, error: '프로젝트 삭제에 실패했습니다.'     });
  }
});

// 연락 관리 API
// 연락 생성 (FO에서 호출)
app.post('/api/contacts', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ 
        success: false, 
        error: 'MongoDB에 연결되지 않았습니다.' 
      });
    }
    
    const { name, email, message, read } = req.body;
    
    const contact = await Contact.create({
      name,
      email,
      message,
      read: read || false,
    });
    
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('연락 생성 오류:', error);
    res.status(500).json({ success: false, error: '연락 저장에 실패했습니다.' });
  }
});

// 연락 목록 조회
app.get('/api/contacts', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ 
        success: false, 
        error: 'MongoDB에 연결되지 않았습니다.' 
      });
    }
    
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
    
    const total = await Contact.countDocuments();
    
    res.json({ 
      success: true, 
      data: contacts,
      total: total,
      page: page,
      limit: limit
    });
  } catch (error) {
    console.error('연락 목록 조회 오류:', error);
    res.json({ 
      success: false, 
      error: '연락 목록을 불러오는데 실패했습니다.' 
    });
  }
});

// 연락 읽음 처리
app.put('/api/contacts/:id/read', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ 
        success: false, 
        error: 'MongoDB에 연결되지 않았습니다.' 
      });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ success: false, error: '연락을 찾을 수 없습니다.' });
    }
    
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('연락 읽음 처리 오류:', error);
    res.status(500).json({ success: false, error: '읽음 처리에 실패했습니다.' });
  }
});

// 연락 삭제
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ 
        success: false, 
        error: 'MongoDB에 연결되지 않았습니다.' 
      });
    }
    
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ success: false, error: '연락을 찾을 수 없습니다.' });
    }
    
    res.json({ success: true, message: '연락이 삭제되었습니다.' });
  } catch (error) {
    console.error('연락 삭제 오류:', error);
    res.status(500).json({ success: false, error: '삭제에 실패했습니다.' });
  }
});

// /bo-api/* 경로를 동일한 /api/* 엔드포인트로 리다이렉트
// 단, /bo-api/visitors/monthly는 위에서 이미 처리되므로 제외
app.use('/bo-api', (req, res, next) => {
  // /visitors/monthly는 이미 처리되었으므로 제외
  if (req.path === '/visitors/monthly') {
    return next();
  }
  // /upload-pdf는 직접 처리되므로 제외
  if (req.path === '/upload-pdf') {
    return next();
  }
  const targetUrl = '/api' + req.url;
  return res.redirect(307, targetUrl);
});

// PDF 업로드 API
app.post('/api/upload-pdf', (req, res, next) => {
  uploadPdf.single('file')(req, res, (err) => {
    if (err) {
      console.error('PDF 업로드 미들웨어 오류:', err);
      console.error('에러 상세:', {
        message: err.message,
        code: err.code,
        field: err.field,
        name: err.name
      });
      return res.status(400).json({ 
        success: false, 
        error: err.message || 'PDF 파일 업로드에 실패했습니다.' 
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('PDF 업로드 요청 받음:', {
      hasFile: !!req.file,
      file: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        filename: req.file.filename
      } : null,
      body: req.body
    });

    if (!req.file) {
      console.error('PDF 파일이 없음');
      return res.status(400).json({ 
        success: false, 
        error: 'PDF 파일이 업로드되지 않았습니다.' 
      });
    }

    const filePath = `/projects/pdfs/${req.file.filename}`;
    
    console.log(`📄 PDF 업로드 완료: ${filePath}`);
    
    res.json({ 
      success: true, 
      path: filePath,
      filename: req.file.filename,
      message: 'PDF 파일이 업로드되었습니다.' 
    });
  } catch (error) {
    console.error('PDF 업로드 오류:', error);
    console.error('에러 스택:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'PDF 파일 업로드에 실패했습니다.' 
    });
  }
});

// 프로젝트 파일 다운로드 API
app.get('/api/projects/:id/files', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        success: false, 
        error: 'MongoDB에 연결되지 않았습니다.' 
      });
    }
    
    // MongoDB _id로 먼저 시도
    let project = await Project.findById(req.params.id);
    
    // _id로 찾지 못하면 id 필드로 검색
    if (!project) {
      project = await Project.findOne({ id: req.params.id });
    }
    
    if (!project) {
      return res.status(404).json({ success: false, error: '프로젝트를 찾을 수 없습니다.' });
    }
    
    // 프로젝트의 이미지 파일 목록 반환
    const files = [];
    
    // image 필드가 있으면 추가
    if (project.image) {
      files.push({
        name: project.image.split('/').pop() || 'image.jpg',
        path: project.image,
        url: `http://localhost:${PORT}${project.image.startsWith('/') ? project.image : '/' + project.image}`
      });
    }
    
    // images 배열이 있으면 추가
    if (project.images && Array.isArray(project.images)) {
      project.images.forEach(img => {
        if (img && !files.find(f => f.path === img)) {
          files.push({
            name: img.split('/').pop() || 'image.jpg',
            path: img,
            url: `http://localhost:${PORT}${img.startsWith('/') ? img : '/' + img}`
          });
        }
      });
    }
    
    res.json({ success: true, data: files });
  } catch (error) {
    console.error('파일 목록 조회 오류:', error);
    res.status(500).json({ success: false, error: '파일 목록을 불러오는데 실패했습니다.' });
  }
});

// 프로젝트 파일 다운로드
app.get('/api/projects/:id/files/:filename', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        success: false, 
        error: 'MongoDB에 연결되지 않았습니다.' 
      });
    }
    
    // MongoDB _id로 먼저 시도
    let project = await Project.findById(req.params.id);
    
    // _id로 찾지 못하면 id 필드로 검색
    if (!project) {
      project = await Project.findOne({ id: req.params.id });
    }
    
    if (!project) {
      return res.status(404).json({ success: false, error: '프로젝트를 찾을 수 없습니다.' });
    }
    
    const filename = req.params.filename;
    let filePath = null;
    
    // image 필드 확인
    if (project.image && project.image.includes(filename)) {
      filePath = path.join(__dirname, 'public', project.image.replace(/^\//, ''));
    }
    
    // images 배열 확인
    if (!filePath && project.images && Array.isArray(project.images)) {
      const matchedImage = project.images.find(img => img && img.includes(filename));
      if (matchedImage) {
        filePath = path.join(__dirname, 'public', matchedImage.replace(/^\//, ''));
      }
    }
    
    // FO 프로젝트 이미지 경로도 확인
    if (!filePath) {
      const foImagePath = path.join(__dirname, '..', 'public', 'projects', filename);
      if (existsSync(foImagePath)) {
        filePath = foImagePath;
      }
    }
    
    if (!filePath || !existsSync(filePath)) {
      return res.status(404).json({ success: false, error: '파일을 찾을 수 없습니다.' });
    }
    
    // 파일 다운로드
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('파일 다운로드 오류:', err);
        if (!res.headersSent) {
          res.status(500).json({ success: false, error: '파일 다운로드에 실패했습니다.' });
        }
      }
    });
  } catch (error) {
    console.error('파일 다운로드 오류:', error);
    res.status(500).json({ success: false, error: '파일 다운로드에 실패했습니다.' });
  }
});

// 정적 파일 서빙 (모든 라우트 이후)
app.use(express.static(path.join(__dirname, 'public')));

// 정적 프로젝트 데이터를 MongoDB로 자동 마이그레이션
const migrateStaticProjects = async () => {
  try {
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
    return true;
  } catch (error) {
    console.error('❌ 마이그레이션 오류:', error.message);
    return false;
  }
};

// 서버 시작
const startServer = async () => {
  try {
    // MongoDB 연결 (실패해도 서버는 계속 실행)
    const dbConnected = await connectDB();
    
    if (!dbConnected) {
      console.log('⚠️  MongoDB 연결 없이 서버를 시작합니다.');
      console.log('⚠️  프로젝트 관리 기능은 사용할 수 없습니다.');
    } else {
      // MongoDB 연결 성공 시 자동 마이그레이션 실행
      await migrateStaticProjects();
    }
    
    // 서버 시작
    app.listen(PORT, () => {
      console.log(`============================================`);
      console.log(`  백오피스 서버 시작`);
      console.log(`  포트: ${PORT}`);
      console.log(`  관리자 아이디: ${ADMIN_USERNAME}`);
      console.log(`  관리자 비밀번호: ${ADMIN_PASSWORD ? '***' : '없음'}`);
      console.log(`  로그인 엔드포인트: http://localhost:${PORT}/api/bo/auth/login`);
      console.log(`  주소: http://localhost:${PORT}`);
      console.log(`  관리자: http://localhost:${PORT}/admin`);
      if (!dbConnected) {
        console.log(`  ⚠️  MongoDB 연결 필요`);
      }
      console.log(`============================================`);
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer();


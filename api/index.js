// Vercel 서버리스 함수로 Express 서버 래핑
const express = require('express');
const cors = require('cors');
const path = require('path');
const { existsSync, mkdirSync, readdirSync, readFileSync } = require('fs');
const multer = require('multer');
const mongoose = require('mongoose');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

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
    'https://hyeyeon-portfolio.vercel.app',
    process.env.FRONTEND_URL || 'https://hyeyeon-portfolio.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 세션 설정 (Vercel 서버리스 환경에 맞게 MemoryStore 사용)
app.use(session({
  secret: process.env.SESSION_SECRET || 'vibe-coding-portfolio-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000 // 24시간
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // 프로덕션에서는 HTTPS만
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24시간
  }
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
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dpffla525!';

// 로그인 체크 미들웨어
const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/admin/login');
};

// 정적 파일 서빙 (admin HTML 파일들)
app.use('/admin', express.static(path.join(__dirname, '../server/admin')));

// 백오피스 관리자 페이지 라우트
app.get('/admin/login', (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    return res.redirect('/admin');
  }
  const loginPath = path.join(__dirname, '../server/admin/login.html');
  res.sendFile(loginPath);
});

app.get('/admin/viewer', (req, res) => {
  const adminPath = path.join(__dirname, '../server/admin/index.html');
  res.sendFile(adminPath);
});

app.get('/admin', requireAuth, (req, res) => {
  const adminPath = path.join(__dirname, '../server/admin/index.html');
  res.sendFile(adminPath);
});

app.get('/admin/create', requireAuth, (req, res) => {
  const createPath = path.join(__dirname, '../server/admin/create.html');
  res.sendFile(createPath);
});

// API Routes
// 인증 API
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    req.session.username = username;
    res.json({ success: true, message: '로그인 성공' });
  } else {
    res.status(401).json({ success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: '로그아웃 실패' });
    }
    res.json({ success: true, message: '로그아웃 성공' });
  });
});

app.get('/api/auth/check', (req, res) => {
  res.json({
    success: true,
    authenticated: req.session && req.session.isAuthenticated || false
  });
});

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

// 프로젝트 생성
app.post('/api/projects', upload.array('images', 9), async (req, res) => {
  try {
    await initDB();
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'MongoDB가 연결되지 않았습니다.'
      });
    }
    const projectData = req.body.project ? JSON.parse(req.body.project) : req.body;
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
    res.json({ success: true, data: newProject });
  } catch (error) {
    console.error('프로젝트 생성 오류:', error);
    res.status(500).json({ success: false, error: '프로젝트 생성에 실패했습니다.' });
  }
});

// 프로젝트 수정
app.put('/api/projects/:id', upload.array('images', 9), async (req, res) => {
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
});

// 프로젝트 삭제
app.delete('/api/projects/:id', async (req, res) => {
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


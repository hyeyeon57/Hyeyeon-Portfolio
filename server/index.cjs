require('dotenv').config();
const { createApp, ADMIN_CONFIG } = require('./app.cjs');
const { connectDB } = require('./config/database.cjs');
const { migrateStaticProjects } = require('./services/migrationService.cjs');

const app = createApp();
const PORT = process.env.PORT || 3005;

const startServer = async () => {
  try {
    const dbConnected = await connectDB();

    if (!dbConnected) {
      console.log('⚠️  MongoDB 연결 없이 서버를 시작합니다.');
      console.log('⚠️  프로젝트 관리 기능은 사용할 수 없습니다.');
    } else {
      await migrateStaticProjects();
    }

    app.listen(PORT, () => {
      console.log('============================================');
      console.log('  백오피스 서버 시작');
      console.log(`  포트: ${PORT}`);
      console.log(`  관리자 아이디: ${ADMIN_CONFIG.USERNAME}`);
      console.log(`  관리자 비밀번호: ${ADMIN_CONFIG.PASSWORD ? '***' : '없음'}`);
      console.log(`  로그인 엔드포인트: http://localhost:${PORT}/api/bo/auth/login`);
      console.log(`  주소: http://localhost:${PORT}`);
      console.log(`  관리자: http://localhost:${PORT}/admin`);
      if (!dbConnected) {
        console.log('  ⚠️  MongoDB 연결 필요');
      }
      console.log('============================================');
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer();

require('dotenv').config();
const { createApp } = require('../server/app.cjs');
const { connectDB } = require('../server/config/database.cjs');
const { migrateStaticProjects } = require('../server/services/migrationService.cjs');

// Vercel 서버리스/로컬 API 공용 앱 (DB 연결 미들웨어 포함)
const app = createApp({ withDbMiddleware: true });

// 서버리스 환경에서 초기 연결/마이그레이션 시도 (best-effort)
(async () => {
  try {
    const connected = await connectDB();
    if (connected) {
      await migrateStaticProjects();
    }
  } catch (error) {
    console.error('⚠️ 초기 MongoDB 연결/마이그레이션 실패(서버리스):', error.message);
  }
})();

// Vercel 서버리스 핸들러
module.exports = (req, res) => {
  // Next.js/Vercel가 OPTIONS를 이미 처리하지만, Express로 위임
  return app(req, res);
};

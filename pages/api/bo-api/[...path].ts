import type { NextApiRequest, NextApiResponse } from 'next';

// Express 앱을 서버리스 함수로 감싸기
const { createApp } = require('../../../server/app.cjs');

// 서버리스 실행 시 매번 앱 생성하는 비용을 줄이기 위해 모듈 레벨에 캐싱
if (!process.env.SERVERLESS_EXPRESS) {
  process.env.SERVERLESS_EXPRESS = 'true';
}
const app = createApp({ withDbMiddleware: true });

export const config = {
  api: {
    bodyParser: false, // multer 등에서 직접 처리
    externalResolver: true, // Express 응답을 그대로 사용
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 디버깅 로그
  console.log('[bo-api handler] incoming', {
    method: req.method,
    url: req.url,
    cookies: req.cookies,
    hasCookie: !!req.headers.cookie
  });

  // /api/bo-api/... -> /bo-api/... 로 URL을 원복시켜 Express 라우터와 맞춤
  if (req.url?.startsWith('/api/bo-api')) {
    req.url = req.url.replace(/^\/api\/bo-api/, '/bo-api') || '/bo-api';
  }
  return app(req, res);
}

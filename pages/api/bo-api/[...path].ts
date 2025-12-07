import type { NextApiRequest, NextApiResponse } from 'next';

// Express 앱을 서버리스 함수로 감싸기
let app: any = null;
let appError: Error | null = null;

try {
  const { createApp } = require('../../../server/app.cjs');
  
  // 서버리스 실행 시 매번 앱 생성하는 비용을 줄이기 위해 모듈 레벨에 캐싱
  if (!process.env.SERVERLESS_EXPRESS) {
    process.env.SERVERLESS_EXPRESS = 'true';
  }
  
  app = createApp({ withDbMiddleware: true });
  console.log('[bo-api] Express app initialized successfully');
} catch (error: any) {
  console.error('[bo-api] Failed to initialize Express app:', error);
  appError = error;
}

export const config = {
  api: {
    bodyParser: false, // multer 등에서 직접 처리
    externalResolver: true, // Express 응답을 그대로 사용
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Express 앱 초기화 실패 시 즉시 반환
  if (appError || !app) {
    console.error('[bo-api handler] Express app initialization failed:', appError?.message || 'App is null');
    return res.status(500).json({
      error: 'Server initialization failed',
      message: appError?.message || 'Express app is not available',
      ...(process.env.NODE_ENV === 'development' && { 
        stack: appError?.stack,
        details: 'Check server logs for more information'
      }),
    });
  }

  try {
    // 디버깅 로그
    console.log('[bo-api handler] incoming', {
      method: req.method,
      url: req.url,
      path: req.url,
      query: req.query,
      cookies: req.cookies,
      hasCookie: !!req.headers.cookie,
      isVercel: !!process.env.VERCEL,
    });

    // /api/bo-api/... -> /bo-api/... 로 URL을 원복시켜 Express 라우터와 맞춤
    const originalUrl = req.url || '';
    let processedUrl = originalUrl;
    
    if (originalUrl.startsWith('/api/bo-api')) {
      processedUrl = originalUrl.replace(/^\/api\/bo-api/, '/bo-api') || '/bo-api';
    } else if (!originalUrl.startsWith('/bo-api') && !originalUrl.startsWith('/admin')) {
      // 경로가 /bo-api나 /admin으로 시작하지 않으면 추가
      const pathArray = req.query.path as string[] || [];
      const path = Array.isArray(pathArray) ? pathArray.join('/') : pathArray;
      processedUrl = `/bo-api/${path || ''}`;
    }

    // req.url 수정
    req.url = processedUrl;

    console.log('[bo-api handler] processed URL:', {
      original: originalUrl,
      processed: processedUrl,
    });

    // Express 앱으로 요청 전달 (Promise로 감싸서 에러 처리)
    return new Promise((resolve) => {
      const originalEnd = res.end.bind(res);
      let responseEnded = false;

      res.end = function(...args: any[]) {
        if (!responseEnded) {
          responseEnded = true;
          resolve(undefined);
        }
        return originalEnd(...args);
      };

      try {
        app(req, res);
      } catch (handlerError: any) {
        console.error('[bo-api handler] Express handler error:', handlerError);
        if (!res.headersSent) {
          res.status(500).json({
            error: 'Request handler failed',
            message: handlerError?.message || 'Unknown error in Express handler',
          });
        }
        resolve(undefined);
      }
    });
  } catch (error: any) {
    console.error('[bo-api handler] Top-level error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    
    if (!res.headersSent) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error?.message || 'Unknown error occurred',
        ...(process.env.NODE_ENV === 'development' && { stack: error?.stack }),
      });
    }
  }
}

const requireAuth = (req, res, next) => {
  console.log('[Auth] requireAuth 체크:', {
    path: req.path,
    method: req.method,
    hasSession: !!req.session,
    sessionID: req.sessionID,
    isAuthenticated: req.session?.isAuthenticated,
    cookies: req.cookies,
    hasCookieHeader: !!req.headers.cookie
  });

  if (req.session && req.session.isAuthenticated) {
    // 세션 갱신: 인증된 사용자의 요청마다 세션을 갱신하여 만료 방지
    req.session.touch();
    req.session.save((err) => {
      if (err) {
        console.error('[Auth] 세션 갱신 실패:', err);
      } else {
        console.log('[Auth] 인증 성공, 세션 갱신됨');
      }
    });
    console.log('[Auth] 인증 성공, 다음 미들웨어로 진행');
    return next();
  }

  console.log('[Auth] 인증 실패');

  // API 요청인 경우 JSON 응답 반환 (AJAX/fetch)
  if (req.xhr || req.headers.accept?.includes('application/json') || req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/bo-api')) {
    return res.status(401).json({
      success: false,
      error: '인증이 필요합니다.',
      authenticated: false
    });
  }

  // HTML 요청인 경우 리다이렉트
  return res.redirect('/admin/login');
};

module.exports = { requireAuth };

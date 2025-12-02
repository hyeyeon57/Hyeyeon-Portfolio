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
    console.log('[Auth] 인증 성공, 다음 미들웨어로 진행');
    return next();
  }

  console.log('[Auth] 인증 실패');

  // API 요청인 경우 JSON 응답 반환 (AJAX/fetch)
  if (req.xhr || req.headers.accept?.includes('application/json') || req.path.startsWith('/api') || req.path.startsWith('/bo-api')) {
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

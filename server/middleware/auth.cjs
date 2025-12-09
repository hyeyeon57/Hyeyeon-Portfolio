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
    // 세션 갱신: rolling 옵션이 활성화되어 있으므로 자동 갱신됨
    // 추가로 touch()를 호출하여 확실히 갱신
    req.session.touch();
    // 세션 저장을 동기적으로 처리하여 타이밍 이슈 방지
    try {
      req.session.save((err) => {
        if (err) {
          console.error('[Auth] 세션 갱신 실패:', err);
        } else {
          console.log('[Auth] 인증 성공, 세션 갱신됨');
        }
      });
    } catch (saveError) {
      console.error('[Auth] 세션 저장 중 오류:', saveError);
    }
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

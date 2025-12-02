const { ADMIN_CONFIG } = require('../../config/constants');
const { ok, fail } = require('../../utils/httpResponse.cjs');

const normalize = (value) => (value ? value.trim() : '');

const login = (req, res) => {
  const username = normalize(req.body.username);
  const password = normalize(req.body.password);

  console.log('[Auth] 로그인 시도:', { username, hasSession: !!req.session, sessionID: req.sessionID });

  if (username === ADMIN_CONFIG.USERNAME && password === ADMIN_CONFIG.PASSWORD) {
    req.session.isAuthenticated = true;
    req.session.username = username;

    // 세션 저장 명시적으로 호출
    req.session.save((err) => {
      if (err) {
        console.error('[Auth] 세션 저장 실패:', err);
        return fail(res, 500, '세션 저장 실패');
      }
      console.log('[Auth] 로그인 성공, 세션 저장됨:', { sessionID: req.sessionID, isAuthenticated: req.session.isAuthenticated });
      return ok(res, { message: '로그인 성공' });
    });
    return;
  }

  return fail(res, 401, '아이디 또는 비밀번호가 올바르지 않습니다.');
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return fail(res, 500, '로그아웃 실패');
    }
    return ok(res, { message: '로그아웃 성공' });
  });
};

const check = (req, res) => {
  const authenticated = !!(req.session && req.session.isAuthenticated);
  console.log('[Auth] 인증 체크:', {
    hasSession: !!req.session,
    sessionID: req.sessionID,
    isAuthenticated: req.session?.isAuthenticated,
    authenticated
  });
  return ok(res, { authenticated });
};

module.exports = { login, logout, check };

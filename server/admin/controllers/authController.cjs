const { ADMIN_CONFIG } = require('../../config/constants');
const { ok, fail } = require('../../utils/httpResponse.cjs');

const normalize = (value) => (value ? value.trim() : '');

const login = (req, res) => {
  const username = normalize(req.body.username);
  const password = normalize(req.body.password);

  if (username === ADMIN_CONFIG.USERNAME && password === ADMIN_CONFIG.PASSWORD) {
    req.session.isAuthenticated = true;
    req.session.username = username;
    return ok(res, { message: '로그인 성공' });
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

const check = (req, res) =>
  ok(res, { authenticated: !!(req.session && req.session.isAuthenticated) });

module.exports = { login, logout, check };

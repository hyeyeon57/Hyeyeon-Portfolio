const { ok, fail } = require('../utils/httpResponse.cjs');
const {
  logVisit,
  getStats,
  getMonthlyStats,
  listVisitors,
  clearVisitors,
} = require('../services/visitorService.cjs');

const postVisitor = async (req, res) => {
  const { ip, userAgent, path, visitorId } = req.body;

  // 프록시 환경에서의 실제 클라이언트 IP 추출
  const forwardedFor = (req.headers['x-forwarded-for'] || '').split(',').map(s => s.trim()).filter(Boolean);
  const clientIp =
    ip ||
    forwardedFor[0] ||
    req.headers['cf-connecting-ip'] ||
    req.headers['x-real-ip'] ||
    req.ip ||
    req.connection.remoteAddress;

  const clientUserAgent = userAgent || req.get('user-agent');
  const clientPath = path || '/';

  const result = await logVisit({ visitorId, ip: clientIp, userAgent: clientUserAgent, path: clientPath });
  if (!result.ok) {
    return res.json({ success: false, error: result.message });
  }

  if (result.duplicated) {
    return ok(res, { message: '중복 방문 로그 (무시됨)' });
  }

  return ok(res, { message: '방문자 로그 저장 완료' });
};

const getVisitorStats = async (req, res) => {
  const stats = await getStats();
  return res.json(stats);
};

const getMonthlyVisitorStats = async (req, res) => {
  const year = parseInt(req.query.year, 10) || new Date().getFullYear();
  const month = parseInt(req.query.month, 10) || new Date().getMonth() + 1;
  const stats = await getMonthlyStats({ year, month });
  return res.json(stats);
};

const getVisitors = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const page = parseInt(req.query.page, 10) || 1;

  const result = await listVisitors({
    limit,
    page,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    sort: req.query.sort,
  });

  if (!result.ok) {
    return res.json({ success: false, error: result.message });
  }

  return ok(res, {
    data: result.data,
    total: result.total,
    page: result.page,
    limit: result.limit,
  });
};

const deleteVisitors = async (req, res) => {
  if (!req.session || !req.session.isAuthenticated) {
    return fail(res, 401, '인증이 필요합니다.');
  }

  const result = await clearVisitors();
  if (!result.ok) {
    return res.json({ success: false, error: result.message });
  }

  return ok(res, {
    message: `방문자 기록 ${result.deletedCount}개가 삭제되었습니다.`,
    deletedCount: result.deletedCount,
  });
};

module.exports = {
  postVisitor,
  getVisitorStats,
  getMonthlyVisitorStats,
  getVisitors,
  deleteVisitors,
};

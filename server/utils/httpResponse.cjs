const ok = (res, payload = {}) => res.json({ success: true, ...payload });

const fail = (res, status, message) =>
  res.status(status).json({ success: false, error: message });

module.exports = { ok, fail };

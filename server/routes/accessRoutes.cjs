const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const SiteAccess = require('../models/SiteAccess.cjs');
const { requireAuth } = require('../middleware/auth.cjs');

async function getOrCreateSettings() {
  let doc = await SiteAccess.findOne({ key: 'site_access' });
  if (!doc) {
    doc = await SiteAccess.create({
      key: 'site_access',
      mode: 'public',
      shareLinkEnabled: true,
      shareLinkToken: crypto.randomBytes(16).toString('hex'),
      allowedUsers: [],
    });
  }
  return doc;
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const map = {};
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx > -1) {
      const k = part.slice(0, idx).trim();
      const v = decodeURIComponent(part.slice(idx + 1).trim());
      map[k] = v;
    }
  });
  return map;
}

function isTokenValid(doc, token) {
  if (!token) return { valid: false };
  if (doc.shareLinkEnabled && doc.shareLinkToken && token === doc.shareLinkToken) {
    return { valid: true, via: 'link', email: null };
  }
  const matched = (doc.allowedUsers || []).find((u) => u.token === token);
  if (matched) {
    return { valid: true, via: 'user', email: matched.email };
  }
  return { valid: false };
}

// FO: 현재 공개/비공개 상태 및 접근 가능 여부 확인
router.get('/status', async (req, res) => {
  try {
    const doc = await getOrCreateSettings();
    if (doc.mode === 'public') {
      return res.json({
        success: true,
        mode: 'public',
        hasAccess: true,
        privateMessage: doc.privateMessage,
      });
    }

    // FO 열람 판단은 공유 링크 또는 허용된 사용자 토큰으로만 한다.
    // (BO 관리자 세션으로는 FO 열람 권한을 부여하지 않는다.)
    const cookies = parseCookies(req);
    const token = req.query.token || cookies.portfolio_access_token || '';
    const check = isTokenValid(doc, token);

    return res.json({
      success: true,
      mode: 'private',
      hasAccess: check.valid,
      email: check.email || null,
      privateMessage: doc.privateMessage,
    });
  } catch (err) {
    console.error('[accessRoutes] GET /status error:', err);
    return res.json({ success: true, mode: 'public', hasAccess: true });
  }
});

// FO: 이메일 또는 공유 토큰으로 접근 인증
router.post('/verify', async (req, res) => {
  try {
    const doc = await getOrCreateSettings();
    if (doc.mode === 'public') {
      return res.json({ success: true, hasAccess: true, mode: 'public' });
    }

    const email = String(req.body?.email || '').trim().toLowerCase();
    const token = String(req.body?.token || '').trim();

    let grantToken = null;
    let grantedEmail = null;

    if (token) {
      const check = isTokenValid(doc, token);
      if (check.valid) {
        grantToken = token;
        grantedEmail = check.email;
      }
    }

    if (!grantToken && email) {
      const user = (doc.allowedUsers || []).find((u) => u.email.toLowerCase() === email);
      if (user) {
        grantToken = user.token;
        grantedEmail = user.email;
      }
    }

    if (!grantToken) {
      return res.status(403).json({
        success: false,
        hasAccess: false,
        message: '접근 권한이 없는 이메일이거나 유효하지 않은 링크입니다.',
      });
    }

    res.cookie('portfolio_access_token', grantToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return res.json({
      success: true,
      hasAccess: true,
      token: grantToken,
      email: grantedEmail,
    });
  } catch (err) {
    console.error('[accessRoutes] POST /verify error:', err);
    return res.status(500).json({ success: false, message: '인증 처리 중 오류가 발생했습니다.' });
  }
});

// BO: 전체 접근 권한 설정 조회
router.get('/settings', requireAuth, async (req, res) => {
  try {
    const doc = await getOrCreateSettings();
    return res.json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// BO: 공개/비공개 모드 및 일반 액세스 설정 변경
router.put('/mode', requireAuth, async (req, res) => {
  try {
    const doc = await getOrCreateSettings();
    if (req.body.mode === 'public' || req.body.mode === 'private') {
      doc.mode = req.body.mode;
    }
    if (typeof req.body.shareLinkEnabled === 'boolean') {
      doc.shareLinkEnabled = req.body.shareLinkEnabled;
    }
    if (typeof req.body.privateMessage === 'string') {
      doc.privateMessage = req.body.privateMessage.trim();
    }
    await doc.save();
    return res.json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// BO: 공유 링크 토큰 재발급
router.post('/regenerate-link', requireAuth, async (req, res) => {
  try {
    const doc = await getOrCreateSettings();
    doc.shareLinkToken = crypto.randomBytes(16).toString('hex');
    await doc.save();
    return res.json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// BO: 열람 권한 사용자 추가 (열람 전용)
router.post('/users', requireAuth, async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const name = String(req.body?.name || '').trim();

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: '올바른 이메일 주소를 입력해주세요.' });
    }

    const doc = await getOrCreateSettings();
    const existing = doc.allowedUsers.find((u) => u.email.toLowerCase() === email);
    if (existing) {
      existing.name = name || existing.name;
    } else {
      doc.allowedUsers.push({
        email,
        name,
        token: crypto.randomBytes(16).toString('hex'),
        createdAt: new Date(),
      });
    }
    await doc.save();
    return res.json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// BO: 열람 권한 회수(삭제)
router.delete('/users/:email', requireAuth, async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email || '').trim().toLowerCase();
    const doc = await getOrCreateSettings();
    doc.allowedUsers = doc.allowedUsers.filter((u) => u.email.toLowerCase() !== email);
    await doc.save();
    return res.json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

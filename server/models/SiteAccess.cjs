const mongoose = require('mongoose');
const crypto = require('crypto');

const allowedUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, default: '', trim: true },
    token: {
      type: String,
      default: () => crypto.randomBytes(16).toString('hex'),
    },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const siteAccessSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'site_access' },
    mode: { type: String, enum: ['public', 'private'], default: 'public' },
    privateMessage: {
      type: String,
      default: '현재 비공개 모드입니다. 접근 권한이 있는 이메일로 인증 후 열람하실 수 있습니다.',
    },
    shareLinkEnabled: { type: Boolean, default: true },
    shareLinkToken: {
      type: String,
      default: () => crypto.randomBytes(16).toString('hex'),
    },
    allowedUsers: { type: [allowedUserSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.models.SiteAccess || mongoose.model('SiteAccess', siteAccessSchema);

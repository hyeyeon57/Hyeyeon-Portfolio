const mongoose = require('mongoose');
const { Schema } = mongoose;

const VisitorSchema = new Schema(
  {
    visitorId: {
      type: String,
      index: true,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    path: {
      type: String,
      default: '/',
    },
    date: {
      type: Date,
      default: Date.now,
      index: true, // 인덱스 추가
    },
  },
  {
    timestamps: true,
  }
);

// 인덱스 추가 (날짜별 조회 최적화)
VisitorSchema.index({ date: 1 });
VisitorSchema.index({ createdAt: 1 });
VisitorSchema.index({ visitorId: 1, date: 1 });

module.exports = mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);


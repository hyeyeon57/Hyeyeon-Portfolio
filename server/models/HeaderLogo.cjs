const mongoose = require('mongoose');
const { Schema } = mongoose;

const HeaderLogoSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

// 단일 문서만 유지하도록 인덱스 추가
HeaderLogoSchema.index({ _id: 1 }, { unique: true });

module.exports = mongoose.models.HeaderLogo || mongoose.model('HeaderLogo', HeaderLogoSchema);


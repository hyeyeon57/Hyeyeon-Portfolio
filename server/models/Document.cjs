const mongoose = require('mongoose');
const { Schema } = mongoose;

const DocumentSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['resume', 'coverLetter'], // 이력서 또는 자기소개서
      unique: true, // 각 타입당 하나만 존재
    },
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

// 인덱스 추가
DocumentSchema.index({ type: 1 });

module.exports = mongoose.models.Document || mongoose.model('Document', DocumentSchema);


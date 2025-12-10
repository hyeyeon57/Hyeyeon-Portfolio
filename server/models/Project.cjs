const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    fullDescription: {
      type: String,
    },
    image: {
      type: String,
    },
    tags: [{
      type: String,
    }],
    category: {
      type: [String],
      required: true,
      validate: {
        validator: function(v) {
          const validCategories = ['new', 'renewal', 'app', 'web', 'design'];
          if (Array.isArray(v)) {
            return v.length > 0 && v.every(cat => validCategories.includes(cat));
          }
          return validCategories.includes(v);
        },
        message: '카테고리는 new, renewal, app, web, design 중 하나 이상이어야 합니다.'
      }
    },
    date: {
      type: String,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    role: {
      type: String,
    },
    duration: {
      type: String,
    },
    team: {
      type: String,
    },
    achievements: [{
      type: String,
    }],
    images: [{
      type: String,
    }],
    link: {
      type: String,
    },
    designLink: {
      type: String,
    },
    figmaLink: {
      type: String,
    },
    designFile: {
      type: String,
    },
    designPdf: {
      type: String,
    },
    detailPdf: {
      type: String,
    },
    previewPdf: {
      type: String,
    },
    retrospective: {
      type: String,
    },
    gallery: [{
      type: String,
    }],
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);


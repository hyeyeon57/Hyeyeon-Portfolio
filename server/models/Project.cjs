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
      type: String,
      required: true,
      enum: ['new', 'renewal', 'app', 'web', 'proposal', 'usability'],
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);


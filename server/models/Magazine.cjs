const mongoose = require('mongoose');

const magazineSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    date: { type: String, default: '' },
    readTime: { type: String, default: '4 min read' },
    projectTag: { type: String, default: '' },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    image: { type: String, default: '' },
    tags: { type: [String], default: [] },
    sections: {
      type: [
        {
          heading: { type: String, default: '' },
          body: { type: [String], default: [] },
        },
      ],
      default: [],
    },
    takeaways: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Magazine || mongoose.model('Magazine', magazineSchema);

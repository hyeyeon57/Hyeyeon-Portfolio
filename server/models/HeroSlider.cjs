const mongoose = require('mongoose');
const { Schema } = mongoose;

const HeroSliderSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.HeroSlider || mongoose.model('HeroSlider', HeroSliderSchema);


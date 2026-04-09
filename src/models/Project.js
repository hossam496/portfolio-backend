import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    image: { type: String, required: true, trim: true },
    technologies: {
      type: [String],
      default: [],
      validate: {
        validator(v) {
          return Array.isArray(v) && v.length <= 50;
        },
        message: 'Too many technologies',
      },
    },
    githubLink: { type: String, trim: true, default: '' },
    liveDemo: { type: String, trim: true, default: '' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

projectSchema.index({ createdAt: -1 });

export default mongoose.model('Project', projectSchema);

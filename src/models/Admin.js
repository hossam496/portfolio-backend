import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: { type: String, required: true, select: false },
});

adminSchema.methods.comparePassword = function comparePassword(plain) {
  if (typeof plain !== 'string' || !this.passwordHash) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(plain, this.passwordHash);
};

export async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export default mongoose.model('Admin', adminSchema);

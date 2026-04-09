import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin, { hashPassword } from '../models/Admin.js';

dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI required');
  await mongoose.connect(uri);
  const email = String(
    process.env.ADMIN_EMAIL || 'admin@portfolio.local'
  )
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const existing = await Admin.findOne({ email }).select('+passwordHash');
  if (existing) {
    if (existing.passwordHash) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }
    console.log('Admin document missing password hash — updating…');
    existing.passwordHash = await hashPassword(password);
    await existing.save();
    console.log('Password hash set for:', email);
    process.exit(0);
  }
  const passwordHash = await hashPassword(password);
  await Admin.create({ email, passwordHash });
  console.log('Admin created:', email);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

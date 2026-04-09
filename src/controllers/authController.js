import Admin from '../models/Admin.js';
import { signToken } from '../utils/generateToken.js';

export async function login(req, res, next) {
  try {
    const password = req.body.password;
    const email = String(req.body.email || '')
      .trim()
      .toLowerCase();
    const admin = await Admin.findOne({ email }).select('+passwordHash');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!admin.passwordHash) {
      return res.status(503).json({
        message:
          'Admin account has no password set. Run: npm run seed:admin (or delete the admin document and seed again).',
      });
    }
    if (typeof password !== 'string') {
      return res.status(400).json({ message: 'Password is required' });
    }
    const valid = await admin.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = signToken(admin._id.toString());
    res.json({
      token,
      admin: { email: admin.email, id: admin._id },
    });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    const admin = await Admin.findById(req.adminId).lean();
    if (!admin) return res.status(401).json({ message: 'Not authorized' });
    res.json({ admin: { email: admin.email, id: admin._id } });
  } catch (e) {
    next(e);
  }
}

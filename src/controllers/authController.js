import Admin from '../models/Admin.js';
import { signToken } from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

export async function login(req, res, next) {
  try {
    console.log("LOGIN START 🔥");

    const password = req.body.password;
    const email = String(req.body.email || '').trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const admin = await Admin.findOne({ email }).select('+passwordHash');

    console.log("ADMIN:", admin);

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);

    console.log("PASSWORD VALID:", valid);

    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(admin._id.toString());

    return res.json({
      token,
      admin: { email: admin.email, id: admin._id },
    });

  } catch (e) {
    console.error("LOGIN ERROR:", e);
    return res.status(500).json({ message: "Server error" });
  }
}
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { configureCloudinary } from './config/cloudinary.js';

dotenv.config();

const app = express();

const clientUrl = process.env.CLIENT_URL || 'https://portfolio-iota-opal-61.vercel.app';

function allowOrigin(origin) {
  if (!origin) return true;
  
  // Clean trailing slashes for comparison
  const cleanOrigin = origin.replace(/\/$/, "");
  const cleanClientUrl = clientUrl.replace(/\/$/, "");
  
  if (cleanOrigin === cleanClientUrl) return true;
  
  try {
    const { hostname } = new URL(origin);
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    if (hostname.endsWith('vercel.app')) return true; // Allow any vercel deployment preview
  } catch {
    return false;
  }
  return false;
}

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (allowOrigin(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

configureCloudinary();

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, cloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME) });
});

app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorHandler);

export default app;

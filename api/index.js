import serverless from 'serverless-http';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

let isConnected = false;

const handler = serverless(app);

export default async (req, res) => {
  try {
    if (!isConnected) {
      const uri = process.env.MONGODB_URI;
      if (!uri) throw new Error("MONGODB_URI missing");

      await connectDB(uri);
      isConnected = true;
      console.log("Mongo Connected ✅");
    }

    return handler(req, res);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
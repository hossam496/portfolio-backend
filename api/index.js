import serverless from "serverless-http";
import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

const handler = serverless(app);

export default async (req, res) => {
  try {
    await connectDB(process.env.MONGODB_URI);
    return handler(req, res);
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
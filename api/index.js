import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

export default async (req, res) => {
  try {
    await connectDB(process.env.MONGODB_URI);
    
    // Vercel provides standard Node.js req and res objects,
    // which Express can handle directly without "serverless-http".
    return app(req, res);
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
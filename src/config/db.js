import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (uri) => {
  if (isConnected) return;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // 🔥 يمنع التعليق
    });

    isConnected = true;
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("Mongo Error ❌", error);
    throw error;
  }
};
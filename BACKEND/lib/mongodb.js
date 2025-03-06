// This file is responsible for managing the MongoDB connection using Mongoose
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from 'path';


dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI 

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

// MongoDB connection handler for application
// ensures the app connects to MongoDB efficiently

// if a connection to mongodb exists, reuses it. otherwise creates a new connection and stores it in cached.promise
// this prevents unnecessary database reconnections 
let cached = global.mongoose || { conn: null, promise: null};

export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "latticetalk"
    });
    console.log("Connected to MongoDB:", mongoose.connection.name);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

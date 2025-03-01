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
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise; // waits for connection
    return cached.conn;
}


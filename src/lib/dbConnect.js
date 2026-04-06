import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI")
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise

  // Log the connected cluster/DB for debugging (won't show credentials)
  if (process.env.NODE_ENV !== "production") {
    console.log("Mongoose connected to:", {
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    })
  }

  return cached.conn
}

export default dbConnect


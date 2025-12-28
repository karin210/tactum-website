import mongoose, { Mongoose } from "mongoose";

interface MongooseConnection {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

const MONGODB_EARLYADOPTERS_URI = process.env.MONGODB_EARLYADOPTERS_URI;

if (!MONGODB_EARLYADOPTERS_URI) {
  throw new Error("Please define the MONGODB_EARLYADOPTERS_URI environment variable");
}

let cached: MongooseConnection = (global as any).mongoose ;

if(!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if(cached.conn) return cached.conn;

  if(!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_EARLYADOPTERS_URI as string).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
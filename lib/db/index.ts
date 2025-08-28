import mongoose from "mongoose"; // Import mongoose to connect to MongoDB

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null };
// Store the MongoDB connection in the global object
// - This prevents reconnecting every time Next.js reloads
// - If global.mongoose exists, use it, otherwise start fresh

export const connectToDatabase = async (
  MONGODB_URL = process.env.MONGODB_URL // Default to .env variable if not provided
) => {
  if (cached.conn) return cached.conn;
  // ✅ If a connection already exists, just return it

  if (!MONGODB_URL) throw new Error("MONGODB_URI is missing");
  // ❌ Throw error if no MongoDB URL is found

  cached.promise = cached.promise || mongoose.connect(MONGODB_URL);
  // If no promise exists yet, start a new connection
  // Otherwise reuse the existing one

  cached.conn = await cached.promise;
  // Wait for the connection to resolve and store it

  return cached.conn;
  // ✅ Return the active connection
};

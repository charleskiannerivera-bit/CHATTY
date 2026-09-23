import mongoose from "mongoose";
import dns from "node:dns";

// Force Node.js to use reliable public DNS servers
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI is required");
    }

    const conn = await mongoose.connect(mongoURI);

    console.log("MongoDB is connected:", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
}

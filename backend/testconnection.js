import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    mongoose.connection.close(); 
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

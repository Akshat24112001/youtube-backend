import mongoose from "mongoose";

// for making connection to the database
const connectDB = async () => {
  try {
    // connecting to the mongodb uri present in .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error", error);
    // exiting the connection or process in case connection fails
    process.exit(1);
  }
};

export default connectDB;

import express from "express";

import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";

// configuring environment variables
dotenv.config();
// connection to the database
connectDB();

//  initilizing the express server
const app = express();
// setting up the port on which server is running
const PORT = process.env.PORT || 4000;
// setting cors settings
app.use(cors());
// setting up cookie parser for using cookies
app.use(cookieParser());
// so that express can read json formatted file
app.use(express.json());

app.use("/api/user",userRoutes)
// starting the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

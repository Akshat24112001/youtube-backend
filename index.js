import express from "express";

import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import channelRoutes from "./routes/channel.routes.js";
import videoRouter from "./routes/video.routes.js";

// configuring environment variables
dotenv.config();
// connection to the database
connectDB();

//  initilizing the express server
const app = express();
// setting up the port on which server is running
const PORT = process.env.PORT || 4000;
// setting cors settings
app.use(
  cors({
    origin: process.env.CLIENT_URL, // client server
    credentials: true,
  })
);
// setting up cookie parser for using cookies
app.use(cookieParser());
// so that express can read json formatted file
app.use(express.json());

app.use("/api/user",userRoutes)

app.use("/api/video",videoRouter)

app.use("/api/channel",channelRoutes)
// starting the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

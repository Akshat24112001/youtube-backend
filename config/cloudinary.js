// for getting environment variables from the .env file
import dotenv from "dotenv";
dotenv.config(); 

import { v2 as cloudinary } from "cloudinary";

// for configuring with the cloudinary  
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

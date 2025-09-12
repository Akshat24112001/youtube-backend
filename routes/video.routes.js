import express from "express";

import { protect } from "../middlewares/user.middlewares.js";
import { videoUpload } from "../middlewares/upload.js";

import {
  getAllVideos,
  uploadVideo,
  getCurrentVideo,
  deleteVideo,
  getTopTags,
  getVideosByTag,
  editVideo,
  addView,
} from "../controllers/video.controllers.js";

const videoRouter = express.Router(); //route instance for video

videoRouter.get("/", getAllVideos); //for getting the video collection
videoRouter.get("/:id", getCurrentVideo); // for getting a video by ID
videoRouter.post("/upload", protect, videoUpload, uploadVideo); // for uploading a video
videoRouter.delete("/delete/:id", protect, deleteVideo); // for deleting the video
videoRouter.get("/tags/top", getTopTags); // for getting the top categories
videoRouter.get("/tags/:tag", getVideosByTag); // for getting videos on the basis of category
videoRouter.put("/:id", protect, editVideo); // for editing video details
videoRouter.put("/:id/view", protect, addView); // for incresing video views

export default videoRouter;

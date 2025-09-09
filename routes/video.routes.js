import express from "express";

import { protect } from "../middlewares/user.middlewares.js";
import { videoUpload } from "../middlewares/upload.js";
import { deleteVideo, editVideo, getAllVideos, getCurrentVideo, uploadVideo } from "../controllers/video.controllers.js";

const videoRouter = express.Router(); //route instance for video

videoRouter.get("/", getAllVideos); //for getting the video collection
videoRouter.get("/:id", getCurrentVideo); // for getting a video by ID
videoRouter.post("/upload", protect, videoUpload, uploadVideo); // for uploading a video
videoRouter.delete("/delete/:id", protect, deleteVideo); // for deleting the video
videoRouter.put("/:id", protect, editVideo); // for editing video details

export default videoRouter;
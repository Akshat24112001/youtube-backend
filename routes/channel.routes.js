import express from "express";

import { protect } from "../middlewares/user.middlewares.js";
import { imageUpload } from "../middlewares/upload.js";

import {
  createChannel,
  getCurrentChannel,
} from "../controllers/channel.controllers.js";

const channelRoutes = express.Router(); // channel route instance

channelRoutes.get("/:id", getCurrentChannel); // route for getting channel with IID
channelRoutes.post("/create", protect, imageUpload, createChannel); // route for creating a channel

export default channelRoutes;

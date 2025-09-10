import express from "express";

import { protect } from "../middlewares/user.middlewares.js";

import {
  addComment,
  deleteComment,
  editComment,
  getAllComments,
} from "../controllers/comment.controllers.js";

const commentRoutes = express.Router(); // route instance for comments

commentRoutes.post("/", protect, addComment); // route for adding a new comment
commentRoutes.get("/", getAllComments); // for getting all comments of a video
commentRoutes.delete("/:id", protect, deleteComment); // for deleting a comment 
commentRoutes.put("/:id", protect, editComment); // for editing a comment

export default commentRoutes;

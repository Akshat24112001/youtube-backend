import express from "express";

import { protect } from "../middlewares/user.middlewares.js";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controllers.js";

const userRoutes = express.Router(); // route instance for user route

userRoutes.get("/", protect, getCurrentUser); // for getting the current logged in user
userRoutes.post("/login", loginUser); // for logging a user
userRoutes.post("/register", registerUser); // for registering a new user
userRoutes.post("/logout", logoutUser); // for logging out a user

export default userRoutes;

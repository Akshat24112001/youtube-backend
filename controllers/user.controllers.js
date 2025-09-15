import userModel from "../models/user.models.js";
import channelModel from "../models/channel.models.js";

import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";

// controller for getting the current user
export const getCurrentUser = (req, res) => {
  // validating of user is present in the protect middleware
  if (!req.user) {
    return res.status(200).json({ user: null });
  }
  // givong response with the user present in the middlware
  return res.status(200).json({ user: req.user });
};

// controller for login user
export const loginUser = async (req, res) => {
  // getting email and password from the request body
  const email = req.body?.email.trim().toLowerCase();
  const password = req.body?.password.trim();

  // in case email or password is absent in the request body
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "email and password both required" });
  }

  try {
    // finding the user in the database with the help of email
    const user = await userModel.findOne({ email });
    // validating if user isfound
    if (!user) {
      return res.status(404).json({ message: "Email not found!!" });
    }
    // validating the password
    const isMatched = await bcrypt.compare(password, user.password);
    //  in case password does not match
    if (!isMatched) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // generating the token with the user id
    const token = generateToken(user._id);
    // setting the token in the cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // conditional rendering for production and development
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // token expires in 7 days
    });
    // initializing value of channel avatar as null
    let channelAvatar = null;
    // in case channel of the user exists
    if (user.channel) {
      // getting channel by user id
      const channel = await channelModel
        .findById(user.channel)
        .select("channelAvatar"); // extracting the channel avatar url
      // in case the channel is found
      if (channel) {
        channelAvatar = channel.channelAvatar;
      }
    }
    // giving a custom response for the user
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      channel: user.channel,
      isChannelCreated: user.isChannelCreated,
      channelAvatar: channelAvatar,
    });
  } catch (error) {
    // in case the login fails
    return res
      .status(500)
      .json({ message: "Login failed!!", error: error.message });
  }
};

//  controller for registering a new user
export const registerUser = async (req, res) => {
  // extracting username,email and password from request body
  const username = req.body.username?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  // validating if username,email or password is present in request body
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  // regex for email eg aayush1006@gmail.com
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // validating email with email regex
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }
  //  regex for password eg.Aayush@123
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  // validation of password with password regex
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include an uppercase letter, a number, and a special character.",
    });
  }

  try {
    // checking if user already exists with the given email
    const existing = await userModel.findOne({ email });
    // in case the email already registered
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }
    // checking if user exists with the username
    const existingUsername = await userModel.findOne({ username });
    // in case the username already exists
    if (existingUsername) {
      return res
        .status(400)
        .json({ message: "Username already exists!! try something else" });
    }
    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // addingthe new user to the database
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });
    // initializing the channel avatar
    let channelAvatar = null;
    // checking if channel exists
    if (newUser.channel) {
      const channel = await channelModel
        .findById(newUser.channel)
        .select("channelAvatar");
      if (channel) {
        channelAvatar = channel.channelAvatar;
      }
    }
    // sending the modified response
    res.status(200).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      channel: newUser.channel,
      isChannelCreated: newUser.isChannelCreated,
      channelAvatar: channelAvatar,
    });
  } catch (error) {
    // in case registration fails
    res
      .status(500)
      .json({ message: "Registration failed!! ", error: error.message });
  }
};

// controller for logout of user
export const logoutUser = (req, res) => {
  // removing token from cookie
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    secure: process.env.NODE_ENV === "production",
  });
// giving a successful logout response
  return res.status(200).json({ message: "Logout successful" });
};

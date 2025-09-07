import jwt from "jsonwebtoken";

import userModel from "../models/user.models.js";

// middleware for authorization
export const protect = async (req, res, next) => {
  // getting token from cookie
  const token = req.cookies.token;
  // in case token is not present
  if (!token) {
    return res.status(401).json({ message: "Not Authorized, no token" });
  }

  try {
    // verifying if token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // modifying the user data by removing password for safty
    req.user = await userModel.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    // in case authorization fails
    return res.status(500).json({ message: "Not authorized, token failed" });
  }
};

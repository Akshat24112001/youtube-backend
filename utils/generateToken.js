import jwt from "jsonwebtoken";

// function for generating a json web token
export const generateToken = (userId) => {
  // creating and returning a new verified token which expies in 7 days
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

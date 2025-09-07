import mongoose from "mongoose";

// user schema
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    isChannelCreated: {
      type: Boolean,
      default: false,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
  },
  { timestamps: true }
);

// user model
const userModel = mongoose.model("User", userSchema);

export default userModel;

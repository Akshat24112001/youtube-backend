import mongoose from "mongoose";

// comment schema
const commentSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// comment model
const commentModel = mongoose.model("Comment", commentSchema);

export default commentModel;

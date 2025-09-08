import mongoose from "mongoose";

// channel schema
const channelSchema = mongoose.Schema(
  {
    channelName: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    channelBanner: {
      type: String,
    },
    channelAvatar: {
      type: String,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

// channel model
const channelModel = mongoose.model("Channel", channelSchema);

export default channelModel;

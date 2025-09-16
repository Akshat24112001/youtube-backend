import mongoose from "mongoose";

import channelModel from "../models/channel.models.js";
import userModel from "../models/user.models.js";

import cloudinary from "../config/cloudinary.js";

// getting channel details
export const getCurrentChannel = async (req, res) => {
  // getting channel id from params
  const { id } = req.params;

  // in case no id is present or it is not a valid ObjectId
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Channel ID" });
  }
  try {
    // getting channel from database
    const channel = await channelModel.findById(id).populate({
      path: "videos",
      select: "title thumbnailUrl duration views createdAt description tags", // also getting required video details
      options: { sort: { createdAt: -1 } }, // sort newest first
    });

    // in case channel is not found
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    // returning modified channel data
    return res.status(200).json({ channel });
  } catch (error) {
    // in case fatching channel is not working
    return res.status(500).json({ message: "Unable to fetch the channel" });
  }
};

// creating a new channel
export const createChannel = async (req, res) => {
  // getting channel name and description from request body
  const channelName = req.body.channelName.trim();
  const description = req.body.description.trim();
  // getting user id from the protect middleware
  const user = req.user;
  // in case user is not present
  if (!user) {
    return res.status(400).json({ message: "Not authorized!! Login first" });
  }
  // in case necessary data is not inserted
  if (!channelName || !description) {
    return res
      .status(400)
      .json({ message: "Channel name and description required!!" });
  }

  try {
    // getting channel from database with channel name
    const uniqueChannel = await channelModel.findOne({ channelName });
    // in case the channel name already exists in the database
    if (uniqueChannel) {
      return res.status(400).json({ message: "Channel name already exists" });
    }
    // initilizing avatar url and banner url
    let avatarUrl = "";
    let bannerUrl = "";

    // in case channel avatar is provided
    if (req.files?.channelAvatar?.[0]) {
      // creating a promise to add the file to the cloudinary
      const avatarResult = await new Promise((resolve, reject) => {
        // creating stream so that we can set the location where video need to be saved
        const stream = cloudinary.uploader.upload_stream(
          { folder: "channel_avatar" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        // sending the video to be saved in the cloud
        stream.end(req.files.channelAvatar[0].buffer);
      });
      // retriving the url of avatar from the promise
      avatarUrl = avatarResult.secure_url;
    }
    // in case channel banner is provided
    if (req.files?.channelBanner?.[0]) {
      // creating a promise to add the file to the cloudinary
      const bannerResult = await new Promise((resolve, reject) => {
        // creating stream so that we can set the location where video need to be saved in the cloud
        const stream = cloudinary.uploader.upload_stream(
          { folder: "channel_banner" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        // sending the video to be saved in the cloud
        stream.end(req.files.channelBanner[0].buffer);
      });
      // retriving the url of banner from the promise
      bannerUrl = bannerResult.secure_url;
    }
    // creating the channel in the database with the details
    const channel = await channelModel.create({
      channelName,
      owner: user._id,
      description,
      channelBanner: bannerUrl,
      channelAvatar: avatarUrl,
    });
    // updating the corresponding user data in the database that channel is created
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        isChannelCreated: true,
        channel: channel._id,
      },
      { new: true }
    );
    // returning the channel in the response
    return res.status(201).json({ channel });
  } catch (error) {
    // in case channel creation fails
    return res
      .status(500)
      .json({ message: "Unable to create channel", error: error.message });
  }
};

// Controller for editing channel
export const editChannel = async (req, res) => {
  try {
    const user = req.user; // comes from protect middleware
    if (!user || !user.isChannelCreated) {
      return res
        .status(403)
        .json({ message: "You don't have a channel to edit" });
    }

    // get existing channel
    const channel = await channelModel.findById(user.channel);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // fields to update
    const updates = {};
    const userUpdates = {}; // for user model
    if (req.body.channelName) {
      const newName = req.body.channelName.trim();
      if (!newName) {
        return res.status(400).json({ message: "Channel name cannot be empty" });
      }
      // check uniqueness if changed
      if (newName !== channel.channelName) {
        const exists = await channelModel.findOne({ channelName: newName });
        if (exists) {
          return res.status(400).json({ message: "Channel name already exists" });
        }
      }
      updates.channelName = newName;
    }

    if (req.body.description) {
      updates.description = req.body.description.trim();
    }

    // handle avatar upload
    if (req.files?.channelAvatar?.[0]) {
      const avatarResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "channel_avatar" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(req.files.channelAvatar[0].buffer);
      });
      updates.channelAvatar = avatarResult.secure_url;
      userUpdates.channelAvatar = avatarResult.secure_url;
    }

    // handle banner upload
    if (req.files?.channelBanner?.[0]) {
      const bannerResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "channel_banner" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(req.files.channelBanner[0].buffer);
      });
      updates.channelBanner = bannerResult.secure_url;
    }

    // apply updates
    const updatedChannel = await channelModel.findByIdAndUpdate(
      channel._id,
      { $set: updates },
      { new: true }
    );

    // update user with new channel info
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { $set: userUpdates },
      { new: true }
    ).select("-password");


    return res.status(200).json({
      message: "Channel updated successfully",
      channel: updatedChannel,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to update channel",
      error: error.message,
    });
  }
};

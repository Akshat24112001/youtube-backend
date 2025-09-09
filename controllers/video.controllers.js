import mongoose from "mongoose";

import videoModel from "../models/video.models.js";
import channelModel from "../models/channel.models.js";

import cloudinary from "../config/cloudinary.js";

// function for geting public id of the video from the url
const getPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const fileWithExtention = parts[parts.length - 1];
  const [publicId] = fileWithExtention.split(".");
  return publicId;
};

// controller for uploading a video
export const uploadVideo = async (req, res) => {
  // in case no file is present in the request body
  if (!req.file) {
    return res.status(400).json({ message: "No Video Uploaded" });
  }
  // array of allowed file type
  const allowedMimeTypes = [
    "video/mp4",
    "video/quicktime",
    "video/x-m4v",
    "video/webm",
  ];

  // validating if the video type matches
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res
      .status(400)
      .json({ message: "Invalid file type. Only mp4, mov, webm are allowed." });
  }

  // getting title and description from the request body
  const title = req.body.title?.trim();
  const description = req.body.description?.trim();
  // getting user id and channel id from protect middleware
  const uploader = req.user._id;
  const channelId = req.user.channel;

  // initializing the tags array
  let tags = [];
  // in case tags are provided
  if (req.body.tags) {
    if (Array.isArray(req.body.tags)) {
      // in case the tags are array in the request body eg. ["tag1","tag2"]
      tags = req.body.tags.slice(0, 2).map((t) => t.trim());
    } else if (typeof req.body.tags === "string") {
      // in case the request gets tags in the for mof string "dogs,green"
      tags = req.body.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 2);
    }
  }
  //  checking if user is authorized
  if (!uploader) {
    return res.status(400).json({ message: "No authorized user" });
  }
  // checking if channel is present
  if (!channelId) {
    return res.status(400).json({ message: "No channel found" });
  }
  // validating the existance of title and description of video
  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }

  try {
    // uploading video to cloudinary storage
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "videos", //folder destination
        eager: [
          // specifications of the thumbnail
          {
            width: 300,
            height: 200,
            crop: "thumb", // cropping mode thumbnail in this case
            start_offset: "3", // takes frame at 3 sec
            format: "jpg", // format of thumbnail
          },
        ],
        eager_async: false, // eager synchronously
      },
      async (error, result) => {
        //handling error for video upload
        if (error) {
          return res
            .status(500)
            .json({ message: error.message || "Cloudinary Upload Failed" });
        }
        // getting the video url to be stored
        const videoUrl = result.secure_url;
        // getting the thumbnail url
        const thumbnailUrl = result.eager?.[0]?.secure_url || "";
        //  video data to be set in the database
        const video = await videoModel.create({
          title,
          description,
          uploader,
          channelId,
          videoUrl,
          thumbnailUrl,
          duration: result.duration?.toString() || "",
          tags,
        });
        // setting updates in channel model
        await channelModel.findByIdAndUpdate(
          channelId,
          { $push: { videos: video._id } },
          { new: true }
        );

        return res.status(201).json({ video });
      }
    );
    // uploading the video here and call the function
    uploadStream.end(req.file.buffer);
  } catch (error) {
    // in case video upload fails
    return res
      .status(500)
      .json({ message: "Uplaod Failed!!", error: error.message });
  }
};

// controller for getting all the video collection
export const getAllVideos = async (req, res) => {
  try {
    // getting videos from the videos collection
    const videos = await videoModel
      .find()
      .sort({ createdAt: -1 }) // arranging from recent
      .populate("channelId", "channelName channelAvatar"); // populating with channel name and channel avatar
    // returning the response with the array of videos data
    return res.status(200).json(videos);
  } catch (error) {
    // in case fecting of videos fail
    return res
      .status(500)
      .json({ message: "unable to fetch videos", error: error.message });
  }
};

// extracting a video data with video ID
export const getCurrentVideo = async (req, res) => {
  // getting video id from the url
  const videoId = req.params.id;
  // checking if video id is a valid Object ID
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json({ message: "Invalid video ID format" });
  }

  try {
    // getting video data from the database with the video ID
    const currentVideo = await videoModel
      .findById(videoId)
      .populate("channelId", "channelName channelAvatar"); // populating with channel name andchannel avatar
    // in case video is not found
    if (!currentVideo) {
      return res.status(404).json({ message: "Unable to find the video" });
    }

    return res.status(200).json(currentVideo);
  } catch (error) {
    // in case there is an error while extracting the video
    return res
      .status(500)
      .json({ message: "Unable to fetch video", error: error.message });
  }
};
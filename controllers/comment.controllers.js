import commentModel from "../models/comment.models.js";

// controller for adding comment to the video
export const addComment = async (req, res) => {
  // accepting videoId as a query in the url
  const { videoId } = req.query;
  // getting user from the protect middleware
  const user = req.user;
  // getting the text of the comment from the request body
  const text = req.body?.text?.trim();
  // in case the video id is not given
  if (!videoId) {
    return res.status(400).json({ message: "Invalid video ID" });
  }
  // in case the user is not present
  if (!user) {
    return res.status(400).json({ message: "Unauthorized!! login required" });
  }
  // in case the text is not provided in the request body
  if (!text) {
    return res.status(400).json({ message: "Text field is required" });
  }

  try {
    // adding comment to the database
    const newComment = await commentModel.create({
      videoId,
      user: user._id,
      text,
    });
    // populating comment with username, avatar and channel name
    const populatedComment = await newComment.populate({
      path: "user",
      select: "username channel", //populating with username and channelid
      populate: {
        path: "channel",
        select: "channelAvatar channelName", // getting channel avatar and channel name from channel id
      },
    });
    // sending response with the required populated properties
    return res.status(201).json({ newComment: populatedComment });
  } catch (error) {
    // in case something goes wrong while adding the comment to the database
    return res
      .status(500)
      .json({ message: "Unable to add the comment", error: error.message });
  }
};

// controller for getting all the comments of a video
export const getAllComments = async (req, res) => {
  // getting video id from the query
  const { videoId } = req.query;
  // in case the videoId is there
  if (!videoId) {
    return res.status(400).json({ message: "Video ID not found" });
  }

  try {
    // getting all the comments from the database which have the matching video id
    const comments = await commentModel
      .find({ videoId })
      .populate({
        // populating the required data from the connecting collection
        path: "user",
        select: "username channel", // getting username and channel id
        populate: {
          path: "channel",
          select: "channelAvatar channelName", // getting channel avatar and channel name
        },
      })
      .sort({ createdAt: -1 });
    // givong response of all the comments of the video
    return res.status(200).json({ comments });
  } catch (error) {
    // in case there is an error fetching all the comments
    return res
      .status(500)
      .json({ message: "Unable to fetch the comments", error: error.message });
  }
};

// controller for deleting the comment from the database
export const deleteComment = async (req, res) => {
  // getting comment id from the url
  const { id } = req.params;
  // in case comment id is not present
  if (!id) {
    return res.status(400).json({ message: "Invalid Comment ID" });
  }
  try {
    // deleting id from the comments collection corresponding to the id
    const deleted = await commentModel.findByIdAndDelete(id);
    // in case comment id is not matching with an comment id in database
    if (!deleted) {
      return res.status(404).json({ message: "Unable to find the comment" });
    }
    // giving response of sucesful deletion
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    // in case we run into error while deleting the comment
    return res
      .status(500)
      .json({ message: "Unable to delete the comment", error: error.message });
  }
};

// controller for editing comment text
export const editComment = async (req, res) => {
  // getting comment id from the params
  const { id } = req.params;
  // getting edited text from the request body
  const { text } = req.body;
  // getting user from the protect middleware
  const userId = req.user._id;

  // Validating comment id
  if (!id) {
    return res.status(400).json({ message: "Comment ID is required" });
  }
  // checking if text is present and is not empty
  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Text field is required" });
  }

  try {
    // finding the comment in the database
    const comment = await commentModel.findById(id);
    // validating if comment id exists in database
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // checking if user is is same as the owner's id
    if (comment.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this comment" });
    }

    // Update entire comment text
    comment.text = text.trim();
    // saving the changes to the database
    await comment.save();
    // populating necessary data to the response
    await comment.populate({
      path: "user",
      select: "username channel",
      populate: {
        path: "channel",
        select: "channelAvatar channelName",
      },
    });
    // returning the comment and appropriate messsage
    return res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    // in case we are unable to edit the comment
    return res.status(500).json({
      message: "Unable to update the comment",
      error: error.message,
    });
  }
};

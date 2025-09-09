import multer from "multer";

// Required for Cloudinary stream upload
const storage = multer.memoryStorage();

// Video Upload
// for checking the type of file to be uploaded
const fileFilter = (req, file, cb) => {
  // types of files that are allowed
  const allowedTypes = ["video/mp4", "video/mov", "video/quicktime"];
  // verifing the video type
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only MP4/MOV allowed."), false);
  }
};

// sending the video for upload
const videoUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit
}).single("video"); // name of the file

export { videoUpload };
// Image Upload

// for checking the type of images
const imageFileFilter = (req, file, cb) => {
  // allowed types of images
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  // validating the type of image
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid image file type. Only JPEG/JPG/PNG/WEBP allowed."));
  }
};
// sending the image for upload
const imageUploadConfig = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
}).fields([
  { name: "channelAvatar", maxCount: 1 },
  { name: "channelBanner", maxCount: 1 },
]);

// function for managin in case the file size is more that suggested
export const imageUpload = (req, res, next) => {
  imageUploadConfig(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(413)
          .json({ message: "File size should not exceed 5MB" });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: "Upload failed: " + err.message });
    }
    next();
  });
};


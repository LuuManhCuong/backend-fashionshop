const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "djcamu6kz",
  api_key: "924873611496483",
  api_secret: "inV7hfuYD-jgWqhRCwCf90Se3Vo",
});

module.exports = cloudinary;

// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");

// cloudinary.config({
//   cloud_name: "djcamu6kz",
//   api_key: "924873611496483",
//   api_secret: "inV7hfuYD-jgWqhRCwCf90Se3Vo",
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   allowedFormats: ["jpg", "png"],
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const uploadCloud = multer({ storage });

// module.exports = uploadCloud;

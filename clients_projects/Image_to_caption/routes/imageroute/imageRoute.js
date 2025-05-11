const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  uploadImage,
} = require("../../controller/imgcontroller/imageController");

const router = express.Router();

console.log("entered routes");

router.use((req, res, next) => {
  console.log("🔹 Incoming Request Received");
  console.log("🔹 Headers:", req.headers);
  console.log("🔹 Content-Type:", req.headers["content-type"]);
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../public/img/");
    console.log("🔹 Multer Destination Path:", uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileName =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);
    console.log("🔹 Multer Generated Filename:", fileName);
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file) {
      console.log("❌ No file detected in Multer");
      return cb(new Error("No file uploaded"));
    }
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      return cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"));
    }
  },
});

router.post(
  "/upload",
  upload.single("image"),
  (req, res, next) => {
    console.log("✅ Multer Middleware Executed");
    console.log("✅ Uploaded File Data:", req.file);
    next();
  },
  uploadImage
);

module.exports = router;

const {
  processImageAndGenerateCaption,
} = require("../../services/imgservice/imageService");

exports.uploadImage = async (req, res) => {
  try {
    console.log("in controller: 1");
    const caption = await processImageAndGenerateCaption(req.file.path);
    res.json({ caption });
  } catch (error) {
    console.error("Error in Controller:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
};

console.log("entered controllers");
/*exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      console.log("❌ No file received by Multer");
      return res
        .status(400)
        .json({ error: "No file uploaded. Please attach an image." });
    }

    console.log("✅ File successfully received:", req.file);
    console.log("🔹 File Path:", req.file.path);

    res.json({
      message: "Image uploaded successfully!",
      filePath: `/public/img/${req.file.filename}`,
    });
  } catch (error) {
    console.error("❌ Error in uploadImage:", error);
    res.status(500).json({ error: "Failed to upload image." });
  }
};*/

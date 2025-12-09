import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure uploads folder exists
const uploadFolder = "uploads";
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // add timestamp
  }
});

const upload = multer({ storage });

// Upload route
router.post("/", upload.single("image"), (req, res) => {
  res.json({
    success: true,
    imageUrl: `/uploads/${req.file.filename}`
  });
});

export default router;

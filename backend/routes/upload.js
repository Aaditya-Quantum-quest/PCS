// // routes/upload.js
// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const auth = require('../middleware/auth');

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => {
//     const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// router.post('/', auth, upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file uploaded' });
//   }
//   const imageUrl = `/uploads/${req.file.filename}`; // URL to store in Order.items[].imageUrl   
//   res.json({ imageUrl });
// });

// module.exports = router;



// routes/upload.js
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const router = express.Router();

// ✅ KEEP: Multer memory storage for base64 conversion
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// ✅ NEW: MongoDB Schema for storing uploaded images
const uploadedImageSchema = new mongoose.Schema({
  imageData: { type: String, required: true }, // Base64 string
  mimetype: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now },
  originalName: { type: String }
});

const UploadedImage = mongoose.model('UploadedImage', uploadedImageSchema);

// ✅ MODIFIED: Upload route - converts to base64
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    // Extract userId from token if authenticated
    let userId = null;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id || decoded.userId;
      } catch (err) {
        console.log('Token verification failed, proceeding as guest');
      }
    }

    // Save to database for record keeping
    const savedImage = await UploadedImage.create({
      imageData: base64Image,
      mimetype: req.file.mimetype,
      userId: userId,
      originalName: req.file.originalname
    });

    // Return the base64 data URL (this is what gets stored in orders)
    res.json({ 
      imageUrl, // ✅ This is the base64 string that will be stored
      imageId: savedImage._id // For future reference if needed
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Upload failed', 
      error: error.message 
    });
  }
});

// ✅ NEW: Optional route to retrieve image by ID
router.get('/:id', async (req, res) => {
  try {
    const image = await UploadedImage.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const imageUrl = `data:${image.mimetype};base64,${image.imageData}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve image' });
  }
});

module.exports = router;

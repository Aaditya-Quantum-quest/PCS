// routes/publicGalleryRoutes.js
const express = require('express');
const router = express.Router();
const GalleryImage = require('../models/GalleryImage');

router.get('/', async (req, res) => {
  const images = await GalleryImage.find().sort({ createdAt: -1 });
  res.json(images);
});

module.exports = router;
  
// models/GalleryImage.js
const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },

        imageUrl: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);

module.exports = GalleryImage;
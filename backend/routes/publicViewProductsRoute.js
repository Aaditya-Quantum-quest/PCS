const express = require('express')
const router = express.Router();

const Product = require('../models/Product');

// router.get('/', async (req, res) => {
//     const products = await AllProduct.find().sort({ createdAt: -1 })
//     res.json(products);
// });

// module.exports = router;

router.get('/', async (req, res) => {
    try {
        // GET /api/products?category=Wall%20Clock
        const { category } = req.query;

        const filter = {};
        if (category) {
            filter.category = category;   // exact match; use regex if you want partial
        }

        const products = await Product
            .find(filter)
            .sort({ price: 1 }) // 1 = ascending, -1 = descending
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch Products" });
    }
})

module.exports = router;
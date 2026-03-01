const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const product = require('../models/Product')

router.get('/products/:id', async (req, res) => {
    try {
        const Product = await product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(Product);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get product', error: err.message });
    }
});

module.exports = router;
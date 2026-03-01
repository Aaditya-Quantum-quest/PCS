// routes/checkoutAddressRoutes.js
const express = require('express');
const router = express.Router();
const CheckoutAddress = require('../models/Address');
const auth = require('../middleware/auth'); 

// @route   POST /api/save-address
// @desc    Save customer shipping address during checkout
router.post('/save-address', auth, async (req, res) => {
  try {
    const {
      email,
      phone,
      firstName,
      lastName,
      address,
      area,
      pincode,
      city,
      state,
      orderId, // Optional from frontend
    } = req.body;

    const doc = await CheckoutAddress.create({
      email,
      phone,
      firstName,
      lastName,
      address,
      area,
      pincode,
      city,
      state,
      orderId: orderId || `ORD-${Date.now()}`,
      user: req.user ? req.user.id : undefined,
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({
      message: 'Failed to save address',
      error: err.message,
    });
  }
});

// @route   GET /api/address/:orderId
// @desc    Fetch address details using a specific orderId string
router.get('/address/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Find the address matching the specific orderId string (e.g., ORD-1767...)
    const addressDoc = await CheckoutAddress.findOne({ orderId: orderId });

    if (!addressDoc) {
      return res.status(404).json({ 
        message: 'Address not found for this order ID' 
      });
    }

    res.json(addressDoc);
  } catch (err) {
    res.status(500).json({
      message: 'Server error while fetching address',
      error: err.message,
    });
  }
});

module.exports = router;

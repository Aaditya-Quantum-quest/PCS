const express = require('express');
const router = express.Router();
const NameplateOrder = require('../models/NameplateOrder');
const jwt = require('jsonwebtoken');
const { sendOrderConfirmation } = require('../utils/mailer');
const { sendNameplateStatusEmail } = require('../utils/nameplateMailer');
const { sendNameplateAdminNotification } = require('../utils/nameplateAdminNotification');

// ✅ POST - Create new nameplate order
router.post('/', async (req, res) => {
  try {
    console.log('📦 Received nameplate order from frontend');
    console.log('Order data:', req.body);

    const orderData = req.body;

    // Validate required fields
    if (!orderData.design || !orderData.size || !orderData.customer || !orderData.shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create order in MongoDB
    const order = await NameplateOrder.create(orderData);
    console.log('✅ Order saved to database:', order._id);

    // Send confirmation email to customer
    await sendOrderConfirmation(order);
    
    // Send notification to admin
    await sendNameplateAdminNotification(order);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        orderId: order.orderId,
        _id: order._id,
        total: order.pricing.total
      }
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// ✅ GET - Fetch user's nameplate orders (AUTHENTICATED)
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Fetching user nameplate orders');

    // ✅ Check Authorization header first, then fall back to cookie
    let token = req.headers.authorization?.split(' ')[1];
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = decoded.email;

    const orders = await NameplateOrder.find({ 'customer.email': userEmail })
      .sort({ createdAt: -1 })
      .limit(100);

    console.log(`✅ Found ${orders.length} nameplate orders for ${userEmail}`);

    res.json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error('❌ Error fetching nameplate orders:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// ✅ GET - Fetch single order by MongoDB ID
router.get('/:id', async (req, res) => {
  try {
    const order = await NameplateOrder.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// ✅ PATCH - Update order status
router.patch('/:id', async (req, res) => {
  try {
    const { status, paymentStatus, trackingNumber, estimatedDelivery } = req.body;
    
    const updateData = {};
    if (status) {
      updateData.status = status;
      if (status === 'shipped') updateData['shipping.shippedAt'] = new Date();
      if (status === 'delivered') updateData['shipping.deliveredAt'] = new Date();
    }
    if (paymentStatus) updateData['payment.status'] = paymentStatus;
    if (trackingNumber) updateData['shipping.trackingNumber'] = trackingNumber;
    if (estimatedDelivery) updateData['shipping.estimatedDelivery'] = estimatedDelivery;

    const order = await NameplateOrder.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Send status update email
    if (status && order.customer?.email) {
      try {
        await sendNameplateStatusEmail(order.customer.email, status, order);
        console.log(`✅ Status email sent to ${order.customer.email}`);
      } catch (emailError) {
        console.error('❌ Email failed:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      order
    });

  } catch (error) {
    console.error('❌ Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order'
    });
  }
});

module.exports = router;

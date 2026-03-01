const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const CheckoutAddress = require('../models/Address');
const fast2sms = require('fast2sms');
const auth = require('../middleware/auth');
const { sendFrameOrderEmail } = require('../utils/frameMailer'); // ✅ YOUR BEAUTIFUL EMAILS
const { sendRazorpaySuccessEmails } = require('../utils/razorpayMailer'); // ✅ RAZORPAY PAYMENT EMAILS

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ========================================
// // 1️⃣ BASIC ORDER ROUTE (COD)
// router.post('/', auth, async (req, res) => {
//   try {
//     const {
//       items,
//       totalAmount,
//       paymentMethod = 'COD',
//       customer = {
//         email: 'customer@example.com',
//         phone: '0000000000',
//         firstName: 'Customer',
//         lastName: ''
//       }
//     } = req.body;

//     if (!items?.length) {
//       return res.status(400).json({ message: 'No items in order' });
//     }

//     const orderId = `ORD-${Date.now()}`;

//     const order = await Order.create({
//       orderId,
//       user: req.user.id,
//       items: items.map((i) => ({
//         product: i.productId,
//         quantity: i.quantity,
//         size: i.size,
//         frameColor: i.frameColor,
//         frameMaterial: i.frameMaterial,
//         frameThickness: i.frameThickness,
//         orientation: i.orientation,
//         imageUrl: i.imageUrl,
//         price: i.price,
//       })),
//       totalAmount,
//       paymentMethod,
//       paymentStatus: 'pending',
//       status: 'pending',
//     });

//     // ✅ SEND BEAUTIFUL EMAILS (NON-BLOCKING)
//     (async () => {
//       try {
//         await sendFrameOrderEmail(order.toObject(), customer);
//         console.log('✅ Detailed frame emails sent!');
//       } catch (emailError) {
//         console.error('⚠️ Email failed (non-blocking):', emailError.message);
//       }
//     })();

//     // ✅ SMS
//     if (process.env.FAST2SMS_API_KEY && customer.phone) {
//       (async () => {
//         try {
//           await fast2sms.sendMessage({
//             authorization: process.env.FAST2SMS_API_KEY,
//             message: `🖼️ Prem Color Studio Order #${orderId} received! Total: ₹${totalAmount.toLocaleString()}. We'll call soon!`,
//             numbers: [customer.phone],
//           });
//           console.log('✅ SMS sent');
//         } catch (smsError) {
//           console.error('⚠️ SMS failed:', smsError.message);
//         }
//       })();
//     }

//     res.status(201).json({
//       success: true,
//       orderId,
//       orderId: order._id,
//       message: 'Order created successfully!'
//     });

//   } catch (error) {
//     console.error('❌ Order error:', error);
//     res.status(500).json({ message: 'Failed to create order', error: error.message });
//   }
// });


// 1️⃣ BASIC ORDER ROUTE (COD)
router.post('/', auth, async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      paymentMethod = 'COD',
      customer = {
        email: 'customer@example.com',
        phone: '0000000000',
        firstName: 'Customer',
        lastName: ''
      }
    } = req.body;

    // ✅ Validation
    if (!items?.length) {
      return res.status(400).json({ message: 'No items in order' });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid total amount' });
    }

    // ✅ Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // ✅ Create order
    const order = await Order.create({
      orderId,
      user: req.user.id,
      items: items.map((i) => ({
        product: i.productId || null,
        quantity: i.quantity || 1,
        size: i.size || '5x7',
        frameColor: i.frameColor || 'black',
        frameMaterial: i.frameMaterial || 'wood',
        frameThickness: i.frameThickness || 20,
        orientation: i.orientation || 'portrait',
        imageUrl: i.imageUrl || i.uploadedImageUrl || '', // ✅ Handle both field names
        price: i.price || 0,
      })),
      totalAmount,
      paymentMethod,
      paymentStatus: 'pending',
      status: 'pending',
    });

    // ✅ SEND BEAUTIFUL EMAILS (NON-BLOCKING)
    setImmediate(async () => {
      try {
        // Only send email if sendFrameOrderEmail function exists
        if (typeof sendFrameOrderEmail === 'function') {
          await sendFrameOrderEmail(order.toObject(), customer);
          console.log('✅ Detailed frame emails sent!');
        }
      } catch (emailError) {
        console.error('⚠️ Email failed (non-blocking):', emailError.message);
      }
    });

    // ✅ SEND SMS (NON-BLOCKING)
    if (process.env.FAST2SMS_API_KEY && customer.phone && customer.phone !== '0000000000') {
      setImmediate(async () => {
        try {
          const fast2sms = require('fast-two-sms'); // Import here if not at top
          await fast2sms.sendMessage({
            authorization: process.env.FAST2SMS_API_KEY,
            message: `🖼️ Prem Color Studio Order #${orderId} received! Total: ₹${totalAmount.toLocaleString('en-IN')}. We'll call soon!`,
            numbers: [customer.phone],
          });
          console.log('✅ SMS sent to:', customer.phone);
        } catch (smsError) {
          console.error('⚠️ SMS failed (non-blocking):', smsError.message);
        }
      });
    }

    // ✅ Return success response (FIXED: removed duplicate orderId)
    res.status(201).json({
      success: true,
      orderId: order._id, // MongoDB _id
      orderNumber: orderId, // Human-readable order number (ORD-xxx)
      message: 'Order created successfully!',
      order: {
        _id: order._id,
        orderId: orderId,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Order creation error:', error);

    // ✅ Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Duplicate order ID. Please try again.'
      });
    }

    res.status(500).json({
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// ========================================
// 2️⃣ RAZORPAY ORDER CREATION
router.post('/razorpay/order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, cartItems, customerData } = req.body;

    console.log('📦 Razorpay request:', { amount, items: cartItems?.length });

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!cartItems?.length) {
      return res.status(400).json({ error: 'Empty cart' });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        itemCount: cartItems.length,
        email: customerData?.email || '',
      },
    });

    console.log('✅ Razorpay order:', razorpayOrder.id);
    res.json(razorpayOrder);

  } catch (error) {
    console.error('❌ Razorpay error:', error);
    res.status(500).json({
      error: error.error?.description || error.message || 'Payment failed'
    });
  }
});

// ========================================
// 3️⃣ RAZORPAY PAYMENT VERIFY
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      cartItems,
      totalAmount
    } = req.body;

    console.log('🔐 Verifying payment:', { orderId: razorpay_order_id, paymentId: razorpay_payment_id });

    // 1️⃣ VERIFY SIGNATURE
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
      console.error('❌ Invalid signature');
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    console.log('✅ Signature verified');

    // 2️⃣ SAVE ADDRESS
    const address = new CheckoutAddress({
      email: customer.email,
      phone: customer.phone,
      firstName: customer.firstName,
      lastName: customer.lastName,
      address: customer.address,
      area: customer.area,
      pincode: customer.pincode,
      city: customer.city,
      state: customer.state,
    });
    await address.save();

    // 3️⃣ CREATE ORDER ITEMS
    const orderItems = cartItems.map(item => ({
      product: item.productId || item._id || new mongoose.Types.ObjectId(),
      quantity: item.quantity || 1,
      size: item.size || item.selectedSize || '5x7',
      frameColor: item.frameColor || 'black',
      frameMaterial: item.frameMaterial || 'acrylic',
      frameThickness: parseInt(item.frameThickness || item.selectedThickness || item.thicknessMm) || 20,
      orientation: item.orientation || 'portrait',
      imageUrl: item.uploadedImageUrl || item.imageUrl || item.imageUri,
      price: item.price,
    }));

    // 4️⃣ CREATE ORDER
    const orderId = `ORD-${Date.now()}`;
    const order = await Order.create({
      orderId,
      items: orderItems,
      totalAmount: totalAmount / 100, // paise to rupees
      paymentMethod: 'CARD',
      paymentStatus: 'paid',
      status: 'processing', // ✅ Changed from invalid 'confirmed' to 'processing'
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    // 5️⃣ LINK ADDRESS
    address.orderId = orderId;
    await address.save();

    // 6️⃣ SEND RAZORPAY PAYMENT SUCCESS EMAILS (customer + admin)
    console.log('📧 About to send emails to:', customer?.email, '| Admin:', process.env.ADMIN_EMAIL || process.env.EMAIL_USER);
    (async () => {
      try {
        await sendRazorpaySuccessEmails(
          order.toObject(),
          customer,
          {
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
          }
        );
        console.log('✅ Razorpay payment emails sent to customer & admin!');
      } catch (emailError) {
        console.error('⚠️ Razorpay email FAILED:', emailError.message);
        console.error('Stack:', emailError.stack);
      }
    })();

    // 7️⃣ SMS
    if (process.env.FAST2SMS_API_KEY && customer.phone) {
      (async () => {
        try {
          await fast2sms.sendMessage({
            authorization: process.env.FAST2SMS_API_KEY,
            message: `🖼️ Prem Color Studio Order #${orderId} PAID! Total: ₹${(totalAmount / 100).toLocaleString()}. Thank you!`,
            numbers: [customer.phone],
          });
          console.log('✅ SMS sent');
        } catch (smsError) {
          console.error('⚠️ SMS failed:', smsError.message);
        }
      })();
    }

    res.json({
      success: true,
      orderId,
      dbOrderId: order._id,
      message: 'Payment successful! Order confirmed.'
    });

  } catch (error) {
    console.error('❌ Verify error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================================
// 4️⃣ DIRECT ORDER (GUEST/AUTH)
router.post('/direct', auth, async (req, res) => {
  try {
    const { customer, cartItems, totalAmount, paymentMethod = 'COD' } = req.body;

    if (!cartItems?.length || !customer?.email || !customer?.phone) {
      return res.status(400).json({ error: 'Missing cart items or customer details' });
    }

    const orderId = `ORD-${Date.now()}`;
    const orderItems = cartItems.map(item => ({
      product: item.productId || item._id || new mongoose.Types.ObjectId(),
      quantity: item.quantity || 1,
      size: item.size || item.selectedSize || '5x7',
      frameColor: item.frameColor || 'black',
      frameMaterial: item.frameMaterial || 'acrylic',
      frameThickness: parseInt(item.frameThickness || item.selectedThickness || item.thicknessMm) || 20,
      orientation: item.orientation || 'portrait',
      imageUrl: item.uploadedImageUrl || item.imageUrl || item.imageUri,
      price: item.price,
    }));

    const order = await Order.create({
      orderId,
      user: req.user.id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus: 'pending',
      status: 'pending',
    });

    // SAVE ADDRESS
    const address = new CheckoutAddress({
      ...customer,
      orderId,
      user: req.user.id,
    });
    await address.save();

    // ✅ SEND BEAUTIFUL EMAILS
    (async () => {
      try {
        await sendFrameOrderEmail(order.toObject(), customer);
        console.log('✅ Detailed frame emails sent!');
      } catch (emailError) {
        console.error('⚠️ Email failed:', emailError.message);
      }
    })();

    // ✅ SMS
    if (process.env.FAST2SMS_API_KEY && customer.phone) {
      (async () => {
        try {
          await fast2sms.sendMessage({
            authorization: process.env.FAST2SMS_API_KEY,
            message: `🖼️ Prem Color Studio Order #${orderId} received! Total: ₹${totalAmount.toLocaleString()}. We'll call soon!`,
            numbers: [customer.phone],
          });
          console.log('✅ SMS sent');
        } catch (smsError) {
          console.error('⚠️ SMS failed:', smsError.message);
        }
      })();
    }

    res.json({
      success: true,
      orderId,
      dbOrderId: order._id,
      message: 'Order placed successfully!'
    });

  } catch (error) {
    console.error('❌ Direct order error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

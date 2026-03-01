const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Address = require('../models/Address');
const auth = require('../middleware/auth');
const NameplateOrder = require('../models/NameplateOrder');
const { sendOrderCancellationEmails } = require('../utils/cancelOrderMailer'); // ✅ Cancel emails


// 1. USER PROFILE - Fixed for current logged-in user
router.get('/users/:userId', auth, async (req, res) => {
  console.log('🔍 /users/:userId - req.user:', req.user?.id, 'params.userId:', req.params.userId);

  try {
    const userId = req.user.id;  // Use ONLY req.user.id (current logged-in user)
    if (!userId) return res.status(401).json({ message: 'Invalid user in token' });

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log('✅ User found:', user._id);
    res.json(user);
  } catch (error) {
    console.error('❌ Profile error:', error);
    res.status(500).json({ message: 'Profile error' });
  }
});

// 2. ORDERS LIST - Only CURRENT user's orders
router.get('/orders/user/:userId', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.params.userId;

    console.log('🔍 Orders for logged-in user:', userId);

    const orders = await Order.find({
      $or: [
        { user: userId },
        { 'user._id': userId },
        { userId: userId },
        { email: req.user.email }
      ],
      hiddenByUser: { $ne: true }, // ✅ Filter out user-hidden (removed) orders
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    console.log(`✅ Current user orders: ${orders.length}`);
    res.json(orders);
  } catch (error) {
    console.error('Orders error:', error.message);
    res.json([]);
  }
});

// 3. ADDRESSES LIST - Only CURRENT user's addresses
router.get('/addresses/user/:userId', auth, async (req, res) => {
  try {
    const userId = req.user.id || req.params.userId;

    console.log('🔍 Addresses for logged-in user:', userId);

    const addresses = await Address.find({
      $or: [
        { user: userId },
        { 'user._id': userId },
        { userId: userId },
        { email: req.user.email }
      ]
    }).sort({ createdAt: -1 });

    console.log(`✅ Current user addresses: ${addresses.length}`);
    res.json(addresses);
  } catch (error) {
    console.error('Addresses error:', error.message);
    res.json([]);
  }
});

// 4. SINGLE ORDER DETAIL - Owner verification
router.get('/dashboard/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('user', 'name email phone');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Verify user owns order
    if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const address = await Address.findOne({
      $or: [{ orderId: order.orderId }, { order: order._id }]
    });

    res.json({
      order: {
        ...order._doc,
        userName: order.user.name,
        userEmail: order.user.email
      },
      address: address || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Order detail error' });
  }
});



// router.get('/user/orders/nameplates/user', auth, async (req, res) => {
//   try {
//     const email = req.user.email.toLowerCase();

//     console.log('🔍 Nameplate orders for:', email);

//     const orders = await NameplateOrder.find({
//       'customer.email': email
//     })
//       .sort({ createdAt: -1 });

//     console.log(`✅ Nameplate orders found: ${orders.length}`);
//     res.status(200).json(orders);
//   } catch (error) {
//     console.error('❌ Nameplate orders error:', error);
//     res.status(500).json([]);
//   }
// });

router.get('/dashboard/users/:id', auth, async (req, res) => {
  try {
    // Verify user is accessing their own data
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
});

// GET user orders with full details
router.get('/dashboard/orders/user/:userId', auth, async (req, res) => {
  try {
    // Verify user is accessing their own data
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find({ user: req.params.userId, hiddenByUser: { $ne: true } })
      .populate('items.product', 'title price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

// GET user addresses
router.get('/dashboard/addresses/user/:userId', auth, async (req, res) => {
  try {
    // Verify user is accessing their own data
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const addresses = await CheckoutAddress.find({ user: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch addresses', error: err.message });
  }
});

// GET nameplate orders for user
router.get('/dashboard', auth, async (req, res) => {
  try {
    const NameplateOrders = require('../models/NameplateOrder');

    const orders = await NameplateOrders.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch nameplate orders',
      error: err.message
    });
  }
});

router.patch('/orders/:orderId/cancel', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log('🚫 Cancel request for order:', orderId, 'by user:', req.user.id);

    const order = await Order.findOne({ _id: orderId, user: req.user.id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({ message: `Cannot cancel order with status: ${order.status}` });
    }

    order.status = 'cancelled';
    order.paymentStatus = 'cancelled';
    await order.save();

    console.log('✅ Order cancelled:', orderId);

    // ✅ Fetch user profile for email + phone
    setImmediate(async () => {
      try {
        const user = await User.findById(req.user.id).select('name email phone');
        if (user) {
          const [firstName, ...rest] = (user.name || 'Customer').split(' ');
          await sendOrderCancellationEmails(
            order.toObject(),
            {
              firstName,
              lastName: rest.join(' '),
              email: user.email,
              phone: user.phone || 'N/A',
              name: user.name,
            }
          );
          console.log('✅ Cancellation emails sent for order:', orderId);
        }
      } catch (emailErr) {
        console.error('⚠️ Cancellation email failed (non-blocking):', emailErr.message);
      }
    });

    res.json({ message: 'Order cancelled successfully', order });

  } catch (error) {
    console.error('❌ Cancel order error:', error);
    res.status(500).json({ message: 'Failed to cancel order', error: error.message });
  }
});

// ✅ HIDE (remove) a cancelled order from user’s dashboard view
router.patch('/orders/:orderId/hide', auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: req.user.id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or unauthorized' });
    }

    if (order.status !== 'cancelled') {
      return res.status(400).json({ message: 'Only cancelled orders can be removed from view' });
    }

    order.hiddenByUser = true;
    await order.save();

    console.log('✅ Order hidden from dashboard:', orderId);
    res.json({ message: 'Order removed from your dashboard', orderId });

  } catch (error) {
    console.error('❌ Hide order error:', error);
    res.status(500).json({ message: 'Failed to remove order', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const orders = await NameplateOrder.find({ 'customer.email': req.user.email })
      .populate('customer', 'firstName lastName phone email')
      .populate('size')
      .sort({ createdAt: -1 });

    // ✅ ALWAYS RETURN ARRAY
    res.status(200).json(orders || []);
  } catch (error) {
    console.error('❌ Nameplate orders error:', error);
    // ✅ RETURN EMPTY ARRAY ON ERROR (not object)
    res.status(500).json([]);
  }
});



module.exports = router;

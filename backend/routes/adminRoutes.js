// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const cors = require('cors');



// For image uploads by admin
const multer = require('multer');
const path = require('path');
const fs = require('fs');



router.use(cors({
  origin: process.env.FRONTEND_URI_LOCAL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const Product = require('../models/Product');
const GalleryImage = require('../models/GalleryImage');
const User = require('../models/User');
const Order = require('../models/Order');
const NameplateOrders = require('../models/NameplateOrder');
const { sendNameplateStatusEmail } = require('../utils/nameplateMailer');
const { sendOrderStatusEmail } = require('../utils/emailService');


router.get('/dashboard', auth, isAdmin, async (req, res) => {
  try {
    res.json({
      message: 'Dashboard access granted',
      user: req.user
    });
  } catch (err) {
    res.status(500).json({ message: 'Dashboard error', error: err.message });
  }
});



// ✅ UPDATE ORDER STATUS ROUTE (REPLACE THE EXISTING ONE)
router.patch('/orders/:id/status', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value',
        validStatuses
      });
    }

    // ✅ POPULATE USER DATA TO GET EMAIL
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the status
    order.status = status;

    // Optional: Auto-update payment status when order is delivered
    if (status === 'delivered' && order.paymentStatus === 'pending') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    // ✅ SEND EMAIL NOTIFICATION
    if (order.user?.email) {
      await sendOrderStatusEmail(order.user.email, status, {
        _id: order._id,
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        items: order.items,
        createdAt: order.createdAt,
        user: order.user
      });
    }

    res.json({
      message: 'Order status updated successfully',
      order: {
        _id: order._id,
        orderId: order.orderId,
        status: order.status,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({
      message: 'Failed to update order status',
      error: err.message
    });
  }
});

// GET SINGLE ORDER (for admin to view details)
router.get('/orders/:id', auth, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'title price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch order',
      error: err.message
    });
  }
});



// All routes below: admin only
router.use(auth, isAdmin);

// PRODUCTS
// router.post('/products', async (req, res) => {
//   try {
//     const product = await Product.create(req.body);
//     res.status(201).json({ message: 'Product added', product });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to add product', error: err.message });
//   }
// });

router.post('/products', async (req, res) => {
  try {
    const productData = {
      ...req.body,
      // Ensure additionalImages is an array
      additionalImages: req.body.additionalImages || []
    };

    const product = await Product.create(productData);
    res.status(201).json({ message: 'Product added', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add product', error: err.message });
  }
});


router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
});

router.get('/products', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});


// router.delete('/products/:id', async (req, res) => {
//   await Product.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Product deleted' });
// });


router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Optional: Delete associated image files
    if (product.additionalImages && product.additionalImages.length > 0) {
      product.additionalImages.forEach(imageUrl => {
        const filename = imageUrl.split('/').pop();
        const filePath = path.join(__dirname, '../uploads/products', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
});




// Add this route to your adminRoutes.js file
// Place it in the ORDERS section, after the existing order routes


// Products upload images by admin

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/products';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Upload images endpoint
router.post('/upload-images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    // Generate URLs for uploaded images
    const imageUrls = req.files.map(file => {
      return `http://localhost:4000/uploads/products/${file.filename}`;
    });

    res.json({ imageUrls });
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload images', error: err.message });
  }
});



// GALLERY
router.post('/gallery', async (req, res) => {
  try {
    const img = await GalleryImage.create(req.body);
    res.status(201).json({ message: 'Image added', image: img });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add image', error: err.message });
  }
});

router.get('/gallery', async (req, res) => {
  const images = await GalleryImage.find().sort({ createdAt: -1 });
  res.json(images);
});

router.delete('/gallery/:id', async (req, res) => {
  await GalleryImage.findByIdAndDelete(req.params.id);
  res.json({ message: 'Image deleted' });
});

// CUSTOMERS (users)
// UPDATED
router.get('/users', async (req, res) => {
  const users = await User.find({}, 'name email createdAt isAdmin'); // ✅ Added isAdmin
  res.json(users);
});

router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User Deleted ' })
})

// ORDERS
router.get('/orders', async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('items.product', 'title price');
  res.json(orders);
});

router.delete('/orders/:id', async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: 'Order Deleted ' })
});


// NAMEPLATE ORDERS

// router.get('/nameplate-orders', async (req, res) => {
//   try {
//     const nameplateOrders = await NameplateOrders.find()
//       .populate('customer', 'email phone firstName lastName')
//       .populate('items', 'name dimensions price');
//     res.json(nameplateOrders);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch nameplate orders', error: err.message });
//   }
// });


router.get('/nameplate-orders', async (req, res) => {
  try {
    const nameplateOrders = await NameplateOrders
      .find()
      .sort({ createdAt: -1 });

    res.json(nameplateOrders);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch nameplate orders',
      error: err.message
    });
  }
});




router.delete('/nameplate-orders/:id', async (req, res) => {
  try {
    const deletedOrder = await NameplateOrders.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Nameplate order not found' });
    }
    res.json({ message: 'Nameplate order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete nameplate order', error: err.message });
  }
});



// GET single nameplate order
router.get('/nameplate-orders/:id', async (req, res) => {
  try {
    const order = await NameplateOrders.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Nameplate order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch nameplate order', error: err.message });
  }
});

// PATCH - Update nameplate order status
router.patch('/nameplate-orders/:id', async (req, res) => {
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

    const order = await NameplateOrders.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Send email notification
    if (status && order.customer?.email) {
      try {
        await sendNameplateStatusEmail(order.customer.email, status, order);
        console.log(`✅ Email sent to ${order.customer.email} for status: ${status}`);
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
});

// GET all nameplate orders (admin only)
// router.get('/', authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const orders = await NameplateOrder.find()
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     res.status(500).json({ message: 'Failed to fetch orders' });
//   }
// });

// GET single order by ID (admin only)
// router.get('/:id', authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const order = await NameplateOrder.findById(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     res.json(order);
//   } catch (error) {
//     console.error('Error fetching order:', error);
//     res.status(500).json({ message: 'Failed to fetch order' });
//   }
// });

// PATCH - Update order status (admin only)
// router.patch('/:id', authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const { status, paymentStatus, trackingNumber, estimatedDelivery } = req.body;

//     const updateData = {};
//     if (status) {
//       updateData.status = status;
//       if (status === 'shipped') updateData['shipping.shippedAt'] = new Date();
//       if (status === 'delivered') updateData['shipping.deliveredAt'] = new Date();
//     }
//     if (paymentStatus) updateData['payment.status'] = paymentStatus;
//     if (trackingNumber) updateData['shipping.trackingNumber'] = trackingNumber;
//     if (estimatedDelivery) updateData['shipping.estimatedDelivery'] = estimatedDelivery;

//     const order = await NameplateOrder.findByIdAndUpdate(
//       req.params.id,
//       { $set: updateData },
//       { new: true }
//     );

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     // Send email notification
//     if (status && order.customer?.email) {
//       try {
//         await sendNameplateStatusEmail(order.customer.email, status, order);
//       } catch (emailError) {
//         console.error('Failed to send email:', emailError);
//       }
//     }

//     res.json({ message: 'Order updated successfully', order });
//   } catch (error) {
//     console.error('Error updating order:', error);
//     res.status(500).json({ message: 'Failed to update order' });
//   }
// });

// DELETE order (admin only)
// router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const order = await NameplateOrder.findByIdAndDelete(req.params.id);

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     res.json({ message: 'Order deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting order:', error);
//     res.status(500).json({ message: 'Failed to delete order' });
//   }
// });

module.exports = router;


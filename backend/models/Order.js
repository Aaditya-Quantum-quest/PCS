

// models/Order.js - KEEP AS-IS
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: false,
        },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        size: { type: String, default: '5x7' },
        frameColor: { type: String, default: 'black' },
        frameMaterial: { type: String, default: 'wood' },
        frameThickness: { type: Number, default: 20 },
        orientation: {
          type: String,
          enum: ['portrait', 'landscape', 'square'],
          default: 'portrait',
        },
        imageUrl: { type: String, required: false }, // ✅ Will now store base64
        price: { type: Number, required: true },
      },
    ],

    totalAmount: { type: Number, required: true },
    orderId: { type: String, required: false },
    paymentMethod: {
      type: String,
      enum: ['COD', 'UPI', 'CARD', 'NETBANKING', 'FREE'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    razorpayOrderId: { type: String, required: false },
    razorpayPaymentId: { type: String, required: false },
    razorpaySignature: { type: String, required: false },
    hiddenByUser: { type: Boolean, default: false }, // ✅ user can remove cancelled orders from their dashboard
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
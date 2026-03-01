const mongoose = require('mongoose');

const nameplateOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  design: {
    customizedImage: {
      type: String,
      required: true
    },
    backgroundImage: String,
    texts: [{
      id: Number,
      content: String,
      x: Number,
      y: Number,
      fontSize: Number,
      color: String,
      fontFamily: String
    }],
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  size: {
    name: {
      type: String,
      required: true,
      enum: ['Small', 'Medium', 'Large', 'XL']
    },
    dimensions: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  customer: {
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    }
  },
  shippingAddress: {
    flatHouse: {
      type: String,
      required: true
    },
    areaStreet: {
      type: String,
      required: true
    },
    pinCode: {
      type: String,
      required: true
    },
    townCity: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cod', 'online', 'upi', 'card'],
      default: 'cod'
    },
    amount: {
      type: Number,
      required: true
    }
  },
  pricing: {
    subtotal: Number,
    shippingCharges: Number,
    tax: Number,
    discount: Number,
    total: {
      type: Number,
      required: true
    }
  },
  shipping: {
    trackingNumber: String,
    estimatedDelivery: Date,
    shippedAt: Date,
    deliveredAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NameplateOrder', nameplateOrderSchema);

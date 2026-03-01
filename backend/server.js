
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');

// Database Connection 
const connectDB = require("./config/db");

// AUTH ROUTES
const authRoutes = require('./routes/authRoutes');

// Admin
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminSeeingOrder = require('./routes/privareSeeingOrderRoutes');

// PUBLIC
const publicGalleryRoutes = require('./routes/publicGalleryRoutes');
const publicViewProductRoutes = require('./routes/publicViewProductsRoute');
const userOrderRoutes = require('./routes/orderRoutes');  // includes Razorpay
const uploadImageRoute = require('./routes/upload');
const publicProductRoute = require('./routes/publicProductsRoutes');
const addressRoutes = require('./routes/addressRoutes');   // your address routes

// NAmeplate Orders 
const nameplateOrders = require('./routes/nameplateOrders'); // New route

const userDashboardRoutes = require('./routes/userDashboard');


// ✅ MIDDLEWARE - Must be BEFORE routes
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(cookieParser());



app.use(
    cors({
        origin: process.env.FRONTEND_URI_LOCAL || 'http://localhost:3000',
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// app.options('*', cors());


// app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user/dashboard', userDashboardRoutes);


app.use('/api/nameplateorders', nameplateOrders); // New nameplate orders route



// ADMIN
// app.use('/api/user/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/', adminSeeingOrder);

// PUBLIC
app.use('/api/gallery', publicGalleryRoutes);
app.use('/api/products', publicViewProductRoutes);
app.use('/api/orders', userOrderRoutes);   // ✅ includes /, /razorpay/order, /verify
app.use('/api/', publicProductRoute);
app.use('/api/', addressRoutes);




// STATIC
app.use('/uploads', express.static('uploads'));

// UPLOAD
app.use('/api/upload', uploadImageRoute);



app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Backend is connected 🚀',
        time: new Date().toISOString(),
    });
});

app.get('/api/test-email', async (req, res) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'TEST EMAIL',
            text: 'If you get this, Nodemailer works'
        });
        res.json({ success: true });
    } catch (err) {
        console.error('EMAIL ERROR 👉', err);
        res.status(500).json({ error: err.message });
    }
});


connectDB().then(() => {
    app.listen(process.env.PORT || 4000, () => {
        console.log("THE SERVER IS LISTENING THE USER REQUEST");
    });
});
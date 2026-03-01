const Address = require('../models/Address');

const saveAddress = async (req, res) => {
    try {
        const addressData = req.body;

        // Generate orderId if not provided
        if (!addressData.orderId) {
            addressData.orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        }

        const address = await Address.create(addressData);

        res.status(201).json({
            success: true,
            message: 'Address saved successfully',
            data: {
                id: address._id,
                orderId: address.orderId,
                fullName: address.fullName,
                ...address.toObject()
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                error: 'Order ID already exists'
            });
        }

        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
module.exports = saveAddress;
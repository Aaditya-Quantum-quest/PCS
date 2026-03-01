const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

router.get('/order/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user')
            .populate('items.product');


        if (!order) {
            return res.status(404).json({ message: 'Order is not Found' });
        }

        res.json(order);
    } catch (err) {
        res
            .status(500)
            .json({
                message: 'Failed to Get Message ', error: err.message
            })
    }
})


// DELETE /api/admin/orders/:id  – delete completed/delivered order
router.delete('/orders/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // only allow delete if completed/delivered
        const status = (order.status || '').toLowerCase();
        if (status !== 'completed' && status !== 'delivered') {
            return res.status(400).json({ message: 'Only completed/delivered orders can be deleted' });
        }

        await Order.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete order' });
    }
});


module.exports = router;
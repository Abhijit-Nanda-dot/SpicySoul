import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Create a new order
const createOrder = async (req, res) => {
    try {
        console.log("Request body:", JSON.stringify(req.body));
        console.log("User ID:", req.body.userId);
        
        const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;
        
        if (!items || items.length === 0) {
            return res.json({ success: false, message: 'Order must contain at least one item' });
        }
        
        console.log("Items:", JSON.stringify(items));
        console.log("Delivery Address:", JSON.stringify(deliveryAddress));
        
        // Transform items to match the schema structure if needed
        const formattedItems = items.map(item => ({
            foodId: item._id, // Using _id instead of id
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        }));
        
        const newOrder = new orderModel({
            user: req.body.userId,
            items: formattedItems,
            totalAmount,
            deliveryAddress,
            paymentMethod,
            status: 'Pending'
        });

        const savedOrder = await newOrder.save();
        
        // Clear the user's cart after successful order
        const user = await userModel.findById(req.body.userId);
        user.cartData = {};
        await user.save();
        
        res.json({
            success: true,
            order: savedOrder
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.json({ 
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ user: req.body.userId }).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.json({ 
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);
        
        if (!order) {
            return res.json({ success: false, message: 'Order not found' });
        }
        
        // Check if the order belongs to the requesting user
        if (order.user.toString() !== req.body.userId) {
            return res.json({ success: false, message: 'Not authorized to access this order' });
        }
        
        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.json({ 
            success: false,
            message: 'Failed to fetch order',
            error: error.message
        });
    }
};

// Get all orders (admin / public for admin panel)
const getAllOrders = async (req, res) => {
    try {
        // populate user name/email for admin display
        const orders = await orderModel.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.json({ success: false, message: 'Failed to fetch orders', error: error.message });
    }
};

// Update order status (used by admin panel)
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const order = await orderModel.findById(orderId);
        if (!order) return res.json({ success: false, message: 'Order not found' });

        if (!['Pending', 'Processing', 'Delivered', 'Cancelled'].includes(status)) {
            return res.json({ success: false, message: 'Invalid status value' });
        }

        order.status = status;
        const saved = await order.save();
        res.json({ success: true, order: saved });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.json({ success: false, message: 'Failed to update order status', error: error.message });
    }
};

export { createOrder, getUserOrders, getOrderById, getAllOrders, updateOrderStatus };
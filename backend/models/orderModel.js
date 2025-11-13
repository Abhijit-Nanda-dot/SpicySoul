import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    items: [{
        foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        image: {
            type: String
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Credit Card', 'Cash on Delivery', 'PayPal']
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
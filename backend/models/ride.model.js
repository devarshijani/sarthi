const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        captain: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Captain",
        },

        pickup: {
            type: String,
            required: true,
        },

        destination: {
            type: String,
            required: true,
        },

        vehicleType: {
            type: String,
            enum: ["auto", "car", "bike"],
            required: true,
        },

        distance: {
            type: Number, // meters
            required: true,
        },

        duration: {
            type: Number, // seconds
            required: true,
        },

        fare: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
            default: "pending",
        },

        // 🔽 PAYMENT FIELDS (OPTIONAL – FILLED LATER)
        orderId: {
            type: String,
            default: null,
        },

        paymentId: {
            type: String,
            default: null,
        },

        signature: {
            type: String,
            default: null,
        },
        otp: {
            type: String,
            // required: true,
            default: null,
        },
        otpExpiry: {
            type: Date,
            default: null,
        },


    },
    { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);

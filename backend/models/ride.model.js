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
            enum: ["pending", "accepted", "ongoing", "completed", "cancelled", "expired"],
            default: "pending",
        },
        cancelledBy: {
            type: String,
            enum: ["user", "captain", null],
            default: null,
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: null,
        },
        ratingComment: {
            type: String,
            maxlength: 200,
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
        otpAttempts: {
            type: Number,
            default: 0,
        },


    },
    { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);

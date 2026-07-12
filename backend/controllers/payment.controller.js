const crypto = require("crypto");
const Razorpay = require("razorpay");
const rideModel = require("../models/ride.model");
const { sendMessageToSocketId } = require("../socket");

/**
 * Helper to enforce ownership, completion status, and unpaid status.
 * Returns the ride populated with captain if checks pass, otherwise throws an error.
 */
async function checkRideForPayment(rideId, userId) {
    const ride = await rideModel.findById(rideId).populate("captain");
    if (!ride) {
        const err = new Error("Ride not found");
        err.status = 404;
        throw err;
    }

    if (ride.user.toString() !== userId.toString()) {
        const err = new Error("Forbidden: You cannot pay for this ride");
        err.status = 403;
        throw err;
    }

    if (ride.status !== "completed") {
        const err = new Error("Only completed rides can be paid");
        err.status = 400;
        throw err;
    }

    if (ride.paymentStatus !== "unpaid") {
        const err = new Error("Ride already paid");
        err.status = 400;
        throw err;
    }

    return ride;
}

/**
 * POST /api/payments/create-order (authUser)
 */
module.exports.createOrder = async (req, res) => {
    try {
        const { rideId } = req.body;
        if (!rideId) {
            return res.status(400).json({ message: "Ride ID is required" });
        }

        let ride;
        try {
            ride = await checkRideForPayment(rideId, req.user._id);
        } catch (err) {
            return res.status(err.status || 500).json({ message: err.message });
        }

        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const amount = Math.round(ride.fare * 100); // derived only from DB (paise)
        const options = {
            amount,
            currency: "INR",
            receipt: ride._id.toString(),
        };

        const order = await razorpayInstance.orders.create(options);

        ride.razorpayOrderId = order.id;
        await ride.save();

        return res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });

    } catch (err) {
        console.error("CREATE ORDER ERROR:", err);
        return res.status(500).json({ message: err.message || "Internal server error" });
    }
};

/**
 * POST /api/payments/verify (authUser)
 */
module.exports.verifyPayment = async (req, res) => {
    try {
        const { rideId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!rideId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "All payment verification details are required" });
        }

        let ride;
        try {
            ride = await checkRideForPayment(rideId, req.user._id);
        } catch (err) {
            return res.status(err.status || 500).json({ message: err.message });
        }

        // Verify that the order ID matches what we have stored on the ride
        if (ride.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        // Verify Razorpay HMAC signature using timingSafeEqual
        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        const a = Buffer.from(generated_signature);
        const b = Buffer.from(razorpay_signature);

        let isSignatureValid = false;
        if (a.length === b.length) {
            isSignatureValid = crypto.timingSafeEqual(a, b);
        }

        if (!isSignatureValid) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        // Mark ride paid_online
        ride.paymentStatus = "paid_online";
        ride.razorpayPaymentId = razorpay_payment_id;
        await ride.save();

        // Emit payment alert to Captain
        if (ride.captain?.socketId) {
            sendMessageToSocketId(ride.captain.socketId, {
                event: "payment-received",
                data: {
                    rideId: ride._id,
                    method: "online",
                    amount: ride.fare,
                },
            });
        }

        return res.status(200).json({
            message: "Payment verified",
            paymentStatus: ride.paymentStatus,
        });

    } catch (err) {
        console.error("VERIFY PAYMENT ERROR:", err);
        return res.status(500).json({ message: err.message || "Internal server error" });
    }
};

/**
 * POST /api/payments/cash (authUser)
 */
module.exports.processCashPayment = async (req, res) => {
    try {
        const { rideId } = req.body;
        if (!rideId) {
            return res.status(400).json({ message: "Ride ID is required" });
        }

        let ride;
        try {
            ride = await checkRideForPayment(rideId, req.user._id);
        } catch (err) {
            return res.status(err.status || 500).json({ message: err.message });
        }

        // Mark ride paid_cash
        ride.paymentStatus = "paid_cash";
        await ride.save();

        // Emit payment alert to Captain
        if (ride.captain?.socketId) {
            sendMessageToSocketId(ride.captain.socketId, {
                event: "payment-received",
                data: {
                    rideId: ride._id,
                    method: "cash",
                    amount: ride.fare,
                },
            });
        }

        return res.status(200).json({
            message: "Payment verified",
            paymentStatus: ride.paymentStatus,
        });

    } catch (err) {
        console.error("CASH PAYMENT ERROR:", err);
        return res.status(500).json({ message: err.message || "Internal server error" });
    }
};

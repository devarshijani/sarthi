const { validationResult } = require("express-validator");
const rideService = require("../services/ride.service");
const mapsService = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket.js");
const rideModel = require("../models/ride.model");
const captainModel = require("../models/captain.model");

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        // 1️⃣ Geocode pickup & destination
        const pickupCoords = await mapsService.getAddressCoordinate(pickup);
        const destinationCoords = await mapsService.getAddressCoordinate(destination);

        // 2️⃣ Calculate distance & duration
        const distanceData = await mapsService.getDistanceTime(
            pickupCoords,
            destinationCoords
        );

        // 3️⃣ Create ride
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType,
            distance: distanceData.distance.value,
            duration: distanceData.duration.value,
        });

        // 4️⃣ Find captains nearby (IMPORTANT)
        const captainsInRadius = await mapsService.getCaptainInRadius(
            pickupCoords.lat,
            pickupCoords.lng,
            5
        );

        // 5️⃣ Populate user for socket payload
        const rideWithUser = await rideModel
            .findById(ride._id)
            .populate("user");

        // remove OTP before sending
        rideWithUser.otp = "";

        // 6️⃣ Emit ride to captains
        captainsInRadius.forEach((captain) => {
            if (!captain.socketId) {
                return;
            }

            sendMessageToSocketId(captain.socketId, {
                event: "new-ride",
                data: rideWithUser,
            });
        });

        // 7️⃣ Respond ONCE (after everything succeeds)
        return res.status(201).json({
            message: "Ride created successfully",
            ride,
        });

    } catch (err) {
        console.error("CREATE RIDE ERROR:", err);

        return res.status(500).json({
            message: err.message || "Internal server error",
        });
    }
};

module.exports.fare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);

        return res.status(200).json({
            message: "Fare calculated successfully",
            fare,
        });
    } catch (err) {
        console.error("FARE ERROR:", err.message);

        return res.status(500).json({
            message: err.message || "Internal server error",
        });
    }
};

module.exports.rateRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.params;
    let { rating, comment } = req.body;

    // Clean comment
    if (comment) {
        comment = comment.trim();
        if (comment === "") comment = null;
    } else {
        comment = null;
    }

    try {
        const ride = await rideModel.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        // Auth/Ownership check
        if (ride.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You cannot rate this ride" });
        }

        // Status check
        if (ride.status !== "completed") {
            return res.status(400).json({ message: "Only completed rides can be rated" });
        }

        // Double rate check
        if (ride.rating !== null && ride.rating !== undefined) {
            return res.status(400).json({ message: "Ride already rated" });
        }

        ride.rating = rating;
        ride.ratingComment = comment;
        await ride.save();

        // Increment Captain stats atomically
        if (ride.captain) {
            await captainModel.findByIdAndUpdate(ride.captain, {
                $inc: {
                    "ratingStats.totalRating": rating,
                    "ratingStats.ratingCount": 1
                }
            });
        }

        return res.status(200).json({
            message: "Ride rated successfully",
            rating
        });

    } catch (err) {
        console.error("RATE RIDE ERROR:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};


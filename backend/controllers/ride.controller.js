const { validationResult } = require("express-validator");
const rideService = require("../services/ride.service");
const mapsService = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket.js");
const rideModel = require("../models/ride.model");

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

        console.log("📍 Pickup coords:", pickupCoords);

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

        console.log("🚖 Captains in radius:", captainsInRadius.length);

        // 5️⃣ Populate user for socket payload
        const rideWithUser = await rideModel
            .findById(ride._id)
            .populate("user");

        // remove OTP before sending
        rideWithUser.otp = "";

        // 6️⃣ Emit ride to captains
        if (captainsInRadius.length === 0) {
            console.log("❌ No captains available nearby");
        } else {
            captainsInRadius.forEach((captain) => {
                if (!captain.socketId) {
                    console.log("⚠️ Captain has no socketId:", captain._id);
                    return;
                }

                console.log(
                    "📤 Sending new-ride to socket:",
                    captain.socketId
                );

                sendMessageToSocketId(captain.socketId, {
                    event: "new-ride",
                    data: rideWithUser,
                });
            });
        }

        // 7️⃣ Respond ONCE (after everything succeeds)
        return res.status(201).json({
            message: "Ride created successfully",
            ride,
        });

    } catch (err) {
        console.error("❌ CREATE RIDE ERROR:", err);

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
        console.error("❌ FARE ERROR:", err.message);

        return res.status(500).json({
            message: err.message || "Internal server error",
        });
    }
};

// module.exports.startRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { rideId, otp } = req.query;

//     try {
//         const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

//         sendMessageToSocketId(ride.user.socketId, {
//             event: 'ride-started',
//             data: ride
//         })

//         return res.status(200).json(ride);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "Internal server error" });
//     }

// }

const { validationResult } = require("express-validator");
const rideService = require("../services/ride.service");
const mapsService = require("../services/maps.service");

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

        return res.status(201).json({
            message: "Ride created successfully",
            ride,
        });

    } catch (err) {
        console.error("CREATE RIDE ERROR:", err.message);

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

    const { pickup, destination, vehicleType } = req.query;

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
}
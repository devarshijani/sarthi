const rideModel = require("../models/ride.model");
const { sendMessageToSocketId } = require("../socket");
const mapsService = require("./maps.service");


// ======================
// GET FARE
// ======================
module.exports.getFare = async (pickup, destination) => {
    if (!pickup || !destination) {
        throw new Error("Pickup and destination are required");
    }

    // 1️⃣ Convert addresses → coordinates
    const pickupCoords = await mapsService.getAddressCoordinate(pickup);
    const destinationCoords = await mapsService.getAddressCoordinate(destination);

    // 2️⃣ Get distance & duration USING COORDINATES
    const distanceTime = await mapsService.getDistanceTime(
        pickupCoords,
        destinationCoords
    );

    if (!distanceTime?.distance?.value || !distanceTime?.duration?.value) {
        throw new Error("Invalid distance data from maps service");
    }

    const baseFare = {
        auto: 30,
        car: 50,
        bike: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        bike: 10
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        bike: 2
    };

    return {
        auto: Math.round(
            baseFare.auto +
            (distanceTime.distance.value / 1000) * perKmRate.auto +
            (distanceTime.duration.value / 60) * perMinuteRate.auto
        ),
        car: Math.round(
            baseFare.car +
            (distanceTime.distance.value / 1000) * perKmRate.car +
            (distanceTime.duration.value / 60) * perMinuteRate.car
        ),
        bike: Math.round(
            baseFare.bike +
            (distanceTime.distance.value / 1000) * perKmRate.bike +
            (distanceTime.duration.value / 60) * perMinuteRate.bike
        )
    };
};


// ======================
// CREATE RIDE
// ======================
module.exports.createRide = async ({
    user,
    pickup,
    destination,
    vehicleType,
    distance,
    duration
}) => {
    if (!user || !pickup || !destination || !vehicleType || !distance || !duration) {
        throw new Error("All fields are required");
    }

    const baseFare = {
        auto: 30,
        car: 50,
        bike: 15
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        bike: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        bike: 1
    };

    if (!baseFare[vehicleType]) {
        throw new Error("Invalid vehicle type");
    }

    const fare = Math.round(
        baseFare[vehicleType] +
        (distance / 1000) * perKmRate[vehicleType] +
        (duration / 60) * perMinuteRate[vehicleType]
    );

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        vehicleType,
        distance,
        duration,
        fare,
        status: "pending"
    });

    return ride;
};



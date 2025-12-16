const Captain = require('../models/captain.model');

module.exports.createCaptain = async ({
    fullName,
    email,
    password,
    vehicle,
    capacity,
    vehicleType
}) => {
    const captain = await Captain.create({
        fullName: {
            firstName: fullName.firstName,
            lastName: fullName.lastName
        },
        email,
        password,
        vehicle: {
            color: vehicle.color,
            plate: vehicle.plate
        },
        capacity,
        vehicleType
    });

    return captain;
};

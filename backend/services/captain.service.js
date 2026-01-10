const Captain = require('../models/captain.model');

/**
 * Creates a captain exactly matching the Captain schema
 */
const createCaptain = async ({ fullName, email, password, vehicle, capacity, vehicleType }) => {
    return await Captain.create({
        fullName: {
            firstName: fullName.firstName,
            lastName: fullName.lastName,
        },
        email,
        password,
        vehicle: {
            color: vehicle.color,
            plate: vehicle.plate,
        },
        capacity,
        vehicleType,
    });
};

module.exports = {
    createCaptain,
};

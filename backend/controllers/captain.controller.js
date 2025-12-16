const Captain = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');

module.exports.registerCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const exists = await Captain.findOne({ email });
    if (exists) {
        return res.status(409).json({ message: 'Captain with this email already exists' });
    }

    const hashedPassword = await Captain.hashPassword(password);

    const captain = await captainService.createCaptain({
        fullName: {
            firstName: fullname.firstname,   // ✅ exact match
            lastName: fullname.lastname
        },
        email,
        password: hashedPassword,
        vehicle: {
            color: vehicle.color,
            plate: vehicle.plate
        },
        capacity: vehicle.capacity,
        vehicleType: vehicle.type
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ captain, token });
};

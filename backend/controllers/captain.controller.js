const Captain = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blacklistTokenModel = require('../models/blacklistToken.model');
const { validationResult } = require('express-validator');

/* ================= REGISTER ================= */
module.exports.registerCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const exists = await Captain.findOne({ email });
    if (exists) {
        return res.status(409).json({ message: 'Captain already exists' });
    }

    const hashedPassword = await Captain.hashPassword(password);

    const captain = await captainService.createCaptain({
        fullName: {
            firstName: fullname.firstname,
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

/* ================= LOGIN ================= */
module.exports.loginCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await Captain
        .findOne({ email })
        .select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict'
    });

    res.status(200).json({ captain, token });
};

/* ================= PROFILE ================= */
module.exports.getCaptainProfile = async (req, res) => {
    res.status(200).json({ captain: req.captain });
};

/* ================= LOGOUT ================= */
module.exports.logoutCaptain = async (req, res) => {
    const token =
        req.token ||
        req.headers.authorization?.split(' ')[1];

    await blacklistTokenModel.create({ token });

    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};
    
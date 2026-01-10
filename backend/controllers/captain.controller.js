const Captain = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blacklistTokenModel = require('../models/blacklistToken.model');
const { validationResult } = require('express-validator');

/* ================= REGISTER ================= */
module.exports.registerCaptain = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password, vehicle } = req.body;

        // check if captain already exists
        const exists = await Captain.findOne({ email });
        if (exists) {
            return res.status(409).json({ message: 'Captain already exists' });
        }

        // hash password
        const hashedPassword = await Captain.hashPassword(password);

        const captain = await captainService.createCaptain({
            fullName: {
                firstName: fullname.firstname,
                lastName: fullname.lastname,
            },
            email,
            password: hashedPassword,
            vehicle: {
                color: vehicle.color,
                plate: vehicle.plate,
            },
            capacity: Number(vehicle.capacity),
            vehicleType: vehicle.type,
        });


        // ❌ NO AUTO LOGIN
        return res.status(201).json({
            message: 'Signup successful. Please login.',
        });

    } catch (error) {
        console.error('REGISTER CAPTAIN ERROR:', error);

        if (error.code === 11000) {
            // Duplicate key error
            if (error.keyPattern?.email) {
                return res.status(409).json({ message: 'Email already registered' });
            }
            if (error.keyPattern?.['vehicle.plate']) {
                return res.status(409).json({ message: 'Vehicle plate already registered' });
            }
        }

        return res.status(500).json({ message: 'Internal server error' });
    }

};

/* ================= LOGIN ================= */
module.exports.loginCaptain = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const captain = await Captain.findOne({ email }).select('+password');
        if (!captain) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await captain.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = captain.generateAuthToken();

        return res.status(200).json({
            captain,
            token,
        });

    } catch (error) {
        console.error('LOGIN CAPTAIN ERROR:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/* ================= PROFILE ================= */
module.exports.getCaptainProfile = async (req, res) => {
    return res.status(200).json({ captain: req.captain });
};

/* ================= LOGOUT ================= */
module.exports.logoutCaptain = async (req, res) => {
    try {
        const token =
            req.token || req.headers.authorization?.split(' ')[1];

        if (token) {
            await blacklistTokenModel.create({ token });
        }

        res.clearCookie('token');
        return res.status(200).json({ message: 'Logged out successfully' });

    } catch (error) {
        console.error('LOGOUT CAPTAIN ERROR:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
/* ================= UPDATE PROFILE ================= */
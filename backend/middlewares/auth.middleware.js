const userModel = require('../models/user.model');
const Captain = require('../models/captain.model');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');

/* ================= USER AUTH ================= */
module.exports.authUser = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token ||
            req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const isBlacklisted = await blacklistTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token revoked' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired token',
            error: err.message
        });
    }
};

/* ================= CAPTAIN AUTH ================= */
module.exports.authCaptain = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token ||
            req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const isBlacklisted = await blacklistTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token revoked' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const captain = await Captain.findById(decoded.id);
        if (!captain) {
            return res.status(401).json({ message: 'Captain not found' });
        }

        req.captain = captain;
        req.token = token;
        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired token',
            error: err.message
        });
    }
};

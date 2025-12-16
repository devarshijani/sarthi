const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.authUser = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token ||
            (req.headers.authorization &&
                req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({
                message: 'Access Denied. No token provided.'
            });
        }

        const isBlacklisted = await blacklistTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({
                message: 'Token has been revoked. Please login again.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 👇 FIX: use _id (same as JWT payload)
        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        req.user = user;
        req.token = token;

        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired token.',
            error: err.message
        });
    }
};

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minlength: 3
        },
        lastName: {
            type: String,
            minlength: 3
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    status: {
        type: String,
        enum: ['available', 'unavailable', 'on-trip'],
        default: 'unavailable'
    },
    vehicle: {
        color: { type: String, required: true },
        plate: { type: String, required: true, unique: true }
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    vehicleType: {
        type: String,
        enum: ['car', 'bike', 'auto'],
        required: true
    }
}, { timestamps: true });

/* 🔐 HASH PASSWORD */
captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

/* 🔐 COMPARE PASSWORD */
captainSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

/* 🔑 JWT TOKEN */
captainSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { id: this._id, role: 'captain' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// const captainModel = mongoose.model('Captain', captainSchema);

module.exports = mongoose.model('Captain', captainSchema);

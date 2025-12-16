const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // Document will automatically be removed after 24 hours (86400 seconds)
        expires: 60 * 60 * 24
    }
});

const blacklistTokenModel = mongoose.model('BlacklistToken', blacklistTokenSchema);

module.exports = blacklistTokenModel;

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            require: true,
            minlength: [3, 'must be of minimum 3 chracter'],
        },
        lastname: {
            type: String,
            // require:true,
            minlength: [3, 'must be of minimum 3 chracter'],
        }
    },
    email: {
        type: String,
        require: true,
        unique: true,
        minlength: [6, 'It must be of minimnum 6 character'],
    },
    password: {
        type: String,
        require: true,
        minlength: [6, 'must be of minmum 6 character'],
        select: false,
    },
    socketId: {
        type: String,
    },
})

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET);
    return token;
}

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
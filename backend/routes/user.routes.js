const express = require('express');
const router = express.Router();
const{body} = require("express-validator");
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const rateLimit = require('express-rate-limit');

const strictAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later" }
});

router.post('/register',
    strictAuthLimiter,
    [
        body('email').isEmail().withMessage('Invalid Email'),
        body('fullname.firstname').isLength({min:3}).withMessage('must be of minimum 3 chracter'),
        body('password').isLength({min:6}).withMessage('must be of minmum 6 character')
    ],
    userController.registerUser 
)

router.post('/login',
    strictAuthLimiter,
    [
        body('email').isEmail().withMessage('Invalid Email'),
        body('password').isLength({min:6}).withMessage('must be of minmum 6 character')
    ],
    userController.loginUser
)

router.get('/profile', authMiddleware.authUser, userController.getUserProfile);
router.get('/logout', authMiddleware.authUser, userController.logoutUser);

module.exports = router;
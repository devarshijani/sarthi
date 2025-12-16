const captainController = require('../controllers/captain.controller');
const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register',[
    body('fullname.firstname').notEmpty().withMessage('First name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').notEmpty().withMessage('Vehicle color is required'),
    body('vehicle.plate').notEmpty().withMessage('Vehicle plate number is required'),
    body('vehicle.capacity').isInt({min:1}).withMessage('Vehicle capacity must be a positive integer'),
    body('vehicle.type').isIn(['car', 'bike', 'auto']).withMessage('Vehicle type is required'),

],
    captainController.registerCaptain
);

router.post('/login',
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    captainController.loginCaptain
);

router.get('/profile',
    authMiddleware.authCaptain,
    captainController.getCaptainProfile
);

router.get('/logout',
    authMiddleware.authCaptain,
    captainController.logoutCaptain
);

module.exports = router;
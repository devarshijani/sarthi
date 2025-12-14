const express = require('express');
const router = express.Router();
const{body} = require("express-validator");
const userController = require('../controllers/user.controller');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('must be of minimum 3 chracter'),
    body('password').isLength({min:6}).withMessage('must be of minmum 6 character')
],
    userController.registorUser
)



module.exports = router;
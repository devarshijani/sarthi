const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const { authUser } = require("../middlewares/auth.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
    "/create",
    authUser,
    body("pickup").isString().isLength({ min: 3 }),
    body("destination").isString().isLength({ min: 3 }),
    body("vehicleType").isIn(["auto", "car", "bike"]),
    rideController.createRide
);

router.get(
    "/fare",
    query("pickup").isString().isLength({ min: 3 }),
    query("destination").isString().isLength({ min: 3 }),
    rideController.fare
);

// router.get('start-ride',
//     authMiddleware.authCaptain,
//     query('rideId').isMongoId().withMessage('Invalid ride ID'),
//     query('otp').isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
//     rideController.startRide
// )

module.exports = router;

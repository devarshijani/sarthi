const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const rideHistoryController = require("../controllers/rideHistory.controller");
const { authUser, authCaptain } = require("../middlewares/auth.middleware");

// -------- RIDE HISTORY & STATS ROUTES --------
router.get("/my-rides", authUser, rideHistoryController.getMyRides);
router.get("/captain-rides", authCaptain, rideHistoryController.getCaptainRides);
router.get("/captain-stats", authCaptain, rideHistoryController.getCaptainStats);

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


module.exports = router;

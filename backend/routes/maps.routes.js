const express = require("express");
const router = express.Router();
const { query } = require("express-validator");

const mapController = require("../controllers/map.controller");
// const authMiddleware = require("../middlewares/auth.middleware");

router.get(
    "/get-coordinates",
    query("address").isString().isLength({ min: 3 }),
    mapController.getCoordinates
);

router.get(
    "/get-distance-time",
    query("origin").isString().isLength({ min: 3 }),
    query("destination").isString().isLength({ min: 3 }),
    mapController.getDistanceTime
);

router.get('/get-suggestions', 
    query('input').isString().isLength({min:3}),
    // authMiddleware.authUser,
    mapController.getAutoCompleteSuggestions
)

module.exports = router;

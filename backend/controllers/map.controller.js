const { validationResult } = require("express-validator");
const mapsService = require("../services/maps.service");

// ======================
// GET COORDINATES
// ======================
module.exports.getCoordinates = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { address } = req.query;
        const coordinates = await mapsService.getAddressCoordinate(address);

        res.status(200).json(coordinates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ======================
// GET DISTANCE + TIME
// ======================
module.exports.getDistanceTime = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;

        const originCoords = await mapsService.getAddressCoordinate(origin);
        const destinationCoords = await mapsService.getAddressCoordinate(destination);

        const distanceTime = await mapsService.getDistanceTime(
            originCoords,
            destinationCoords
        );

        res.status(200).json(distanceTime);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ======================
// AUTOCOMPLETE CONTROLLER
// ======================
module.exports.getAutoCompleteSuggestions = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;

        const suggestions = await mapsService.getAutoCompleteSuggestions(input);

        res.status(200).json(suggestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ======================
// REVERSE GEOCODE CONTROLLER
// ======================
module.exports.reverseGeocode = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { lat, lng } = req.query;

        const address = await mapsService.getReverseGeocode(lat, lng);

        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const axios = require("axios");
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

// ======================
// ADDRESS → LAT/LNG
// ======================
module.exports.getAddressCoordinate = async (address) => {
    try {
        const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
            { params: { access_token: MAPBOX_TOKEN, country: "in", limit: 1 } }
        );

        if (!response.data.features || response.data.features.length === 0) {
            // Smart fallback: try simplified address
            const parts = address.split(",");
            if (parts.length > 2) {
                const simplified = parts.slice(-2).join(",").trim();
                if (simplified !== address) {
                    console.log(`⚠️ Geocoding failed for "${address}", trying simplified: "${simplified}"`);
                    const fbResponse = await axios.get(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(simplified)}.json`,
                        { params: { access_token: MAPBOX_TOKEN, country: "in", limit: 1 } }
                    );
                    if (fbResponse.data.features && fbResponse.data.features.length > 0) {
                        const [lng, lat] = fbResponse.data.features[0].center;
                        return { lat, lng };
                    }
                }
            }

            // Absolute fallback: default Surat coordinates
            console.log(`❌ Geocoding failed completely for "${address}". Falling back to Surat.`);
            return { lat: 21.1702, lng: 72.8311 };
        }

        const [lng, lat] = response.data.features[0].center;
        return { lat, lng };

    } catch (error) {
        console.error("Geocode error:", error.message);
        return { lat: 21.1702, lng: 72.8311 };
    }
};

// ======================
// LAT/LNG → ADDRESS (REVERSE)
// ======================
module.exports.getReverseGeocode = async (lat, lng) => {
    try {
        if (!lat || !lng) {
            throw new Error("Latitude and longitude are required");
        }

        const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
            { params: { access_token: MAPBOX_TOKEN, limit: 1 } }
        );

        if (!response.data.features || response.data.features.length === 0) {
            throw new Error("Address not found");
        }

        return {
            displayName: response.data.features[0].place_name,
            address: response.data.features[0].context
        };
    } catch (error) {
        console.error("Reverse geocode error:", error.message);
        throw new Error("Reverse geocoding failed");
    }
};

// ======================
// DISTANCE + TIME
// ======================
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const deg2rad = (deg) => deg * (Math.PI / 180);

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Origin and destination are required");
    }

    try {
        const response = await axios.get(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`,
            { params: { access_token: MAPBOX_TOKEN, overview: "false" } }
        );

        if (!response.data.routes || response.data.routes.length === 0) {
            throw new Error("Route not found");
        }

        const route = response.data.routes[0];
        return {
            distance: {
                value: route.distance,
                text: `${(route.distance / 1000).toFixed(2)} km`,
            },
            duration: {
                value: route.duration,
                text: `${Math.ceil(route.duration / 60)} mins`,
            },
        };
    } catch (err) {
        console.error("Mapbox Directions error, using Haversine fallback:", err.message);

        // Fallback: Haversine Formula
        const distKm = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
        const distMeters = distKm * 1000;
        const durationSeconds = (distKm / 30) * 3600;

        return {
            distance: {
                value: distMeters,
                text: `${distKm.toFixed(2)} km`,
            },
            duration: {
                value: durationSeconds,
                text: `${Math.ceil(durationSeconds / 60)} mins`,
            },
        };
    }
};

// ======================
// AUTOCOMPLETE SUGGESTIONS
// ======================
module.exports.getAutoCompleteSuggestions = async (input) => {
    try {
        if (!input) throw new Error("Input is required");

        const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json`,
            {
                params: {
                    access_token: MAPBOX_TOKEN,
                    country: "in",
                    limit: 5,
                    types: "place,address,poi"
                }
            }
        );

        if (!response.data.features || response.data.features.length === 0) {
            return [];
        }

        return response.data.features.map(f => ({
            displayName: f.place_name,
            lat: f.center[1],
            lng: f.center[0]
        }));

    } catch (error) {
        console.error("Suggestion error:", error.message);
        return [];
    }
};

// ======================
// CAPTAINS IN RADIUS
// ======================
const captainsModel = require("../models/captain.model");

module.exports.getCaptainInRadius = async (lat, lng, radius) => {
    const captains = await captainsModel.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                $maxDistance: radius * 1000
            }
        }
    });
    return captains;
};
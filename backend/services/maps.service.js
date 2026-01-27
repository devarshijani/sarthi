const axios = require("axios");

// ======================
// ADDRESS → LAT/LNG
// ======================
module.exports.getAddressCoordinate = async (address) => {
    try {
        const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: {
                    q: address,
                    format: "json",
                    limit: 3,
                    addressdetails: 1,
                    countrycodes: "in",   // 🇮🇳 VERY IMPORTANT
                    bounded: 1,
                },

                headers: {
                    "User-Agent": "sarthi-app",
                },
            }
        );

        if (!response.data || response.data.length === 0) {
            throw new Error("Address not found");
        }

        return {
            lat: Number(response.data[0].lat),
            lng: Number(response.data[0].lon),
        };
    } catch (error) {
        console.error("Geocode error:", error.message);
        throw new Error("Geocoding failed");
    }
};

// ======================
// DISTANCE + TIME
// ======================
// Haversine formula without exporting
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Origin and destination are required");
    }

    const url = `https://router.project-osrm.org/route/v1/driving/` +
        `${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false`;

    try {
        const response = await axios.get(url);
        if (response.data.code !== "Ok") {
            throw new Error("Route not found");
        }

        const route = response.data.routes[0];

        return {
            distance: {
                value: route.distance, // meters
                text: `${(route.distance / 1000).toFixed(2)} km`,
            },
            duration: {
                value: route.duration, // seconds
                text: `${Math.ceil(route.duration / 60)} mins`,
            },
        };
    } catch (err) {
        console.error("Maps API Error, using fallback:", err.message);

        // Fallback: Haversine Formula
        const distKm = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
        const distMeters = distKm * 1000;
        const durationSeconds = (distKm / 30) * 3600; // Assuming 30km/h avg speed

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
        if (!input) {
            throw new Error("Input is required");
        }

        const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: {
                    q: input,
                    format: "json",
                    addressdetails: 1,
                    limit: 5
                },
                headers: {
                    "User-Agent": "sarthi-app"
                }
            }
        );

        if (!response.data || response.data.length === 0) {
            return [];
        }

        // Return simplified suggestion list
        return response.data.map(place => ({
            displayName: place.display_name,
            lat: Number(place.lat),
            lng: Number(place.lon)
        }));

    } catch (error) {
        console.error("Suggestion error:", error.message);
        throw new Error("Failed to fetch suggestions");
    }
};

const captainsModel = require("../models/captain.model");

module.exports.getCaptainInRadius = async (lat, lng, radius) => {
    // radius in km
    const captains = await captainsModel.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                $maxDistance: radius * 1000 // meters
            }
        }
    });

    return captains;
};
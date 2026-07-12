const rideModel = require("../models/ride.model");

/**
 * Starts the background interval sweep to expire pending rides created >2 minutes ago.
 * @param {object} io - The socket.io server instance
 */
function start(io) {
    if (!io) {
        console.error("io instance is required to start ride expiry service");
        return;
    }

    // Run sweep every 30 seconds
    setInterval(async () => {
        try {
            const expiryLimit = new Date(Date.now() - 2 * 60 * 1000);
            
            // Find pending rides created before the expiry limit
            const expiredRides = await rideModel.find({
                status: "pending",
                createdAt: { $lt: expiryLimit }
            });

            for (const ride of expiredRides) {
                try {
                    ride.status = "expired";
                    await ride.save();

                    // Broadcast "ride-expired" to all sockets so both the user and 
                    // nearby captains viewing the ride popup are notified.
                    io.emit("ride-expired", { rideId: ride._id });
                } catch (err) {
                    console.error(`Failed to expire ride ID ${ride._id}:`, err);
                }
            }
        } catch (err) {
            console.error("Error in ride expiry background sweep iteration:", err);
        }
    }, 30000);
}

module.exports = {
    start
};

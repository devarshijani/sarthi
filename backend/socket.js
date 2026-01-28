const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");
const rideModel = require("./models/ride.model");

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`🟢 New client connected: ${socket.id}`);

        /* ================= JOIN ================= */
        socket.on("join", async ({ userId, userType }) => {
            try {
                if (userType === "user") {
                    await userModel.findByIdAndUpdate(userId, {
                        socketId: socket.id,
                    });
                }

                if (userType === "captain") {
                    await captainModel.findByIdAndUpdate(userId, {
                        socketId: socket.id,
                        status: "available",
                    });
                }
            } catch (err) {
                console.error("JOIN ERROR:", err.message);
            }
        });

        /* ========== CAPTAIN LOCATION UPDATE ========== */
        socket.on("update-location-captain", async ({ userId, location }) => {
            if (!location || !location.ltd || !location.lng) return;

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    type: "Point",
                    coordinates: [location.lng, location.ltd],
                },
            });

            console.log("📍 Captain location updated:", userId);
        });

        /* ========== ACCEPT RIDE (CRITICAL) ========== */
        socket.on("accept-ride", async ({ rideId, captainId }) => {
            try {
                const ride = await rideModel
                    .findById(rideId)
                    .populate("user");

                if (!ride || ride.status !== "pending") return;

                ride.status = "accepted";
                ride.captain = captainId;
                await ride.save();

                const captain = await captainModel.findById(captainId);

                /* Notify USER */
                if (ride.user.socketId) {
                    io.to(ride.user.socketId).emit("ride-accepted", {
                        ride,
                        captain,
                    });
                }

                console.log("✅ Ride accepted:", rideId);
            } catch (err) {
                console.error("ACCEPT RIDE ERROR:", err.message);
            }
        });

        socket.on("disconnect", () => {
            console.log(`🔴 Client disconnected: ${socket.id}`);
        });
    });
}

/* ========== HELPER (USED ELSEWHERE) ========== */
function sendMessageToSocketId(socketId, messageObject) {
    if (!io) return;

    io.to(socketId).emit(messageObject.event, messageObject.data);
}

module.exports = { initializeSocket, sendMessageToSocketId };

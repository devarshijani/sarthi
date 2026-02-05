const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");
const rideModel = require("./models/ride.model");

let io;

/* ================= INIT SOCKET ================= */
function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("🔌 New client connected:", socket.id);

        /* ========== JOIN ========== */
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

                console.log(`✅ ${userType} joined: ${userId}`);
            } catch (err) {
                console.error("❌ join error:", err);
            }
        });

        /* ========== LOCATION UPDATE ========== */
        socket.on("update-location-captain", async ({ userId, location }) => {
            if (!location?.lng || !location?.ltd) return;

            // 1️⃣ Save location in DB
            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    type: "Point",
                    coordinates: [location.lng, location.ltd],
                },
            });

            // 2️⃣ 🔥 EMIT LIVE LOCATION (THIS WAS MISSING)
            const ride = await rideModel.findOne({
                captain: userId,
                status: "ongoing",
            }).populate("user");

            if (ride?.user?.socketId) {
                io.to(ride.user.socketId).emit("captain-location-update", {
                    lat: location.ltd,
                    lng: location.lng,
                    captainId: userId,
                });
            }

        });


        /* ========== ACCEPT RIDE ========== */
        socket.on("accept-ride", async ({ rideId, captainId }) => {
            try {
                const ride = await rideModel.findById(rideId).populate("user");
                if (!ride || ride.status !== "pending") return;

                const otp = Math.floor(1000 + Math.random() * 9000).toString();

                ride.status = "accepted";
                ride.captain = captainId;
                ride.otp = otp;
                await ride.save();

                const captain = await captainModel.findById(captainId);

                io.to(ride.user.socketId).emit("ride-accepted", {
                    ride: { ...ride.toObject(), otp },
                    captain: {
                        name: `${captain.fullName.firstName} ${captain.fullName.lastName}`,
                        vehicle: captain.vehicle,
                        phone: captain.phone,
                    },
                });

                console.log("✅ Ride accepted, OTP:", otp);
            } catch (err) {
                console.error("❌ accept-ride error:", err);
            }
        });

        /* ========== START RIDE (OTP VERIFY) ========== */
        socket.on("ride-start", async ({ rideId, otp }) => {
            try {
                const ride = await rideModel
                    .findById(rideId)
                    .select("+otp")
                    .populate("user");

                if (!ride) return;

                if (ride.otp !== otp) {
                    socket.emit("otp-invalid");
                    return;
                }

                ride.status = "ongoing";
                ride.otp = null;
                await ride.save();

                io.to(ride.user.socketId).emit("ride-started", ride);
                socket.emit("ride-started-success", ride);

                console.log("🚀 Ride started");
            } catch (err) {
                console.error("❌ ride-start error:", err);
            }
        });

        /* ========== COMPLETE RIDE ========== */
        socket.on("complete-ride", async ({ rideId }) => {
            try {
                const ride = await rideModel.findById(rideId).populate("user");
                if (!ride || ride.status !== "ongoing") return;

                ride.status = "completed";
                await ride.save();

                await captainModel.findByIdAndUpdate(ride.captain, {
                    status: "available",
                });

                io.to(ride.user.socketId).emit("ride-completed", ride);
                socket.emit("ride-completed-success", ride);

                console.log("🏁 Ride completed");
            } catch (err) {
                console.error("❌ complete-ride error:", err);
            }
        });

        socket.on("disconnect", () => {
            console.log("❌ Disconnected:", socket.id);
        });
    });
}

/* ================= SEND HELPER ================= */
function sendMessageToSocketId(socketId, messageObject) {
    if (!io) {
        console.log("⚠️ Socket not initialized");
        return;
    }
    io.to(socketId).emit(messageObject.event, messageObject.data);
}

/* ================= EXPORTS ================= */
module.exports = {
    initializeSocket,
    sendMessageToSocketId,
};

const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");
const rideModel = require("./models/ride.model");

let io;

/* ================= INIT SOCKET ================= */
function initializeSocket(server) {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,https://sarthi-pied.vercel.app").split(",").map(s => s.trim());
    io = socketIo(server, {
        cors: {
            origin: function (origin, callback) {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ["GET", "POST"],
        },
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error("Unauthorized"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            if (decoded.role === "captain") {
                const captain = await captainModel.findById(decoded.id);
                if (!captain) {
                    return next(new Error("Unauthorized"));
                }
                socket.userId = captain._id.toString();
                socket.userType = "captain";
            } else {
                const user = await userModel.findById(decoded._id);
                if (!user) {
                    return next(new Error("Unauthorized"));
                }
                socket.userId = user._id.toString();
                socket.userType = "user";
            }
            next();
        } catch (err) {
            console.error("Socket authentication error:", err.message);
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {

        /* ========== JOIN ========== */
        socket.on("join", async () => {
            try {
                if (socket.userType === "user") {
                    await userModel.findByIdAndUpdate(socket.userId, {
                        socketId: socket.id,
                    });
                }

                if (socket.userType === "captain") {
                    await captainModel.findByIdAndUpdate(socket.userId, {
                        socketId: socket.id,
                    });
                }
            } catch (err) {
                console.error("join error:", err);
            }
        });

        /* ========== TOGGLE AVAILABILITY ========== */
        socket.on("toggle-availability", async ({ available }) => {
            try {
                if (socket.userType !== "captain") {
                    socket.emit("unauthorized");
                    return;
                }

                const newStatus = available ? "available" : "unavailable";

                const captain = await captainModel.findByIdAndUpdate(
                    socket.userId,
                    { status: newStatus },
                    { new: true }
                );

                socket.emit("availability-updated", { status: captain.status });

            } catch (err) {
                console.error("toggle-availability error:", err);
                socket.emit("error", { message: "Internal server error" });
            }
        });

        /* ========== LOCATION UPDATE ========== */
        socket.on("update-location-captain", async ({ location }) => {
            if (socket.userType !== "captain") return;
            const id = socket.userId;
            const lat = location?.lat || location?.ltd;
            
            if (!location?.lng || !lat) return;

            // 1️⃣ Save location in DB
            await captainModel.findByIdAndUpdate(id, {
                location: {
                    type: "Point",
                    coordinates: [location.lng, lat],
                },
            });

            // 2️⃣ 🔥 EMIT LIVE LOCATION
            const ride = await rideModel.findOne({
                captain: id,
                status: "ongoing",
            }).populate("user");

            if (ride?.user?.socketId) {
                io.to(ride.user.socketId).emit("captain-location-update", {
                    lat: lat,
                    lng: location.lng,
                    captainId: id,
                });
            }
        });


        /* ========== ACCEPT RIDE ========== */
        socket.on("accept-ride", async ({ rideId }) => {
            try {
                if (socket.userType !== "captain") return;
                // Allow ride acceptance regardless of current availability status
                // to prevent stranding riders if a captain toggles offline in a race condition.
                const ride = await rideModel.findById(rideId).populate("user");
                if (!ride || ride.status !== "pending") return;

                const otp = crypto.randomInt(100000, 1000000).toString();

                ride.status = "accepted";
                ride.captain = socket.userId;
                ride.otp = otp;
                ride.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
                ride.otpAttempts = 0;
                await ride.save();

                const captain = await captainModel.findById(socket.userId);

                io.to(ride.user.socketId).emit("ride-accepted", {
                    ride: { ...ride.toObject(), otp },
                    captain: {
                        name: `${captain.fullName.firstName} ${captain.fullName.lastName}`,
                        vehicle: captain.vehicle,
                        phone: captain.phone,
                    },
                });

            } catch (err) {
                console.error("accept-ride error:", err);
            }
        });

        /* ========== START RIDE (OTP VERIFY) ========== */
        socket.on("ride-start", async ({ rideId, otp }) => {
            try {
                if (socket.userType !== "captain") return;
                const ride = await rideModel
                    .findById(rideId)
                    .select("+otp")
                    .populate("user");

                if (!ride) return;

                if (ride.captain?.toString() !== socket.userId) {
                    socket.emit("unauthorized");
                    return;
                }

                // (a) if ride.otpExpiry && ride.otpExpiry < new Date(), emit "otp-expired" to the socket and return;
                if (ride.otpExpiry && ride.otpExpiry < new Date()) {
                    socket.emit("otp-expired");
                    return;
                }

                // (b) if ride.otpAttempts >= 5, emit "otp-locked" to the socket and return;
                if (ride.otpAttempts >= 5) {
                    socket.emit("otp-locked");
                    return;
                }

                // (c) if the OTP does not match, increment ride.otpAttempts, save, emit the existing "otp-invalid", and return;
                if (ride.otp !== otp) {
                    ride.otpAttempts = (ride.otpAttempts || 0) + 1;
                    await ride.save();
                    socket.emit("otp-invalid");
                    return;
                }

                // (d) on match, proceed exactly as now (status "ongoing", clear otp, emit "ride-started" / "ride-started-success")
                ride.status = "ongoing";
                ride.otp = null;
                await ride.save();

                io.to(ride.user.socketId).emit("ride-started", ride);
                socket.emit("ride-started-success", ride);

            } catch (err) {
                console.error("ride-start error:", err);
            }
        });

        /* ========== COMPLETE RIDE ========== */
        socket.on("complete-ride", async ({ rideId }) => {
            try {
                if (socket.userType !== "captain") return;
                const ride = await rideModel.findById(rideId).populate("user");
                if (!ride || ride.status !== "ongoing") return;

                if (ride.captain?.toString() !== socket.userId) {
                    socket.emit("unauthorized");
                    return;
                }

                ride.status = "completed";
                await ride.save();

                await captainModel.findByIdAndUpdate(ride.captain, {
                    status: "available",
                });

                io.to(ride.user.socketId).emit("ride-completed", ride);
                socket.emit("ride-completed-success", ride);

            } catch (err) {
                console.error("complete-ride error:", err);
            }
        });

        /* ========== CANCEL RIDE ========== */
        socket.on("cancel-ride", async ({ rideId }) => {
            try {
                const ride = await rideModel.findById(rideId).populate("user").populate("captain");
                if (!ride) {
                    socket.emit("cancel-error", { message: "Ride not found" });
                    return;
                }

                // Ownership Check
                if (socket.userType === "user") {
                    if (!ride.user || ride.user._id.toString() !== socket.userId) {
                        socket.emit("cancel-error", { message: "Unauthorized to cancel this ride" });
                        return;
                    }
                } else if (socket.userType === "captain") {
                    if (!ride.captain || ride.captain._id.toString() !== socket.userId) {
                        socket.emit("cancel-error", { message: "Unauthorized to cancel this ride" });
                        return;
                    }
                } else {
                    socket.emit("cancel-error", { message: "Unauthorized" });
                    return;
                }

                // Allowed States Check
                const status = ride.status;
                if (socket.userType === "user") {
                    if (status !== "pending" && status !== "accepted") {
                        socket.emit("cancel-error", { message: `Cannot cancel ride with status '${status}'` });
                        return;
                    }
                } else if (socket.userType === "captain") {
                    if (status !== "accepted") {
                        socket.emit("cancel-error", { message: `Cannot cancel ride with status '${status}'` });
                        return;
                    }
                }

                // Perform Cancellation
                ride.status = "cancelled";
                ride.cancelledBy = socket.userType;
                await ride.save();

                // Make Captain available if one was assigned
                if (ride.captain) {
                    await captainModel.findByIdAndUpdate(ride.captain._id, {
                        status: "available",
                    });
                }

                // Notify Parties
                if (status === "pending") {
                    // Broadcast to all sockets so captains can dismiss RidePopUp
                    io.emit("ride-cancelled", { rideId });
                } else if (status === "accepted") {
                    // Target emit to user and captain
                    if (ride.user?.socketId) {
                        io.to(ride.user.socketId).emit("ride-cancelled", {
                            rideId,
                            cancelledBy: socket.userType,
                        });
                    }
                    if (ride.captain?.socketId) {
                        io.to(ride.captain.socketId).emit("ride-cancelled", {
                            rideId,
                            cancelledBy: socket.userType,
                        });
                    }
                }

            } catch (err) {
                console.error("cancel-ride error:", err);
                socket.emit("cancel-error", { message: "Internal server error" });
            }
        });

    });
    return io;
}

/* ================= SEND HELPER ================= */
function sendMessageToSocketId(socketId, messageObject) {
    if (!io) {
        return;
    }
    io.to(socketId).emit(messageObject.event, messageObject.data);
}

/* ================= EXPORTS ================= */
module.exports = {
    initializeSocket,
    sendMessageToSocketId,
};

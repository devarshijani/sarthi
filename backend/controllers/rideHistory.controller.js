const rideModel = require("../models/ride.model");

/**
 * GET /api/rides/my-rides (authUser)
 * Returns a paginated list of rides taken by the rider, newest first.
 * Populates only captain's name and vehicle.
 */
module.exports.getMyRides = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if (limit > 25) limit = 25;
        if (page < 1) page = 1;

        const skip = (page - 1) * limit;

        const rides = await rideModel.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: "captain",
                select: "fullName vehicle",
            })
            .select("status fare pickup destination vehicleType createdAt cancelledBy");

        const total = await rideModel.countDocuments({ user: req.user._id });
        const hasMore = skip + rides.length < total;

        return res.status(200).json({
            rides,
            page,
            hasMore,
        });
    } catch (err) {
        console.error("GET MY RIDES ERROR:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * GET /api/rides/captain-rides (authCaptain)
 * Returns a paginated list of rides accepted by the captain, newest first.
 * Populates only rider's first name.
 */
module.exports.getCaptainRides = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        if (limit > 25) limit = 25;
        if (page < 1) page = 1;

        const skip = (page - 1) * limit;

        const rides = await rideModel.find({
            captain: req.captain._id,
            status: { $in: ["accepted", "ongoing", "completed", "cancelled"] },
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: "user",
                select: "fullname.firstname",
            })
            .select("status fare pickup destination vehicleType createdAt cancelledBy");

        const total = await rideModel.countDocuments({
            captain: req.captain._id,
            status: { $in: ["accepted", "ongoing", "completed", "cancelled"] },
        });
        const hasMore = skip + rides.length < total;

        return res.status(200).json({
            rides,
            page,
            hasMore,
        });
    } catch (err) {
        console.error("GET CAPTAIN RIDES ERROR:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * GET /api/rides/captain-stats (authCaptain)
 * Returns computed statistics (Total earnings, total trips, today's earnings/trips) for a captain.
 */
module.exports.getCaptainStats = async (req, res) => {
    try {
        // Calculate start of today in IST (UTC+5:30) and convert back to UTC for query comparison
        const startOfTodayIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
        startOfTodayIST.setUTCHours(0, 0, 0, 0);
        const startOfTodayUTC = new Date(startOfTodayIST.getTime() - 5.5 * 60 * 60 * 1000);

        const stats = await rideModel.aggregate([
            {
                $match: {
                    captain: req.captain._id,
                    status: "completed",
                },
            },
            {
                $group: {
                    _id: null,
                    totalEarnings: { $sum: "$fare" },
                    totalTrips: { $sum: 1 },
                    todayEarnings: {
                        $sum: {
                            $cond: [
                                { $gte: ["$createdAt", startOfTodayUTC] },
                                "$fare",
                                0,
                            ],
                        },
                    },
                    todayTrips: {
                        $sum: {
                            $cond: [
                                { $gte: ["$createdAt", startOfTodayUTC] },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]);

        const result = stats[0] || {
            totalEarnings: 0,
            totalTrips: 0,
            todayEarnings: 0,
            todayTrips: 0,
        };

        return res.status(200).json(result);
    } catch (err) {
        console.error("GET CAPTAIN STATS ERROR:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

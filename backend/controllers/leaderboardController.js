import Vote from "../models/voteModel.js";

// top artworks
const getTopArtworks = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const tag = req.query.tag;

    try {
        const results = await Vote.aggregate([
            // Filter by tag if provided
            ...(tag ? [{ $match: { selectedTags: tag } }] : []),
            // Sum scores for each artwork
            { $group: { _id: "$artworkID", totalScore: { $sum: "$score" } } },
            // Rank them
            { $sort: { totalScore: -1 } },
            { $limit: limit },
            // Get artwork details
            { $lookup: { from: "artworks", localField: "_id", foreignField: "_id", as: "details" } },
            { $unwind: "$details" }
        ]);
        res.status(200).send(results);
    } catch (err) {
        console.error("Error fetching top artworks:", err);
        res.status(500).send("Server error");
    }
};

// top users
const getTopUsers = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;

    try {
        const results = await Vote.aggregate([
            // Link votes to artworks to find the owner
            { $lookup: { from: "artworks", localField: "artworkID", foreignField: "_id", as: "aw" } },
            { $unwind: "$aw" },
            // Sum scores by artist (ownerID)
            { $group: { _id: "$aw.ownerID", totalScore: { $sum: "$score" } } },
            { $sort: { totalScore: -1 } },
            { $limit: limit },
            // Get artist details (Bridge)
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
            // Security: Hide passwords
            { $project: { "user.password": 0 } }
        ]);
        res.status(200).send(results);
    } catch (err) {
        console.error("Error fetching top users:", err);
        res.status(500).send("Server error");
    }
};

// get artwork rank
const getArtworkRank = async (req, res, next) => {
    const artworkID = req.body.artworkID;
    if (!artworkID) return res.status(400).send("artworkID is required");

    try {
        const ranking = await Vote.aggregate([
            { $group: { _id: "$artworkID", totalScore: { $sum: "$score" } } },
            { $sort: { totalScore: -1 } }
        ]);

        const index = ranking.findIndex(item => item._id.toString() === artworkID);
        if (index === -1) return res.status(404).send("Artwork not found in leaderboard");

        res.status(200).json({ 
            rank: index + 1, 
            totalScore: ranking[index].totalScore 
        });
    } catch (err) {
        console.error("Error fetching artwork rank:", err);
        res.status(500).send("Server error");
    }
};

export {
    getTopArtworks,
    getTopUsers,
    getArtworkRank
};

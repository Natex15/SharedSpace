import Vote from "../models/voteModel.js";

// top artworks
const getTopArtworks = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const tag = req.query.tag;

    try {
        const results = await Vote.getTopArtworks(limit, tag);
        res.send(results);
    } catch (err) {
        console.error("Error fetching top artworks:", err);
        res.status(500).send("Server error");
    }
};

// top users
const getTopUsers = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;

    try {
        const results = await Vote.getTopUsers(limit);
        res.send(results);
    } catch (err) {
        console.error("Error fetching top users:", err);
        res.status(500).send("Server error");
    }
};

// get artwork rank
const getArtworkRank = async (req, res, next) => {
    const artworkID = req.body.artworkID;

    if (!artworkID) {
        return res.status(400).send("artworkID is required");
    }

    try {
        const result = await Vote.getArtworkRank(artworkID);

        if (!result) {
            return res.status(404).send("Artwork not found in leaderboard");
        }

        res.status(200).json(result);
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

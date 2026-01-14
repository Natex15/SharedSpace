import Artwork from "../models/artworkModel.js";
import User from "../models/userModel.js";

// top artworks
const getTopArtworks = async (req, res, next) => {
    try {
        const topArtworks = await Artwork.find({ privacy: "public", totalScore: { $gt: 0 } })
            .sort({ totalScore: -1 })
            .limit(10) // Fetch more than requested to account for possible orphaned entries
            .populate("ownerID", "username profilePicture");

        // Filter out artworks whose owners no longer exist
        const validArtworks = topArtworks.filter(art => art.ownerID !== null);

        // Identify orphaned artworks for cleanup
        const orphanedArtworks = topArtworks.filter(art => art.ownerID === null);
        if (orphanedArtworks.length > 0) {
            const orphanedIds = orphanedArtworks.map(art => art._id);
            await Artwork.deleteMany({ _id: { $in: orphanedIds } });
            console.log(`[Auto-Cleanup] Deleted ${orphanedArtworks.length} orphaned top artworks.`);
        }

        const formattedArt = validArtworks.slice(0, 3).map(art => ({
            img: art.imageURL,
            totalScore: art.totalScore,
            author: art.ownerID?.username || "Anonymous"
        }));

        res.status(200).json(formattedArt);
    } catch (err) {
        console.error('Error fetching leaderboard top artworks:', err);
        res.status(500).json({ message: "Error fetching leaderboard" });
    }
};

//get users with most streaks
const getStreakLeaders = async (req, res, next) => {
    try {
        const topUsers = await User.find({ streakCount: { $gt: 0 } })
            .sort({ streakCount: -1 })
            .limit(5)
            .select("username streakCount profilePicture")

        const formattedUsers = topUsers.map(user => ({
            name: user.username,
            score: user.streakCount,
            img: user.profilePicture,
        }));

        res.status(200).json(formattedUsers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching streak leaderboard", error: error.message });
    }
};

export {
    getTopArtworks,
    getStreakLeaders
};

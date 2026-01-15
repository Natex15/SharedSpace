import Artwork from "../models/artworkModel.js";
import User from "../models/userModel.js";
import mongoose from 'mongoose';
import { updateStreak } from "./userController.js";
import { awardStreakBadges } from "../utils/badgeHelper.js";
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
const findAllArtworks = async (req, res, next) => {
    try {
        const artworks = await Artwork.find().populate('ownerID', 'username profilePicture').sort({ uploadDate: -1 });

        // Filter out artworks where owner no longer exists (orphaned)
        const validArtworks = artworks.filter(art => art.ownerID !== null);

        // Identify orphaned artworks for cleanup
        const orphanedArtworks = artworks.filter(art => art.ownerID === null);
        if (orphanedArtworks.length > 0) {
            const orphanedIds = orphanedArtworks.map(art => art._id);
            await Artwork.deleteMany({ _id: { $in: orphanedIds } });
            console.log(`[Auto-Cleanup] Deleted ${orphanedArtworks.length} orphaned artworks.`);
        }

        res.send(validArtworks);
    } catch (err) {
        console.error('Error fetching artworks:', err);
        res.status(500).send('Server error');
    }
};

// find artworks by current user
const findMyArtworks = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const artworks = await Artwork.find({ ownerID: userId }).populate('ownerID', 'username profilePicture');

        // Filter out artworks where owner no longer exists
        const validArtworks = artworks.filter(art => art.ownerID !== null);

        // Identify orphaned artworks for cleanup
        const orphanedArtworks = artworks.filter(art => art.ownerID === null);
        if (orphanedArtworks.length > 0) {
            const orphanedIds = orphanedArtworks.map(art => art._id);
            await Artwork.deleteMany({ _id: { $in: orphanedIds } });
            console.log(`[Auto-Cleanup] Deleted ${orphanedArtworks.length} orphaned "my" artworks.`);
        }

        res.send(validArtworks);
    } catch (err) {
        console.error('Error fetching my artworks:', err);
        res.status(500).send('Server error');
    }
};

// find artworks gamit ownerid
const findByOwnerID = async (req, res, next) => {
    const ownerID = req.body.ownerID;
    if (!ownerID) {
        return res.status(400).send('ownerID is required');
    }
    try {
        // Check if owner still exists
        const ownerExists = await User.exists({ _id: ownerID });
        if (!ownerExists) {
            // Clean up artworks if the owner is gone
            const result = await Artwork.deleteMany({ ownerID: ownerID });
            if (result.deletedCount > 0) {
                console.log(`[Auto-Cleanup] Deleted ${result.deletedCount} artworks for non-existent owner: ${ownerID}`);
            }
            return res.status(404).send('Owner not found');
        }

        const artworks = await Artwork.find({ ownerID: ownerID });
        if (!artworks || artworks.length === 0) {
            return res.status(404).send('No artworks found for this owner');
        }
        res.send(artworks);
    } catch (err) {
        console.error('Error fetching artworks by ownerID:', err);
        res.status(500).send('Server error');
    }
};

// find artwork gamit artworkid
const findByArtworkID = async (req, res, next) => {
    try {
        const artwork = await Artwork.findById(req.params.id).populate('ownerID', 'username profilePicture');
        if (!artwork) {
            return res.status(404).send('Artwork not found');
        }

        // If the owner is missing, the artwork should be deleted
        if (!artwork.ownerID) {
            await Artwork.findByIdAndDelete(req.params.id);
            console.log(`[Auto-Cleanup] Deleted orphaned artwork on preview: ${req.params.id}`);
            return res.status(404).send('Artwork not found (owner deleted)');
        }

        res.send(artwork);
    } catch (err) {
        console.error('Error fetching artwork by ID:', err);
        res.status(500).send('Server error');
    }
};

// create artwork
const createArtwork = async (req, res, next) => {
    try {
        const newArtwork = new Artwork({
            // artworkID: new mongoose.Types.ObjectId(),
            ownerID: req.user.userId,
            title: req.body.title,
            description: req.body.description,
            imageURL: req.body.imageURL,
            privacy: req.body.privacy,
            tags: req.body.tags
        });

        const savedArtwork = await newArtwork.save();

        const updatedUser = await updateStreak(req.user.userId); //trigger a streak update to user after new artwork created

        if (updatedUser) {
            await awardStreakBadges(req.user.userId, updatedUser.streakCount)
        }

        res.status(201).json(savedArtwork);
    } catch (err) {
        console.error('Error creating artwork:', err);
        res.status(500).json({ message: 'Unable to create artwork', error: err.message });
    }
};

// delete artwork using artworkid
const deleteArtwork = async (req, res, next) => {
    try {
        const dArtwork = await Artwork.findByIdAndDelete(req.params.id);
        if (!dArtwork) {
            return res.status(404).send('Artwork not found');
        }
        return res.status(200).send(`Successfully deleted artwork: ${dArtwork.title}`);
    } catch (err) {
        console.error('Error deleting artwork:', err);
        res.status(500).send('Unable to delete artwork');
    }
};

// delete multiple artworks
const deleteMultipleArtworks = async (req, res, next) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: 'IDs array is required' });
        }

        const result = await Artwork.deleteMany({
            _id: { $in: ids },
            ownerID: req.user.userId
        });

        res.status(200).json({ message: `Successfully deleted ${result.deletedCount} artworks` });
    } catch (err) {
        console.error('Error deleting multiple artworks:', err);
        res.status(500).json({ message: 'Unable to delete artworks', error: err.message });
    }
};

// update artwork by artworkID
const updateArtwork = async (req, res, next) => {
    try {
        const { title, description, imageURL, privacy, tags } = req.body;

        const fieldsToUpdate = {};

        if (title) {
            fieldsToUpdate.title = title;
        }
        if (description) {
            fieldsToUpdate.description = description;
        }
        if (imageURL) {
            fieldsToUpdate.imageURL = imageURL;
        }
        if (privacy) {
            fieldsToUpdate.privacy = privacy;
        }
        if (tags) {
            fieldsToUpdate.tags = tags;
        }

        const updatedArtwork = await Artwork.findOneAndUpdate(
            req.params.id,
            { $set: fieldsToUpdate },
            { new: true }
        );

        if (!updatedArtwork) {
            return res.status(404).send("Artwork not found");
        }
        res.status(200).json(updatedArtwork);
    } catch (err) {
        console.error('Error updating artwork:', err);
        res.status(500).json({ message: "Unable to update artwork", error: err.message });
    }
};

// get artworks from user's friends
const getFriendsArtworks = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('friends');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.friends || user.friends.length === 0) {
            return res.json([]);
        }

        const friendsArtworks = await Artwork.find({
            ownerID: { $in: user.friends }
        })
            .populate('ownerID', 'username profilePicture')
            .sort({ uploadDate: -1 });

        // Filter out artworks whose owners no longer exist
        const validArtworks = friendsArtworks.filter(art => art.ownerID !== null);

        // Identify orphans for cleanup
        const orphanedArtworks = friendsArtworks.filter(art => art.ownerID === null);
        if (orphanedArtworks.length > 0) {
            const orphanedIds = orphanedArtworks.map(art => art._id);
            await Artwork.deleteMany({ _id: { $in: orphanedIds } });
            console.log(`[Auto-Cleanup] Deleted ${orphanedArtworks.length} orphaned friends artworks.`);
        }

        res.json(validArtworks);
    } catch (err) {
        console.error('Error fetching friends artworks:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export {
    findAllArtworks, findByOwnerID, findMyArtworks, findByArtworkID, createArtwork, deleteArtwork, deleteMultipleArtworks, updateArtwork, getFriendsArtworks
};

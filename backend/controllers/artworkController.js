import Artwork from "../models/artworkModel.js";
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
        const artworks = await Artwork.find();
        res.send(artworks);
    } catch (err) {
        console.error('Error fetching artworks:', err);
        res.status(500).send('Server error');
    }
};

// find artworks by current user
const findMyArtworks = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const artworks = await Artwork.find({ ownerID: userId });
        res.send(artworks);
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
        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) {
            return res.status(404).send('Artwork not found');
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
        console.log('getFriendsArtworks: Fetching for user:', userId);

        const User = (await import('../models/userModel.js')).default;
        const user = await User.findById(userId).select('friends');

        if (!user) {
            console.log('getFriendsArtworks: User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('getFriendsArtworks: User friends:', user.friends);

        if (!user.friends || user.friends.length === 0) {
            console.log('getFriendsArtworks: User has no friends, returning empty array');
            return res.json([]);
        }

        const friendsArtworks = await Artwork.find({
            ownerID: { $in: user.friends }
        })
            .populate('ownerID', 'username profilePicture')
            .sort({ uploadDate: -1 });

        console.log('getFriendsArtworks: Found', friendsArtworks.length, 'artworks from friends');
        res.json(friendsArtworks);
    } catch (err) {
        console.error('Error fetching friends artworks:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export {
    findAllArtworks, findByOwnerID, findMyArtworks, findByArtworkID, createArtwork, deleteArtwork, updateArtwork, getFriendsArtworks
};

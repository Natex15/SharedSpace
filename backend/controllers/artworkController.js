import Artwork from "../models/artworkModel.js";

// find all artworks
const findAllArtworks = async (req, res, next) => {
    try {
        const artworks = await Artwork.find();
        res.send(artworks);
    } catch (err) {
        console.error('Error fetching artworks:', err);
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
    const artworkID = req.body.artworkID;
    if (!artworkID) {
        return res.status(400).send('artworkID is required');
    }
    try {
        const artwork = await Artwork.findOne({ artworkID: artworkID });
        if (!artwork) {
            return res.status(404).send('Artwork not found');
        }
        res.send(artwork);
    } catch (err) {
        console.error('Error fetching artwork by artworkID:', err);
        res.status(500).send('Server error');
    }
};

// create artwork
const createArtwork = async (req, res, next) => {
    try {
        const newArtwork = new Artwork({
            artworkID: req.body.artworkID,
            ownerID: req.user.userId,
            title: req.body.title,
            description: req.body.description,
            imageURL: req.body.imageURL,
            privacy: req.body.privacy,
            tags: req.body.tags
        });

        const savedArtwork = await newArtwork.save();
        res.status(201).json(savedArtwork);
    } catch (err) {
        console.error('Error creating artwork:', err);
        res.status(500).json({ message: 'Unable to create artwork', error: err.message });
    }
};

// delete artwork using artworkid
const deleteArtwork = async (req, res, next) => {
    try {
        const dArtwork = await Artwork.findOneAndDelete({ artworkID: req.body.artworkID });
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
            { artworkID: req.body.artworkID },
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

// vote for artwork 
const voteArtwork = async (req, res, next) => {
    const artworkID = req.body.artworkID;
    try {
        const artwork = await Artwork.findOne({ artworkID: artworkID });
        if (!artwork) {
            return res.status(404).send('Artwork not found');
        }
        artwork.votes += 1;
        await artwork.save();
        res.status(200).json({ message: 'Vote added', votes: artwork.votes });
    } catch (err) {
        console.error('Error voting for artwork:', err);
        res.status(500).send('Unable to vote for artwork');
    }
};

export {
    findAllArtworks, findByOwnerID, findByArtworkID, createArtwork, deleteArtwork, updateArtwork, voteArtwork
};

import Challenge from '../models/challengeModel.js';
import Artwork from '../models/artworkModel.js'; 
import mongoose from 'mongoose';

// create a challenge (FOR ADMINS ONLY) 
const createChallenge = async (req, res) => {
  try {
    const { title, description, startDate, endDate, criteriaTags } = req.body;

    const challenge = new Challenge({
      title,
      description,
      startDate,
      endDate,
      criteriaTags
    });

    const createdChallenge = await challenge.save();
    res.status(201).json(createdChallenge);
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ message: 'Server error creating challenge' });
  }
};

// get active challenge
const getActiveChallenge = async (req, res) => {
  try {
    const now = new Date();
    
    // Find a challenge where today is between the start and end date
    const activeChallenge = await Challenge.findOne({
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    if (!activeChallenge) {
      return res.status(404).json({ message: 'No active challenge found.' });
    }

    res.status(200).json(activeChallenge);
  } catch (error) {
    console.error('Error fetching active challenge:', error);
    res.status(500).json({ message: 'Server error fetching challenge' });
  }
};

// Submit an artwork to an active challenge
const submitToChallenge = async (req, res) => {
  try {
    const { title, description, imageURL, challengeId } = req.body;
    const ownerID = req.user.userId;

    // Check if the challenge exists and is active
    const challenge = await Challenge.findById(challengeId);
    const now = new Date();

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found.' });
    }
    if (now < challenge.startDate || now > challenge.endDate) {
      return res.status(400).json({ message: 'This challenge is not active.' });
    }
    
    // similar to createArtwork
    // but with the challengeId added
    const newArtwork = new Artwork({
      artworkID: new mongoose.Types.ObjectId(), 
      ownerID: ownerID,
      title: title,
      description: description,
      imageURL: imageURL,
      privacy: 'public', // Challenge submissions must be public
      challengeId: challengeId 
    });

    const savedArtwork = await newArtwork.save();
    res.status(201).json(savedArtwork);
  } catch (error) {
    console.error('Error submitting to challenge:', error);
    res.status(500).json({ message: 'Server error submitting artwork' });
  }
};

export {
    createChallenge, getActiveChallenge, submitToChallenge
}
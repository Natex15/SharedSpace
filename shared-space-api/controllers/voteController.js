import Vote from '../models/voteModel.js';
import Artwork from '../models/artworkModel.js';
import Challenge from '../models/challengeModel.js';

// get artwork entries of a challenge
const getChallengeEntries = async (req, res) => {
  try {
    const { challengeId } = req.params;

    // Find all artworks that have this challengeId
    const entries = await Artwork.find({ challengeId: challengeId })
      .populate('ownerID', 'username profilePicture'); // Get the artist's info

    if (!entries || entries.length === 0) {
      return res.status(404).json({ message: 'No entries found for this challenge.' });
    }

    res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching challenge entries:', error);
    res.status(500).json({ message: 'Server error fetching entries' });
  }
};

// submit artwork vote
const submitVote = async (req, res) => {
  try {
    const { artworkId } = req.params;
    const { selectedTags } = req.body;
    const voterID = req.user.userId;

    // Find the artwork to get its challenge ID
    const artwork = await Artwork.findById(artworkId);
    if (!artwork || !artwork.challengeId) {
      return res.status(404).json({ message: 'Challenge artwork not found.' });
    }

    // Find the challenge to get its tag point values
    const challenge = await Challenge.findById(artwork.challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found.' });
    }

    // Check if this user has already voted for this artwork
    const existingVote = await Vote.findOne({ artworkID: artworkId, voterID: voterID });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted for this entry.' });
    }

    // Create a quick lookup map for the points equivalent of tags
    const tagPoints = new Map();
    for (const tag of challenge.criteriaTags) {
        tagPoints.set(tag.name, tag.points);
    }

    // 5. Calculate the score
    let calculatedScore = 0;
    for (const tagName of selectedTags) {
        if (tagPoints.has(tagName)) {
            // Add the points from the map
            calculatedScore += tagPoints.get(tagName);
        }
    }

    const newVote = new Vote({
      artworkID: artworkId,
      voterID: voterID,
      selectedTags: selectedTags,
      score: calculatedScore 
    });

    await newVote.save();

    // Increment the vote counter of the artwork
    await Artwork.findByIdAndUpdate(artworkId, { $inc: { votes: 1 } });

    res.status(201).json({ message: 'Vote submitted successfully!', vote: newVote });
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ message: 'Server error submitting vote' });
  }
};

export {
    getChallengeEntries, submitVote
}
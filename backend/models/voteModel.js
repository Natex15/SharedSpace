import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  //artwork sa artwork model
  artworkID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Artwork",
    required: true 
  }, 
  //user reference
  voterID: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true 
  }, 
  score: { 
    type: Number, 
    required: true, 
    default: 0
  },
  selectedTags: { 
    type: [String], 
    default: [] 
  }
});

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;

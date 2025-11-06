import mongoose from "mongoose";

const artworkSchema = new mongoose.Schema({
  // redundant ID
  // artworkID: { 
  //   type: mongoose.Schema.Types.ObjectId, 
  //   default: () => new mongoose.Types.ObjectId(), 
  //   unique: true 
  // },
  // reference to user
  ownerID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  imageURL: { 
    type: String, 
    required: true 
  },
  privacy: { 
    type: String, 
    default: "public", 
    enum: ["public", "private"] 
  },
  uploadDate: { 
    type: Date, 
    default: Date.now 
  },
  votes: { 
    type: Number, 
    default: 0 
  },
  tags: { 
    type: [String], 
    default: [] 
  },
  reportCount: { 
    type: Number, 
    default: 0 
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    default: null
  },
});

const Artwork = mongoose.model("Artwork", artworkSchema);

export default Artwork;

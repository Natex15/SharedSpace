import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  // redundant Id
  // reportID: { 
  //   type: mongoose.Schema.Types.ObjectId, 
  //   default: () => new mongoose.Types.ObjectId(), 
  //   unique: true 
  // },
  // reference to artwork
  artworkID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Artwork", 
    required: true 
  },
  // reference to user
  reporterID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  reason: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    default: "pending", 
    enum: ["pending", "reviewed", "resolved"] 
  }
});

const Report = mongoose.model("Report", reportSchema);

export default Report;

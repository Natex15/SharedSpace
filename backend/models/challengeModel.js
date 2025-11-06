import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  // Redundant to mongodb _id
  // challengeID: { 
  //   type: String, 
  //   required: true, 
  //   unique: true 
  // },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  criteriaTags: { 
    type: [String], 
    default: [] 
  }
});

const Challenge = mongoose.model("Challenge", challengeSchema);

export default Challenge;

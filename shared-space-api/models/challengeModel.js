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
  criteriaTags: [{
    name: { type: String, required: true },
    points: { type: Number, required: true, default: 1 }
  }]
});

const Challenge = mongoose.model("Challenge", challengeSchema);

export default Challenge;

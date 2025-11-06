import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // redundant to mongodb _id
  // userID: { 
  //   type: mongoose.Schema.Types.ObjectId, 
  //   default: () => new mongoose.Types.ObjectId(), 
  //   unique: true 
  // },
  username: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  userType: { 
    type: String, 
    default: "user", 
    enum: ["admin", "user"] 
  },
  profilePicture: { 
    type: String 
  },
  streakCount: { 
    type: Number, 
    default: 0 
  },
  // For checking streaks
  lastActivityDate: {
    type: Date
  },
  badges: { 
    type: [String], 
    default: [] 
  },
  friends: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

const User = mongoose.model("User", userSchema);

export default User;

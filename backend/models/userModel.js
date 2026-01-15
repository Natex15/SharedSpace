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
    required: true,
    unique: true
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
    enum: ["admin", "user", "blocked"]
  },
  profilePicture: {
    type: String
  },
  bio: {
    type: String,
    maxlength: [100, "Bio cannot exceed 100 characters"], // Backend limit + Custom error message
    trim: true
  },
  streakCount: {
    type: Number,
    default: 0
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  // For checking streaks
  lastActivityDate: {
    type: Date
  },
  badges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge'
  }],
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

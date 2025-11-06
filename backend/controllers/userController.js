import bcrypt from "bcrypt";
import mongoose from 'mongoose';
import User from '../models/userModel.js';

// find user by email
const findByUserEmail = async (req, res, next) => {
    const email = req.body.email;
    if (!email) {
        return res.status(400).send('Email is required');
    }
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (err) {
        console.error('Error fetching user by email:', err);
        res.status(500).send('Server error');
    }
};

// delete user by email
const deleteUser = async (req, res, next) => {
    try {
        const dUser = await User.findOneAndDelete({ email: req.body.email });
        if (!dUser) {
           return res.status(404).send('User not found');
        }
        return res.status(200).send(`Successfully deleted user with email: ${dUser.email}`);
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).send('Unable to delete user');
    }
};

// update user by email
const updateUser = async (req, res, next) => {
    try {
        // Not all fields included, only those that can be modified by users
        const { username, profilePicture, password } = req.body;
        
        // create an object to hold only the fields to update
        const fieldsToUpdate = {};

        if (username) {
            fieldsToUpdate.username = username;
        }
        if (profilePicture) {
            fieldsToUpdate.profilePicture = profilePicture;
        }
        // If a new password is provided, rehash again
        if (password) {
            fieldsToUpdate.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findOneAndUpdate(
            { email: req.body.email },
            { $set: fieldsToUpdate },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).send("User not found");
        }
        // Password removed for the response
        const userResponse = {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture
        };
        res.status(200).json(userResponse);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: "Unable to update user", error: err.message });
    }
};

// find the current logged in user 
const findCurrentUser = async (req, res) => {
    try {
        console.log('Req User (from JWT):', req.user); 
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
        }
        const userId = req.user.userId;
        const user = await User.findById(userId).select('username email userType');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ message: 'Failed to fetch user.', error: error.message });
    }
};

//register user
const registerUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            // userID: new mongoose.Types.ObjectId(),  redundant ID
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: 'User created successfully.',
            // userID: newUser.userID
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Error signing up.' });
    }
};

//login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid email or password." });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: "Invalid email or password." });

        if (user.userType === "blocked") {
            return res.status(403).json({ error: "Your account has been blocked." });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, userType: user.userType },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Logged in successfully!",
            token,
            email: user.email,
            userType: user.userType
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error logging in.' });
    }
};

//get registered users
const getRegisteredUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch {
        res.status(500).json({ error: 'Unable to get users.' });
    }
};

// Send a friend request
const sendFriendRequest = async (req, res) => {
    const { friendId } = req.body; // The _id of the user to add
    const currentUserId = req.user.userId; // User's _id (from the auth token)

    try {
        // Find the user to add
        const friend = await User.findById(friendId);
        if (!friend) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if already friends or have a pending request
        const alreadyFriends = friend.friends.includes(currentUserId);
        const alreadyRequested = friend.friendRequests.includes(currentUserId);

        if (alreadyFriends) {
            return res.status(400).json({ message: "Already friends." });
        }
        if (alreadyRequested) {
            return res.status(400).json({ message: "Request pending." });
        }

        // Add currentUserId to their friendRequests list
        friend.friendRequests.push(currentUserId);

        await friend.save();
        
        res.status(200).json({ message: "Friend request sent." });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: "Unable to send friend request", error: error.message });
    }
};

// Accept friend request
const acceptFriendRequest = async (req, res) => {
    const { friendId } = req.body; // The _id of the user who sent the request
    const currentUserId = req.user.userId;

    try {
        // Get both users
        const me = await User.findById(currentUserId);
        const friend = await User.findById(friendId);

        if (!friend) {
            return res.status(404).json({ message: "User not found." });
        }
        
        // Remove their ID from my friendRequests
        me.friendRequests = me.friendRequests.filter(id => id.toString() !== friendId);
        
        // Add users to each other's friends list
        if (!me.friends.includes(friendId)) {
            me.friends.push(friendId);
        }
        if (!friend.friends.includes(currentUserId)) {
            friend.friends.push(currentUserId);
        }

        await me.save();
        await friend.save();

        res.status(200).json({ message: "Friend request accepted." });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ message: "Unable to accept friend request", error: error.message });
    }
};

// Decline friend request
const declineFriendRequest = async (req, res) => {
    const { friendId } = req.body; // The _id of the user to decline
    const currentUserId = req.user.userId;

    try {
        const me = await User.findById(currentUserId);

        // Remove from friend requests
        me.friendRequests = me.friendRequests.filter(id => id.toString() !== friendId);

        await me.save();
        
        res.status(200).json({ message: "Friend request declined." });
    } catch (error) {
        console.error('Error declining friend request:', error);
        res.status(500).json({ message: "Unable to decline friend request", error: error.message });
    }
};

// Remove someone from friend list
const removeFriend = async (req, res) => {
    const { friendId } = req.body; // The _id of the friend to remove
    const currentUserId = req.user.userId;

    try {
        const me = await User.findById(currentUserId);
        me.friends = me.friends.filter(id => id.toString() !== friendId); //filter out friend in list
        await me.save();

        // Also remove user from friend's friend list
        const friend = await User.findById(friendId);
        if (friend) { // Only run if friend exists
            friend.friends = friend.friends.filter(id => id.toString() !== currentUserId);
            await friend.save();
        }

        res.status(200).json({ message: "Friend removed." });
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ message: "Unable to remove friend", error: error.message });
    }
};

// Get list of friends
const getFriendsList = async (req, res) => {
    const currentUserId = req.user.userId;

    try {
        const user = await User.findById(currentUserId).populate('friends', 'username profilePicture email');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.friends);
    } catch (error) {
        console.error('Error fetching friends list:', error);
        res.status(500).json({ message: "Unable to fetch friends", error: error.message });
    }
};

// Get list of pending friend requessts
const getPendingRequests = async (req, res) => {
    const currentUserId = req.user.userId;

    try {
        const user = await User.findById(currentUserId).populate('friendRequests', 'username profilePicture email');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(user.friendRequests);
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ message: "Unable to fetch pending requests", error: error.message });
    }
};

export { 
    findByUserEmail, deleteUser, updateUser, findCurrentUser, registerUser, loginUser, getRegisteredUsers,
    sendFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend, getFriendsList, getPendingRequests
};

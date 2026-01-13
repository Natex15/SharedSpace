import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    recipient: {     
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true // Still needed so the user can "Clear" or "Mark as Read" their own list
    },
    type: { 
        type: String, 
        enum: ['friend_request', 'challenge_alert', 'system_alert', 'report_update'], 
        required: true 
    },
    title: { 
        type: String, 
        required: true }, 
    message: { 
        type: String, 
        required: true }, 
    relatedId: { 
        type: mongoose.Schema.Types.ObjectId 
    }, // Link to the specific Challenge or Report
    isRead: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
        expires: 1209600 // auto-delete notifs after 14 days to remove pile-ups in DB
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
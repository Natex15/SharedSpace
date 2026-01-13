import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';

// For 1-on-1 notifications
const sendNotification = async (recipientId, type, title, message, relatedId = null) => {
    const notification = new Notification({ recipient: recipientId, type, title, message, relatedId });
    await notification.save();
};

// For "New Challenge" or "Site Update" notifications
const broadcastNotification = async (type, title, message, relatedId = null) => {
    const users = await User.find({}, '_id');
    const notifications = users.map(user => ({
        recipient: user._id,
        type,
        title,
        message,
        relatedId
    }));
    await Notification.insertMany(notifications);
};

export {
    sendNotification, broadcastNotification
}
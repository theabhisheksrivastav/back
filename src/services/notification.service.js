import { Notification } from "../models/notification.model.js";

class NotificationService {
    /**
     * Create a new notification
     * @param {ObjectId} appointmentId - The appointment this notification is for
     * @param {ObjectId} receiverId - The user who will receive the notification
     * @param {String} message - Notification message
     * @param {Date} scheduledTime - When the notification should be sent
     * @returns {Promise<Notification>}
     */
    static async create({ appointmentId, receiverId, message }) {
        const notification = await Notification.create({
            appointment: appointmentId,
            reciever: receiverId,
            message,
        });
        return notification;
    }

    /**
     * Fetch all notifications for a user
     * @param {ObjectId} userId
     * @returns {Promise<Notification[]>}
     */
    static async getForUser(userId) {
        return Notification.find({ reciever: userId }).sort({ scheduledTime: -1 });
    }

    static async deleteAllNotification(receiverId) {
        return Notification.deleteMany({ reciever: receiverId });
    }
    
}

export  {NotificationService};

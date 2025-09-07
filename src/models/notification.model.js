import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    appointment: {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ["email", "sms", "whatsapp"],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "sent", "failed"],
        default: "pending"
    },
    scheduledTime: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

export const Notification = mongoose.model("Notification", notificationSchema);

import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    appointment: {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
        required: true,
        index: true
    },
    reciever: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

export const Notification = mongoose.model("Notification", notificationSchema);

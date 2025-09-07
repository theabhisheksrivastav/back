import mongoose, { Schema } from "mongoose";


const AppointmentSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    customerPhone: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    slotTime: { type: String, required: true }, // e.g., "09:00", "10:00" will enforce in controller
    status: { type: String, enum: ["scheduled", "completed", "canceled"], default: "scheduled" }
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", AppointmentSchema);
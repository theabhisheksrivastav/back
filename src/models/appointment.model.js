import mongoose, { Schema } from "mongoose";


const AppointmentSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    customerPhone: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    slotTime: { 
    type: String, 
    required: true 
  },
    status: { type: String, enum: ["scheduled", "completed", "canceled", "rescheduled"], default: "scheduled" }
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", AppointmentSchema);
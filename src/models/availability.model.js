import mongoose, { Schema } from "mongoose";

const availabilitySchema = new Schema({
    business: {
        type: Schema.Types.ObjectId,
        ref: "Business",
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    slots: [
        {
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            isBooked: { type: Boolean, default: false }
        }
    ]
}, {
    timestamps: true
});

export const Availability = mongoose.model("Availability", availabilitySchema);

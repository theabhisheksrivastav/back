import mongoose, {Schema} from "mongoose"

const appointmentSchema = new Schema ({
    business: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
        index: true
    },
    customerName: {
        type: String,
        required: true,
        trim: true,
    },
    customerEmail: {
        type: String,
        required: false,
        trim: true,
    },
    customerPhone: {
        type: String,
        required: true,
        trim: true,
    },
    service: {
        type: String,
        required: true,
        trim: true,
    },
    appointmentDate: {
        type: Date,
        required: true,
        index: true
    },
    appointmentTime: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'canceled'],
        default: 'scheduled',
        index: true
    }
},{
    timestamps: true
})

export const Appointment = mongoose.model('Appointment', appointmentSchema);
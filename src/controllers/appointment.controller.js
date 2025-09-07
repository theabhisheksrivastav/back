import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { Appointment } from '../models/appointment.model.js'
import { apiResponse } from '../utils/apiResponse.js'
import NotificationService from '../services/notification.service.js'


const getMyAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({ user: req.user._id }).sort({ slotTime: -1 });
    return res
        .status(200)
        .json(new apiResponse(200, appointments, 'Appointments fetched successfully'))
})

const createAppointment = asyncHandler(async (req, res) => {
    const { user, customerName, customerEmail, customerPhone, service, appointmentDate, slotTime } = req.body;

    if (!user || !customerName || !customerPhone || !service || !appointmentDate || !slotTime) {
        throw new apiError(400, 'Please fill all the required fields');
    }

    // Check if slot already booked
    const existingAppointment = await Appointment.findOne({
        user,
        appointmentDate,
        slotTime
    });

    if (existingAppointment) {
        throw new apiError(400, 'Slot already booked for this time');
    }

    const appointment = await Appointment.create({
        user,
        customerName,
        customerEmail,
        customerPhone,
        service,
        appointmentDate,
        slotTime
    });

    await NotificationService.create({
        appointmentId: appointment._id,
        receiverId: user,
        message: `New appointment booked for ${appointmentDate} at ${slotTime}`,
    });

    return res
        .status(201)
        .json(new apiResponse(201, appointment, 'Appointment created successfully'));
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { status, slotTime } = req.body;

    if (status && !['scheduled', 'completed', 'canceled'].includes(status)) {
        throw new apiError(400, 'Invalid status value');
    }

    const appointment = await Appointment.findById(req.params.id).populate("user");

    if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Check ownership: only the user who owns this appointment can update it
    if (appointment.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Update status and slot time if provided
    if (status) appointment.status = status;
    if (slotTime) {
        // Ensure new slot is not already booked
        const conflict = await Appointment.findOne({
            user: req.user._id,
            appointmentDate: appointment.appointmentDate,
            slotTime
        });
        if (conflict && conflict._id.toString() !== appointment._id.toString()) {
            throw new apiError(400, 'New slot is already booked');
        }
        appointment.slotTime = slotTime;
    }

    await appointment.save();

    return res
        .status(200)
        .json(new apiResponse(200, appointment, 'Appointment updated successfully'));
});


const getAppointmentsForUser = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;

   
    const appointments = await Appointment.findById({appointmentId})
        .sort({ appointmentDate: 1, slotTime: 1 })
        .select("customerName appointmentDate slotTime status service")
        .populate("user", "fullname email phone");

    return res
        .status(200)
        .json(new apiResponse(200, appointments, 'Appointments fetched successfully'));
});


export { getMyAppointments, createAppointment, updateAppointmentStatus, getAppointmentsForUser }
import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { Appointment } from '../models/appointment.model.js'
import { apiResponse } from '../utils/apiResponse.js'


const getAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({ business: req.params.businessId }).sort({ appointmentDate: -1 });
    return res
        .status(200)
        .json(new apiResponse(200, appointments, 'Appointments fetched successfully'))
})

const getAppointmentsForCustomers = asyncHandler(async (req, res) => {
    const { businessId } = req.params;
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 2);

    const appointments = await Appointment.find({
        business: businessId,
        appointmentDate: { $gte: today, $lt: endDate }
    })
        .sort({ appointmentDate: 1 })
        .select("appointmentDate appointmentTime status service");

    return res
        .status(200)
        .json(new apiResponse(200, appointments, 'Appointments fetched successfully'))
})

const createAppointment = asyncHandler(async (req, res) => {
    const { business, customerName, customerEmail, customerPhone, service, appointmentDate, appointmentTime } = req.body;
    if (!business || !customerName || !customerPhone || !service || !appointmentDate || !appointmentTime) {
        throw new apiError(400, 'Please fill all the required fields')
    }
    const appointment = await Appointment.create({
        business, customerName, customerEmail, customerPhone, service, appointmentDate, appointmentTime
    })
    return res
        .status(201)
        .json(new apiResponse(201, appointment, 'Appointment created successfully'))
})

const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!status || !['scheduled', 'completed', 'canceled'].includes(status)) {
        throw new apiError(400, 'Invalid status value');
    }
    // Step 1: Find the appointment & populate the business
    const appointment = await Appointment.findById(req.params.id).populate("business");

    if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Step 2: Check ownership
    if (appointment.business.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Step 3: Update status
    appointment.status = status;
    await appointment.save();
    return res
        .status(200)
        .json(new apiResponse(200, appointment, 'Appointment status updated successfully'))
})

export { getAppointments, getAppointmentsForCustomers, createAppointment, updateAppointmentStatus }
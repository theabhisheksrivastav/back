import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { Appointment } from '../models/appointment.model.js'
import { apiResponse } from '../utils/apiResponse.js'
import {NotificationService} from '../services/notification.service.js'


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
        appointmentDate,
        slotTime
    });

    if (existingAppointment) {
        return res
        .status(409)
        .json(new apiResponse(409, 'Slot already booked for this time'));
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

const updateAppointment = asyncHandler(async (req, res) => {
  const { status, appointmentDate, slotTime } = req.body.data;
  const { id } = req.params;
  console.log (req.body)

  console.log (status, slotTime, appointmentDate, id)

  // Validate status upfront
  if (status && !['scheduled', 'completed', 'canceled', 'rescheduled'].includes(status)) {
    throw new apiError(400, 'Invalid status value');
  }

  // Prepare date
  const newDate = appointmentDate ? new Date(appointmentDate) : null;
  let startOfDay, endOfDay;
  if (newDate) {
    startOfDay = new Date(newDate);
    startOfDay.setHours(0, 0, 0, 0);
    endOfDay = new Date(newDate);
    endOfDay.setHours(23, 59, 59, 999);
  }

  // Check for conflicts first
  if (slotTime && newDate) {
    const conflict = await Appointment.findOne({
      slotTime,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay }
    });

    if (conflict && conflict._id.toString() !== id) {
      return res.status(400).json({ success: false, message: 'New slot is already booked' });
    }
  }

  // Check if appointment belongs to current user
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return res.status(404).json({ success: false, message: "Appointment not found" });
  }
  if (appointment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  // Build update object
  const updateData = {};
    updateData.status = status;
    updateData.slotTime = slotTime;
    updateData.appointmentDate = newDate;

  console.log(id, updateData)
  // Update using $set
  const updatedAppointment = await Appointment.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  ).populate('user', '_id fullname email');

  return res.status(200).json({
    success: true,
    message: 'Appointment updated successfully',
    data: updatedAppointment
  });
});

const getAppointmentsForUser = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params;
    console.log(appointmentId)

   
    const appointments = await Appointment.findById(appointmentId)
        .sort({ appointmentDate: 1, slotTime: 1 })
        .select("customerName appointmentDate slotTime status service")
        .populate("user", "fullname email phone");

    return res
        .status(200)
        .json(new apiResponse(200, appointments, 'Appointments fetched successfully'));
});

const deleteAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    // Check ownership: only the user who owns this appointment can delete it
    if (appointment.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    await appointment.deleteOne();
    return res.status(200).json(new apiResponse(200, {}, 'Appointment deleted successfully'));
});


export { getMyAppointments, createAppointment, updateAppointment, getAppointmentsForUser, deleteAppointment }
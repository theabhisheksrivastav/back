import { Router } from "express";
import { 
    getMyAppointments,
    getMyAppointmentsForUser,
    createAppointment,
    updateAppointmentStatus
} from "../controllers/appointment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/my-appointments").get(verifyJWT, getMyAppointments);
router.route("/public/:appointmentId").get(getMyAppointmentsForUser);
router.route("/:id/status").patch(verifyJWT, updateAppointmentStatus);
router.route("/").post(createAppointment);


export default router;

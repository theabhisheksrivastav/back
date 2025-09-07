import { Router } from "express";
import { 
    getAppointments,
    getAppointmentsForCustomers,
    createAppointment,
    updateAppointmentStatus
} from "../controllers/appointment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secured Routes for business owners
router.route("/business/:businessId").get(verifyJWT, getAppointments);
router.route("/:id/status").patch(verifyJWT, updateAppointmentStatus);

// Public Routes for customers
router.route("/customer/:businessId").get(getAppointmentsForCustomers);
router.route("/").post(createAppointment);

export default router;

import { Router } from "express";
import { 
    getMyAppointments,
    getAppointmentsForUser,
    createAppointment,
    updateAppointment,
    deleteAppointment
} from "../controllers/appointment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/my-appointments").get(verifyJWT, getMyAppointments);
router.route("/public/:appointmentId").get(getAppointmentsForUser);
router.route("/:id/update").patch(verifyJWT, updateAppointment);
router.route("/").post(createAppointment);
router.route("/:id").delete(verifyJWT, deleteAppointment);


export default router;

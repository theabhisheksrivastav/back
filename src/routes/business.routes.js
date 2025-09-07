import { Router } from "express";
import { 
    createBusiness,
    getBusinesses,
    getBusinessById,
    updateBusiness,
    deleteBusiness,
    findBusinessByCategory
} from "../controllers/business.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secured Routes
router.route("/").post(verifyJWT, createBusiness);
router.route("/").get(verifyJWT, getBusinesses);
router.route("/:id").get(verifyJWT, getBusinessById);
router.route("/:id").patch(verifyJWT, updateBusiness);
router.route("/:id").delete(verifyJWT, deleteBusiness);

// Public Route - find businesses by category
router.route("/category/:category").get(findBusinessByCategory);

export default router;

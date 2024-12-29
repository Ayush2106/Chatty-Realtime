import express from "express";
import {
  loginController,
  logoutController,
  signupController,
  updateProfileController,
  checkAuthController
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);

router.put('/update-profile', protectRoute, updateProfileController);
router.get('/check',protectRoute , checkAuthController)

export default router;

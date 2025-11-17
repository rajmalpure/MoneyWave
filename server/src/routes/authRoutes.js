import express from "express";
import { body } from "express-validator";
import { login, register, getProfile } from "../controllers/authController.js";
import { handleValidation } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    handleValidation,
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    handleValidation,
  ],
  login
);

router.get("/profile", authenticate, getProfile);

export default router;


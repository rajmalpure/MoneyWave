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

// Friendly GET responses for health checks / browsers
router.get("/register", (req, res) => {
  res.json({
    message:
      "Money Manager API – submit a POST request to /auth/register with name, email, password.",
  });
});

router.get("/login", (req, res) => {
  res.json({
    message:
      "Money Manager API – submit a POST request to /auth/login with email and password.",
  });
});

export default router;


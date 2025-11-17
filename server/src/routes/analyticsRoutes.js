import express from "express";
import {
  dashboard,
  categoryAnalytics,
  monthlyAnalytics,
} from "../controllers/analyticsController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/dashboard", dashboard);
router.get("/categories", categoryAnalytics);
router.get("/monthly", monthlyAnalytics);

export default router;


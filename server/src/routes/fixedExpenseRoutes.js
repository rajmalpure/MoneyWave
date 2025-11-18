import express from "express";
import { body, param } from "express-validator";
import {
  createFixedExpense,
  deleteFixedExpense,
  getFixedExpenses,
  updateFixedExpense,
} from "../controllers/fixedExpenseController.js";
import { authenticate } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";

const router = express.Router();

const fixedExpenseValidators = [
  body("title").notEmpty().withMessage("Title is required"),
  body("amount").isFloat({ min: 0 }).withMessage("Amount must be positive"),
  body("category").notEmpty().withMessage("Category is required"),
  body("dueDate").isISO8601().toDate().withMessage("Due date is required"),
  body("notes").optional().isString(),
  handleValidation,
];

router.use(authenticate);

router
  .route("/")
  .get(getFixedExpenses)
  .post(fixedExpenseValidators, createFixedExpense);

router
  .route("/:id")
  .put(
    [
      param("id").isMongoId(),
      body("title").optional().notEmpty(),
      body("amount").optional().isFloat({ min: 0 }),
      body("category").optional().notEmpty(),
      body("dueDate").optional().isISO8601().toDate(),
      body("notes").optional().isString(),
      handleValidation,
    ],
    updateFixedExpense
  )
  .delete(param("id").isMongoId(), handleValidation, deleteFixedExpense);

export default router;



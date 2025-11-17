import express from "express";
import { body, param } from "express-validator";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactions,
  updateTransaction,
} from "../controllers/transactionController.js";
import { authenticate } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";

const router = express.Router();

const transactionValidators = [
  body("title").notEmpty().withMessage("Title is required"),
  body("amount").isFloat({ min: 0 }).withMessage("Amount must be positive"),
  body("type")
    .isIn(["income", "expense"])
    .withMessage("Type must be income or expense"),
  body("category").notEmpty().withMessage("Category is required"),
  body("date").isISO8601().toDate().withMessage("Valid date is required"),
  handleValidation,
];

router.use(authenticate);

router
  .route("/")
  .get(getTransactions)
  .post(transactionValidators, createTransaction);

router
  .route("/:id")
  .get(param("id").isMongoId(), handleValidation, getTransaction)
  .put(
    [
      param("id").isMongoId(),
      body("title").optional().notEmpty(),
      body("amount").optional().isFloat({ min: 0 }),
      body("type").optional().isIn(["income", "expense"]),
      body("category").optional().notEmpty(),
      body("date").optional().isISO8601().toDate(),
      handleValidation,
    ],
    updateTransaction
  )
  .delete(param("id").isMongoId(), handleValidation, deleteTransaction);

export default router;


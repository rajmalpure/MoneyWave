import express from "express";
import { body, param } from "express-validator";
import {
  createGroup,
  getUserGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  leaveGroup,
  sendInvitation,
  getUserInvitations,
  acceptInvitation,
  rejectInvitation,
  createGroupTransaction,
  getGroupTransactions,
  getGroupBalances,
  deleteGroupTransaction,
} from "../controllers/groupController.js";
import { authenticate } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// ============ GROUP ROUTES ============

router
  .route("/")
  .get(getUserGroups)
  .post(
    [
      body("name").notEmpty().withMessage("Group name is required"),
      body("description").optional().isString(),
      body("memberUsernames").optional().isArray(),
      handleValidation,
    ],
    createGroup
  );

router
  .route("/:id")
  .get(param("id").isMongoId(), handleValidation, getGroupById)
  .put(
    [
      param("id").isMongoId(),
      body("name").optional().notEmpty(),
      body("description").optional().isString(),
      handleValidation,
    ],
    updateGroup
  )
  .delete(param("id").isMongoId(), handleValidation, deleteGroup);

router.post(
  "/:id/leave",
  param("id").isMongoId(),
  handleValidation,
  leaveGroup
);

// ============ INVITATION ROUTES ============

router.post(
  "/invite",
  [
    body("groupId").isMongoId().withMessage("Valid group ID is required"),
    body("username").notEmpty().withMessage("Username is required"),
    handleValidation,
  ],
  sendInvitation
);

router.get("/invitations", getUserInvitations);

router.post(
  "/invitations/:id/accept",
  param("id").isMongoId(),
  handleValidation,
  acceptInvitation
);

router.post(
  "/invitations/:id/reject",
  param("id").isMongoId(),
  handleValidation,
  rejectInvitation
);

// ============ GROUP TRANSACTION ROUTES ============

router
  .route("/:groupId/transactions")
  .get(param("groupId").isMongoId(), handleValidation, getGroupTransactions)
  .post(
    [
      param("groupId").isMongoId(),
      body("title").notEmpty().withMessage("Title is required"),
      body("amount").isFloat({ min: 0 }).withMessage("Amount must be positive"),
      body("paidBy").isMongoId().withMessage("Valid paidBy user ID is required"),
      body("participants").isArray().withMessage("Participants must be an array"),
      body("splitType")
        .isIn(["equal", "percentage", "custom"])
        .withMessage("Invalid split type"),
      body("splitDetails").optional().isArray(),
      body("date").optional().isISO8601().toDate(),
      body("notes").optional().isString(),
      body("category").optional().isString(),
      handleValidation,
    ],
    createGroupTransaction
  );

router.get(
  "/:groupId/balances",
  param("groupId").isMongoId(),
  handleValidation,
  getGroupBalances
);

router.delete(
  "/:groupId/transactions/:transactionId",
  [
    param("groupId").isMongoId(),
    param("transactionId").isMongoId(),
    handleValidation,
  ],
  deleteGroupTransaction
);

export default router;

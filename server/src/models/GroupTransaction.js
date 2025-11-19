import mongoose from "mongoose";

const splitDetailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { _id: false }
);

const groupTransactionSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    splitType: {
      type: String,
      enum: ["equal", "percentage", "custom"],
      default: "equal",
      required: true,
    },
    splitDetails: [splitDetailSchema],
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
groupTransactionSchema.index({ groupId: 1, date: -1 });
groupTransactionSchema.index({ paidBy: 1 });
groupTransactionSchema.index({ participants: 1 });

export const GroupTransaction = mongoose.model(
  "GroupTransaction",
  groupTransactionSchema
);

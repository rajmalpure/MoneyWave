import mongoose from "mongoose";

const groupInvitationSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate invitations
groupInvitationSchema.index(
  { receiverId: 1, groupId: 1, status: 1 },
  { unique: true }
);

export const GroupInvitation = mongoose.model(
  "GroupInvitation",
  groupInvitationSchema
);

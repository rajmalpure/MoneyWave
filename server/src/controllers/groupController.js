import { Group } from "../models/Group.js";
import { GroupInvitation } from "../models/GroupInvitation.js";
import { GroupTransaction } from "../models/GroupTransaction.js";
import { User } from "../models/User.js";

// ============ GROUP MANAGEMENT ============

export const createGroup = async (req, res, next) => {
  try {
    const { name, description, memberUsernames } = req.body;
    
    // Create group with creator as first member
    const group = await Group.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    // Send invitations to other members
    if (memberUsernames && memberUsernames.length > 0) {
      const users = await User.find({ 
        username: { $in: memberUsernames },
        _id: { $ne: req.user._id } // Exclude the creator
      });

      if (users.length > 0) {
        const invitations = users.map(user => ({
          senderId: req.user._id,
          receiverId: user._id,
          groupId: group._id,
          status: "pending",
        }));

        await GroupInvitation.insertMany(invitations);
      }
    }

    const populatedGroup = await Group.findById(group._id)
      .populate("createdBy", "name username email")
      .populate("members", "name username email");

    res.status(201).json(populatedGroup);
  } catch (error) {
    next(error);
  }
};

export const getUserGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({
      members: req.user._id,
      isActive: true,
    })
      .populate("createdBy", "name username email")
      .populate("members", "name username email")
      .sort({ updatedAt: -1 });

    res.json(groups);
  } catch (error) {
    next(error);
  }
};

export const getGroupById = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("createdBy", "name username email")
      .populate("members", "name username email");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a member
    if (!group.members.some(member => member._id.equals(req.user._id))) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    res.json(group);
  } catch (error) {
    next(error);
  }
};

export const updateGroup = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only creator can update group
    if (!group.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Only group creator can update the group" });
    }

    group.name = name || group.name;
    group.description = description || group.description;
    
    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate("createdBy", "name username email")
      .populate("members", "name username email");

    res.json(populatedGroup);
  } catch (error) {
    next(error);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only creator can delete group
    if (!group.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Only group creator can delete the group" });
    }

    group.isActive = false;
    await group.save();

    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const leaveGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Creator cannot leave, must delete group instead
    if (group.createdBy.equals(req.user._id)) {
      return res.status(400).json({ message: "Group creator cannot leave. Delete the group instead." });
    }

    group.members = group.members.filter(
      member => !member.equals(req.user._id)
    );
    
    await group.save();

    res.json({ message: "Left group successfully" });
  } catch (error) {
    next(error);
  }
};

// ============ INVITATION MANAGEMENT ============

export const sendInvitation = async (req, res, next) => {
  try {
    const { groupId, username } = req.body;

    // Find the user by username
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if group exists and user is a member
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.some(member => member.equals(req.user._id))) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    // Check if user is already a member
    if (group.members.some(member => member.equals(user._id))) {
      return res.status(400).json({ message: "User is already a member" });
    }

    // Check for existing pending invitation
    const existingInvitation = await GroupInvitation.findOne({
      receiverId: user._id,
      groupId,
      status: "pending",
    });

    if (existingInvitation) {
      return res.status(400).json({ message: "Invitation already sent" });
    }

    // Create invitation
    const invitation = await GroupInvitation.create({
      senderId: req.user._id,
      receiverId: user._id,
      groupId,
      status: "pending",
    });

    const populatedInvitation = await GroupInvitation.findById(invitation._id)
      .populate("senderId", "name username email")
      .populate("receiverId", "name username email")
      .populate("groupId", "name description");

    res.status(201).json(populatedInvitation);
  } catch (error) {
    next(error);
  }
};

export const getUserInvitations = async (req, res, next) => {
  try {
    const invitations = await GroupInvitation.find({
      receiverId: req.user._id,
      status: "pending",
    })
      .populate("senderId", "name username email")
      .populate("groupId", "name description")
      .sort({ createdAt: -1 });

    res.json(invitations);
  } catch (error) {
    next(error);
  }
};

export const acceptInvitation = async (req, res, next) => {
  try {
    const invitation = await GroupInvitation.findById(req.params.id);
    
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    // Verify the invitation is for the current user
    if (!invitation.receiverId.equals(req.user._id)) {
      return res.status(403).json({ message: "This invitation is not for you" });
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({ message: "Invitation already processed" });
    }

    // Add user to group
    const group = await Group.findById(invitation.groupId);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      await group.save();
    }

    // Update invitation status
    invitation.status = "accepted";
    await invitation.save();

    res.json({ message: "Invitation accepted successfully", group });
  } catch (error) {
    next(error);
  }
};

export const rejectInvitation = async (req, res, next) => {
  try {
    const invitation = await GroupInvitation.findById(req.params.id);
    
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    // Verify the invitation is for the current user
    if (!invitation.receiverId.equals(req.user._id)) {
      return res.status(403).json({ message: "This invitation is not for you" });
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({ message: "Invitation already processed" });
    }

    // Update invitation status
    invitation.status = "rejected";
    await invitation.save();

    res.json({ message: "Invitation rejected successfully" });
  } catch (error) {
    next(error);
  }
};

// ============ GROUP TRANSACTIONS ============

export const createGroupTransaction = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { title, amount, paidBy, participants, splitType, splitDetails, date, notes, category } = req.body;

    // Verify group exists and user is a member
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.some(member => member.equals(req.user._id))) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    // Calculate split details if not provided
    let calculatedSplitDetails = splitDetails;
    
    if (splitType === "equal" && participants && participants.length > 0) {
      const splitAmount = amount / participants.length;
      calculatedSplitDetails = participants.map(userId => ({
        userId,
        amount: splitAmount,
        percentage: (100 / participants.length),
      }));
    }

    // Create transaction
    const transaction = await GroupTransaction.create({
      groupId,
      title,
      amount,
      paidBy,
      participants: participants || group.members,
      splitType,
      splitDetails: calculatedSplitDetails,
      date: date || new Date(),
      notes,
      category,
      createdBy: req.user._id,
    });

    const populatedTransaction = await GroupTransaction.findById(transaction._id)
      .populate("paidBy", "name username email")
      .populate("participants", "name username email")
      .populate("createdBy", "name username email");

    res.status(201).json(populatedTransaction);
  } catch (error) {
    next(error);
  }
};

export const getGroupTransactions = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    // Verify user is a member of the group
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.some(member => member.equals(req.user._id))) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    const transactions = await GroupTransaction.find({ groupId })
      .populate("paidBy", "name username email")
      .populate("participants", "name username email")
      .populate("createdBy", "name username email")
      .sort({ date: -1, createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

export const getGroupBalances = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    // Verify user is a member of the group
    const group = await Group.findById(groupId).populate("members", "name username email");
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.some(member => member._id.equals(req.user._id))) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    // Get all transactions
    const transactions = await GroupTransaction.find({ groupId });

    // Calculate balances
    const balances = {};
    
    // Initialize balances for all members
    group.members.forEach(member => {
      balances[member._id.toString()] = {
        user: member,
        paid: 0,
        owes: 0,
        balance: 0,
      };
    });

    // Calculate from transactions
    transactions.forEach(transaction => {
      const paidById = transaction.paidBy.toString();
      
      // Add to paid amount
      if (balances[paidById]) {
        balances[paidById].paid += transaction.amount;
      }

      // Calculate what each participant owes
      transaction.splitDetails.forEach(split => {
        const userId = split.userId.toString();
        if (balances[userId]) {
          balances[userId].owes += split.amount;
        }
      });
    });

    // Calculate net balance
    Object.keys(balances).forEach(userId => {
      balances[userId].balance = balances[userId].paid - balances[userId].owes;
    });

    res.json(Object.values(balances));
  } catch (error) {
    next(error);
  }
};

export const deleteGroupTransaction = async (req, res, next) => {
  try {
    const { groupId, transactionId } = req.params;

    const transaction = await GroupTransaction.findOne({
      _id: transactionId,
      groupId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Only creator can delete
    if (!transaction.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Only transaction creator can delete it" });
    }

    await GroupTransaction.findByIdAndDelete(transactionId);

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    next(error);
  }
};

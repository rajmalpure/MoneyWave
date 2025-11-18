import { FixedExpense } from "../models/FixedExpense.js";

export const createFixedExpense = async (req, res, next) => {
  try {
    const expense = await FixedExpense.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

export const getFixedExpenses = async (req, res, next) => {
  try {
    const expenses = await FixedExpense.find({
      userId: req.user._id,
    }).sort({ dueDate: 1, createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    next(error);
  }
};

export const updateFixedExpense = async (req, res, next) => {
  try {
    const expense = await FixedExpense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expense) {
      return res.status(404).json({ message: "Fixed expense not found" });
    }

    res.json(expense);
  } catch (error) {
    next(error);
  }
};

export const deleteFixedExpense = async (req, res, next) => {
  try {
    const expense = await FixedExpense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Fixed expense not found" });
    }

    res.json({ message: "Fixed expense deleted" });
  } catch (error) {
    next(error);
  }
};



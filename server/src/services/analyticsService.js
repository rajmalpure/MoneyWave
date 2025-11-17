import { Transaction } from "../models/Transaction.js";

export const getDashboardStats = async (userId) => {
  const baseMatch = { userId };

  const [summary] = await Transaction.aggregate([
    { $match: baseMatch },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        totalExpense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
      },
    },
  ]);

  const recent = await Transaction.find(baseMatch)
    .sort({ date: -1 })
    .limit(5);

  return {
    totalIncome: summary?.totalIncome || 0,
    totalExpense: summary?.totalExpense || 0,
    balance: (summary?.totalIncome || 0) - (summary?.totalExpense || 0),
    recent,
  };
};

export const getCategoryBreakdown = async (userId) => {
  const data = await Transaction.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
    { $project: { category: "$_id", total: 1, _id: 0 } },
  ]);

  return data;
};

export const getMonthlyTrends = async (userId) => {
  const data = await Transaction.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $project: {
        year: "$_id.year",
        month: "$_id.month",
        income: 1,
        expense: 1,
        _id: 0,
      },
    },
    { $sort: { year: 1, month: 1 } },
  ]);

  return data;
};


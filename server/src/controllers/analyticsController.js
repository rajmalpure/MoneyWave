import {
  getDashboardStats,
  getCategoryBreakdown,
  getMonthlyTrends,
} from "../services/analyticsService.js";

export const dashboard = async (req, res, next) => {
  try {
    const stats = await getDashboardStats(req.user._id);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const categoryAnalytics = async (req, res, next) => {
  try {
    const data = await getCategoryBreakdown(req.user._id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const monthlyAnalytics = async (req, res, next) => {
  try {
    const data = await getMonthlyTrends(req.user._id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};


const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getDailyAnalytics,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getStreakAnalytics
} = require("../controllers/analyticsController");

/*
  Protect all analytics routes
*/
router.use(authMiddleware);

/*
  DAILY
  GET /api/analytics/daily/:date
*/
router.get("/daily/:date", getDailyAnalytics);

/*
  WEEKLY
  GET /api/analytics/weekly
*/
router.get("/weekly", getWeeklyAnalytics);

/*
  MONTHLY
  GET /api/analytics/monthly
*/
router.get("/monthly", getMonthlyAnalytics);

/*
  STREAK
  GET /api/analytics/streak
*/
router.get("/streak", getStreakAnalytics);

module.exports = router;
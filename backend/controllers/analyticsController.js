const Task = require("../models/Task");
const TaskStatus = require("../models/TaskStatus");

/*
 DAILY ANALYTICS
*/
const getDailyAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { date } = req.params;

    const totalTasks = await Task.countDocuments({ userId });

    const completedTasks = await TaskStatus.countDocuments({
      userId,
      date,
      completed: true
    });

    const pendingTasks = totalTasks - completedTasks;

    const completionPercentage =
      totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0;

    res.status(200).json({
      success: true,
      analytics: {
        date,
        totalTasks,
        completedTasks,
        pendingTasks,
        completionPercentage
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
 WEEKLY ANALYTICS
*/
const getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;

    const tasks = await Task.find({ userId });
    const totalTasks = tasks.length;

    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const date = d.toISOString().split("T")[0];

      const completed = await TaskStatus.countDocuments({
        userId,
        date,
        completed: true
      });

      const percentage =
        totalTasks > 0
          ? Math.round((completed / totalTasks) * 100)
          : 0;

      weekData.push({
        date,
        completed,
        totalTasks,
        percentage
      });
    }

    res.status(200).json({
      success: true,
      analytics: weekData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
 MONTHLY ANALYTICS
*/
const getMonthlyAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;

    const tasks = await Task.find({ userId });
    const totalTasks = tasks.length;

    const today = new Date();
    const monthData = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const date = d.toISOString().split("T")[0];

      const completed = await TaskStatus.countDocuments({
        userId,
        date,
        completed: true
      });

      const percentage =
        totalTasks > 0
          ? Math.round((completed / totalTasks) * 100)
          : 0;

      monthData.push({
        date,
        completed,
        totalTasks,
        percentage
      });
    }

    res.status(200).json({
      success: true,
      analytics: monthData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
 STREAK ANALYTICS
*/
const getStreakAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;

    const tasks = await Task.find({ userId });
    const totalTasks = tasks.length;

    if (totalTasks === 0) {
      return res.status(200).json({
        success: true,
        streak: 0
      });
    }

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const date = d.toISOString().split("T")[0];

      const completed = await TaskStatus.countDocuments({
        userId,
        date,
        completed: true
      });

      if (completed > 0) {
        streak++;
      } else {
        break;
      }
    }

    res.status(200).json({
      success: true,
      streak
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDailyAnalytics,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getStreakAnalytics
};
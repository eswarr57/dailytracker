const Task = require("../models/Task");
const TaskStatus = require("../models/TaskStatus");

/*
 CREATE TASK
*/
const createTask = async (req, res) => {
  try {
    const { taskName } = req.body;
    const userId = req.user.userId;

    if (!taskName || taskName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Task name is required"
      });
    }

    const task = await Task.create({
      userId,
      taskName
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
 GET ALL TASKS + STATUSES
*/
const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.userId;

    const tasks = await Task.find({ userId }).sort({ createdAt: 1 });

    const statuses = await TaskStatus.find({ userId });

    res.status(200).json({
      success: true,
      tasks,
      statuses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
 UPDATE TASK NAME
*/
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { taskName } = req.body;
    const userId = req.user.userId;

    if (!taskName || taskName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Task name cannot be empty"
      });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: taskId,
        userId
      },
      {
        taskName
      },
      {
        new: true
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
 DELETE TASK
*/
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      userId
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // delete all checkbox history for this task
    await TaskStatus.deleteMany({
      taskId,
      userId
    });

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
 TOGGLE CHECKBOX STATUS
*/
const toggleTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { date, completed } = req.body;
    const userId = req.user.userId;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required"
      });
    }

    // verify task belongs to user
    const task = await Task.findOne({
      _id: taskId,
      userId
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const status = await TaskStatus.findOneAndUpdate(
      {
        taskId,
        userId,
        date
      },
      {
        completed
      },
      {
        upsert: true,
        new: true
      }
    );

    res.status(200).json({
      success: true,
      message: "Task status updated",
      status
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
 GET TASK STATUS BY DATE
*/
const getTaskStatusByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user.userId;

    const statuses = await TaskStatus.find({
      userId,
      date
    });

    res.status(200).json({
      success: true,
      statuses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  getTaskStatusByDate
};
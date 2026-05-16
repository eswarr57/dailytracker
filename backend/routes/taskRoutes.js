const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  getTaskStatusByDate
} = require("../controllers/taskController");

/*
  All task routes are protected
*/
router.use(authMiddleware);

/*
  CREATE TASK
  POST /api/tasks
*/
router.post("/", createTask);

/*
  GET ALL TASKS + ALL STATUSES
  GET /api/tasks
*/
router.get("/", getAllTasks);

/*
  UPDATE TASK NAME
  PUT /api/tasks/:taskId
*/
router.put("/:taskId", updateTask);

/*
  DELETE TASK
  DELETE /api/tasks/:taskId
*/
router.delete("/:taskId", deleteTask);

/*
  TOGGLE CHECKBOX
  PUT /api/tasks/status/:taskId
*/
router.put("/status/:taskId", toggleTaskStatus);

/*
  GET STATUSES BY DATE
  GET /api/tasks/status/:date
*/
router.get("/status/:date", getTaskStatusByDate);

module.exports = router;
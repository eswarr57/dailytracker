const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  getTaskStatusByDate,
  deleteTaskStatus
} = require("../controllers/taskController");

/*
 PROTECT ALL ROUTES
*/
router.use(authMiddleware);

/*
 TASK ROUTES
*/
router.post("/", createTask);
router.get("/", getAllTasks);

/*
 STATUS ROUTES
*/
router.put("/status/:taskId", toggleTaskStatus);
router.delete("/status/:taskId", deleteTaskStatus);
router.get("/status/:date", getTaskStatusByDate);

/*
 TASK CRUD
*/
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

module.exports = router;
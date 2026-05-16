require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

/*
  DATABASE CONNECTION
*/
connectDB();

/*
  MIDDLEWARE
*/
app.use(cors({
  origin: "https://dailytracker-omega.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
  HEALTH CHECK
*/
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Task Tracker API is running"
  });
});

/*
  ROUTES
*/
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes);

/*
  404 HANDLER
*/
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/*
  SERVER START
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
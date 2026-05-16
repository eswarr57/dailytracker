const mongoose = require("mongoose");

const taskStatusSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    date: {
      type: String,
      required: true
    },

    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate entries for same task on same date
taskStatusSchema.index({ taskId: 1, date: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("TaskStatus", taskStatusSchema);
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    taskName: {
      type: String,
      required: [true, "Task name is required"],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", taskSchema);
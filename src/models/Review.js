const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

reviewSchema.index(
  { course_id: 1, student_id: 1 },
  { unique: true }
);

module.exports = mongoose.model("Review", reviewSchema);

const mongoose = require("mongoose");

const syllabusSchema = new mongoose.Schema({
  week: Number,
  topic: String,
  content: String
}, { _id: false });

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  syllabus: [syllabusSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Course", courseSchema);

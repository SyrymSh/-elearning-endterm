const Course = require("../models/Course");

/**
 * GET /courses
 * Anyone can view courses
 */
exports.getAllCourses = async (req, res) => {
  const courses = await Course.find().populate("instructor_id", "name");
  res.json(courses);
};

/**
 * GET /courses/:id
 * Course details + embedded syllabus
 */
exports.getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("instructor_id", "name");

  if (!course) return res.status(404).send("Course not found");
  res.json(course);
};

/**
 * POST /courses
 * Instructor creates course
 */
exports.createCourse = async (req, res) => {
  const { title, description } = req.body;

  const course = await Course.create({
    title,
    description,
    instructor_id: req.session.user.id,
    syllabus: []
  });

  // ✅ If coming from browser form → redirect
  const wantsHTML = req.headers.accept && req.headers.accept.includes("text/html");
  if (wantsHTML) {
    return res.redirect("/instructor/courses");
  }

  // API / Postman fallback
  res.status(201).json(course);
};


/**
 * PATCH /courses/:id
 * Advanced updates:
 * - update title/description
 * - add lesson ($push)
 * - remove lesson ($pull)
 */
exports.updateCourse = async (req, res) => {
  const { title, description, addLesson, removeWeek } = req.body;

  const update = {};

  if (title) update.title = title;
  if (description) update.description = description;

  if (addLesson) {
    // ensure week is a number
    if (addLesson.week) addLesson.week = Number(addLesson.week);
    update.$push = { syllabus: addLesson };
  }

  if (removeWeek) {
    update.$pull = { syllabus: { week: Number(removeWeek) } };
  }

  const course = await Course.findOneAndUpdate(
    { _id: req.params.id, instructor_id: req.session.user.id },
    update,
    { new: true }
  );

  if (!course) return res.status(404).send("Course not found or forbidden");

  const wantsHTML = req.headers.accept && req.headers.accept.includes("text/html");
  if (wantsHTML) return res.redirect(`/instructor/edit-course/${course._id}`);

  res.json(course);
};


/**
 * DELETE /courses/:id
 */
exports.deleteCourse = async (req, res) => {
  const result = await Course.deleteOne({
    _id: req.params.id,
    instructor_id: req.session.user.id
  });

  if (!result.deletedCount)
    return res.status(404).send("Course not found or forbidden");

  res.send("Course deleted");
};

const Enrollment = require("../models/Enrollment");

/**
 * POST /enrollments
 * Student enrolls in a course
 */
exports.enroll = async (req, res) => {
  const { course_id } = req.body;

  try {
    await Enrollment.create({
      student_id: req.session.user.id,
      course_id
    });

    const wantsHTML = req.headers.accept && req.headers.accept.includes("text/html");
    if (wantsHTML) {
      req.session.flash = { type: "success", msg: "Enrolled successfully." };
      return res.redirect("/my-enrollments");
    }

    res.status(201).send("Enrolled");
  } catch (err) {
    const wantsHTML = req.headers.accept && req.headers.accept.includes("text/html");
    if (wantsHTML) {
      req.session.flash = { type: "error", msg: "Already enrolled." };
      return res.redirect(`/courses/${course_id}`);
    }
    res.status(400).send("Already enrolled");
  }
};


/**
 * GET /enrollments/me
 * View my enrollments
 */
exports.myEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find({
    student_id: req.session.user.id
  }).populate("course_id", "title");

  res.json(enrollments);
};

/**
 * DELETE /enrollments/:id
 * Student drops a course
 */
exports.dropCourse = async (req, res) => {
  const result = await Enrollment.deleteOne({
    _id: req.params.id,
    student_id: req.session.user.id
  });

  if (!result.deletedCount) {
    return res.status(404).send("Enrollment not found");
  }

  const wantsHTML = req.headers.accept && req.headers.accept.includes("text/html");
  if (wantsHTML) {
    req.session.flash = { type: "success", msg: "Course dropped." };
    return res.redirect("/my-enrollments");
  }

  res.send("Course dropped");
};

/**
 * PATCH /enrollments/:id/progress
 * Advanced update using $inc and $set
 */
exports.updateProgress = async (req, res) => {
  const { increment } = req.body;

  if (!increment) {
    return res.status(400).send("increment required");
  }

  // increment progress
  const enrollment = await Enrollment.findOneAndUpdate(
    { _id: req.params.id, student_id: req.session.user.id },
    { $inc: { progress: increment } },
    { new: true }
  );

  if (!enrollment) return res.status(404).send("Not found");

  // auto-complete
  if (enrollment.progress >= 100 && enrollment.status !== "completed") {
    enrollment.status = "completed";
    enrollment.progress = 100;
    await enrollment.save();
  }

  const wantsHTML = req.headers.accept && req.headers.accept.includes("text/html");
  if (wantsHTML) {
    req.session.flash = { type: "success", msg: "Progress updated." };
    return res.redirect("/my-enrollments");
  }


  res.json(enrollment);

  
};

const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Review = require("../models/Review");

function consumeFlash(req) {
  const flash = req.session.flash || null;
  req.session.flash = null;
  return flash;
}

/**
 * 1) Home / Courses list
 */
router.get("/", async (req, res) => {
  const courses = await Course.find().populate("instructor_id", "name");
  res.render("courses", {
    user: req.session.user || null,
    courses,
    flash: consumeFlash(req)
  });
});


/**
 * 2) Course details
 */
router.get("/courses/:id", async (req, res) => {
  const course = await Course.findById(req.params.id).populate("instructor_id", "name");
  if (!course) return res.status(404).send("Course not found");

  const reviews = await Review.find({ course_id: course._id }).populate("student_id", "name");
  res.render("courseDetails", { user: req.session.user || null, course, reviews, flash: consumeFlash(req) });
});

/**
 * 3) Auth page
 */
router.get("/login", (req, res) => {
  res.render("login", { user: req.session.user || null, error: null, flash: consumeFlash(req) });
});

/**
 * 4) My enrollments page
 */
router.get("/my-enrollments", requireAuth, async (req, res) => {
  const enrollments = await Enrollment.find({ student_id: req.session.user.id })
    .populate("course_id", "title");
  res.render("myEnrollments", { user: req.session.user, enrollments, flash: consumeFlash(req) });
});

/**
 * 5) Instructor: my courses page
 */
router.get("/instructor/courses", requireAuth, async (req, res) => {
  if (req.session.user.role !== "instructor") return res.status(403).send("Forbidden");

  const courses = await Course.find({ instructor_id: req.session.user.id });
  res.render("instructorCourses", { user: req.session.user, courses, flash: consumeFlash(req) });
});

/**
 * 6) Instructor: create course form
 */
router.get("/instructor/create-course", requireAuth, (req, res) => {
  if (req.session.user.role !== "instructor") return res.status(403).send("Forbidden");
  res.render("createCourse", { user: req.session.user, flash: consumeFlash(req) });
});

/** 7) Analytics page
 */
router.get("/analytics", async (req, res) => {
  const data = await Enrollment.aggregate([
    { $group: { _id: "$course_id", totalStudents: { $sum: 1 }, avgProgress: { $avg: "$progress" } } },
    { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
    { $unwind: "$course" },
    { $project: { _id: 0, title: "$course.title", totalStudents: 1, avgProgress: { $round: ["$avgProgress", 1] } } },
    { $sort: { totalStudents: -1 } },
    { $limit: 10 }
  ]);

  res.render("analytics", { user: req.session.user || null, data, flash: consumeFlash(req) });
});

router.get("/instructor/edit-course/:id", requireAuth, async (req, res) => {
  if (req.session.user.role !== "instructor") return res.status(403).send("Forbidden");

  const course = await Course.findOne({
    _id: req.params.id,
    instructor_id: req.session.user.id
  });

  if (!course) return res.status(404).send("Course not found");

  res.render("editCourse", {
    user: req.session.user,
    course,
    flash: consumeFlash(req)
  });
});


module.exports = router;

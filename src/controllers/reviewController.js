const Review = require("../models/Review");

/**
 * POST /reviews
 * Student adds review
 */
exports.addReview = async (req, res) => {
  const { course_id, rating, comment } = req.body;

  if (!course_id || !rating) {
    return res.status(400).send("course_id and rating required");
  }

  const review = await Review.create({
    student_id: req.session.user.id,
    course_id,
    rating,
    comment
  });

  const wantsHTML = req.headers.accept && req.headers.accept.includes("text/html");
  if (wantsHTML) {
    req.session.flash = { type: "success", msg: "Review added." };
    return res.redirect(`/courses/${course_id}`);
  }

  res.status(201).json(review);
};

/**
 * GET /reviews/course/:courseId
 * View course reviews
 */
exports.getCourseReviews = async (req, res) => {
  const reviews = await Review.find({
    course_id: req.params.courseId
  }).populate("student_id", "name");

  res.json(reviews);
};

/**
 * DELETE /reviews/:id
 * Student deletes own review
 */
exports.deleteReview = async (req, res) => {
  const result = await Review.deleteOne({
    _id: req.params.id,
    student_id: req.session.user.id
  });

  if (!result.deletedCount) {
    return res.status(404).send("Review not found");
  }

  res.send("Review deleted");
};

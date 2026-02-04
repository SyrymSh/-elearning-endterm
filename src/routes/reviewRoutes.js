const router = require("express").Router();
const c = require("../controllers/reviewController");
const { requireAuth } = require("../middleware/auth");

router.post("/", requireAuth, c.addReview);
router.get("/course/:courseId", c.getCourseReviews);
router.delete("/:id", requireAuth, c.deleteReview);

module.exports = router;

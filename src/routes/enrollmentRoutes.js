const router = require("express").Router();
const c = require("../controllers/enrollmentController");
const { requireAuth } = require("../middleware/auth");

router.post("/", requireAuth, c.enroll);
router.get("/me", requireAuth, c.myEnrollments);
router.patch("/:id/progress", requireAuth, c.updateProgress);
router.delete("/:id", requireAuth, c.dropCourse);

module.exports = router;

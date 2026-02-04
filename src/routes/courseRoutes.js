const router = require("express").Router();
const c = require("../controllers/courseController");
const { requireAuth, requireInstructor } = require("../middleware/auth");

router.get("/", c.getAllCourses);
router.get("/:id", c.getCourseById);

router.post("/", requireAuth, requireInstructor, c.createCourse);
router.patch("/:id", requireAuth, requireInstructor, c.updateCourse);
router.delete("/:id", requireAuth, requireInstructor, c.deleteCourse);

module.exports = router;

const router = require("express").Router();
const c = require("../controllers/analyticsController");

router.get("/top-courses", c.topCourses);

module.exports = router;

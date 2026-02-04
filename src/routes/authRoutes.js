const router = require("express").Router();
const c = require("../controllers/authController");

router.post("/register", c.register);
router.post("/login", c.login);
router.post("/logout", c.logout);
router.get("/me", (req, res) => {
  res.json((req.session && req.session.user) ? req.session.user : null);
});

module.exports = router;

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized");
  }
  next();
}

function requireInstructor(req, res, next) {
  if (req.session.user.role !== "instructor") {
    return res.status(403).send("Forbidden");
  }
  next();
}

module.exports = { requireAuth, requireInstructor };

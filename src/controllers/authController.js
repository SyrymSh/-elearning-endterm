const bcrypt = require("bcrypt");
const User = require("../models/User");

function setFlash(req, type, msg) {
  req.session.flash = { type, msg };
}

exports.register = async (req, res) => {
  const { name, email, password, role, instructorCode } = req.body;

  if (!name || !email || !password || !role) {
    setFlash(req, "error", "All fields are required.");
    return res.redirect("/login");
  }

  if (!["student", "instructor"].includes(role)) {
    setFlash(req, "error", "Invalid role.");
    return res.redirect("/login");
  }

  if (role === "instructor") {
    if (!process.env.INSTRUCTOR_CODE) {
      setFlash(req, "error", "Instructor registration is disabled (missing code).");
      return res.redirect("/login");
    }
    if (instructorCode !== process.env.INSTRUCTOR_CODE) {
      setFlash(req, "error", "Invalid instructor code.");
      return res.redirect("/login");
    }
  }

  const exists = await User.findOne({ email });
  if (exists) {
    setFlash(req, "error", "Email is already registered.");
    return res.redirect("/login");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, passwordHash, role });

  // auto-login after register
  req.session.user = { id: newUser._id, role: newUser.role };
  setFlash(req, "success", "Registration successful. Welcome!");
  res.redirect("/");
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    setFlash(req, "error", "Email and password are required.");
    return res.redirect("/login");
  }

  const user = await User.findOne({ email });
  if (!user) {
    setFlash(req, "error", "Invalid credentials.");
    return res.redirect("/login");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    setFlash(req, "error", "Invalid credentials.");
    return res.redirect("/login");
  }

  req.session.user = { id: user._id, role: user.role };
  setFlash(req, "success", "Login successful.");
  res.redirect("/");
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/"));
};

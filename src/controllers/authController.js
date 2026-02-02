const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({ name, email, passwordHash, role });
  res.send("Registered");
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).send("Invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).send("Invalid credentials");

  req.session.user = {
    id: user._id,
    role: user.role
  };

  res.send("Logged in");
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.send("Logged out");
};

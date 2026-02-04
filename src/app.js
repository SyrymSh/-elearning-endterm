const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const methodOverride = require("method-override");
const path = require("path");

const app = express();
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const pageRoutes = require("./routes/pageRoutes");

/* -------------------- 1) BODY PARSING -------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* -------------------- 2) METHOD OVERRIDE -------------------- */
app.use(methodOverride("_method"));

/* -------------------- 3) SESSION -------------------- */
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    })
  })
);

/* -------------------- 4) VIEW ENGINE (EJS) -------------------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* -------------------- 5) STATIC FILES -------------------- */
app.use(express.static(path.join(__dirname, "public")));

/* -------------------- 6) API ROUTES -------------------- */
// API (JSON)
app.use("/auth", authRoutes); // keep auth as is
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/analytics", analyticsRoutes);

// Pages (HTML)
app.use("/", pageRoutes);

module.exports = app;

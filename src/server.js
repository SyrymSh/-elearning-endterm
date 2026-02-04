require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server running");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

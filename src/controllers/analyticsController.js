const Enrollment = require("../models/Enrollment");

exports.topCourses = async (req, res) => {
  const data = await Enrollment.aggregate([
    {
      $group: {
        _id: "$course_id",
        totalStudents: { $sum: 1 },
        avgProgress: { $avg: "$progress" }
      }
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course"
      }
    },
    { $unwind: "$course" },
    {
      $project: {
        _id: 0,
        courseId: "$course._id",
        title: "$course.title",
        totalStudents: 1,
        avgProgress: { $round: ["$avgProgress", 1] }
      }
    },
    { $sort: { totalStudents: -1 } },
    { $limit: 10 }
  ]);

  res.json(data);
};

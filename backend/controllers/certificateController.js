import User from "../models/User.js";
import Course from "../models/Course.js";

const generateCertificate = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.json({ message: "User or Course not found." });
    }

    // Check student is enrolled
    const enrolled = user.enrolledCourses.some(
      (id) => id.toString() === courseId
    );
    if (!enrolled) {
      return res.json({ message: "Not enrolled in this course." });
    }

    // Check student passed the quiz
    const passed = user.quizPassed.some((id) => id.toString() === courseId);
    if (!passed) {
      return res.json({ message: "You must pass the quiz to get a certificate." });
    }

    return res.json({
      studentName: user.name,
      courseName: course.title,
      teacherName: course.teacherName,
      issuedDate: new Date().toDateString(),
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Server error." });
  }
};

export default generateCertificate;
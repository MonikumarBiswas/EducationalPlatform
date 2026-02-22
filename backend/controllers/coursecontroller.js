import Course from "../models/Course.js";
import User from "../models/User.js";
import multer from "multer";

// Setup __dirname for ES modules
const storage = multer.diskStorage({
  destination: "uploads/", 
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

export const uploadMiddleware = multer({ storage }).single("thumbnail");




const upload = async (req, res) => {
  const userID = req.headers["user-id"];

  try {
    const { title, description, price, videoLink, materials, quiz } = req.body;

    if (!title || !description || !price || !videoLink) {
      return res.json({ message: "All fields are required." });
    }

    const teacher = await User.findById(userID);
    if (!teacher) {
      return res.json({ message: "User not found." });
    }

    // Parse quiz if provided as JSON string
    let quizData = [];
    if (quiz) {
      try {
        quizData = typeof quiz === "string" ? JSON.parse(quiz) : quiz;
      } catch (e) {
        quizData = [];
      }
    }

    // Thumbnail path from multer
    const thumbnailPath = req.file
      ? "uploads/" + req.file.filename
      : "";

    const course = await Course.create({
      title,
      description,
      price,
      videoLink,
      materials,
      thumbnail: thumbnailPath,
      quiz: quizData,
      teacherId: teacher._id,
      teacherName: teacher.name,
      teacherEmail: teacher.email,
    });

    const UPLOAD_BONUS = 500;

    await User.findByIdAndUpdate(
      teacher._id,
      {
        $push: { uploadedCourses: course._id },
        $inc: { teacherEarnings: UPLOAD_BONUS },
      },
      { new: true }
    );

    return res.json({
      message: "Course uploaded successfully.",
      course: {
        _id: teacher._id,
        name: course.title,
        teacherName: teacher.name,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Something went wrong." });
  }
};

const allcourses = async (req, res) => {
  try {
    const courses = await Course.find();
    return res.json(courses);
  } catch (error) {
    console.log(error);
    res.json({ message: "Courses not found." });
  }
};

export default { upload, allcourses };
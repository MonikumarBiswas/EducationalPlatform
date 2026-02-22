import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import usercontroller from "./controllers/usercontroller.js";
import bodyParser from "body-parser";
import dashboardcontroller from "./controllers/dashboardcontroller.js";
import coursecontroller, { uploadMiddleware } from "./controllers/coursecontroller.js";
import teachercontroller from "./controllers/teachercontroller.js";
import enroll from "./controllers/enrollcontroller.js";
import admincontroller from "./controllers/admincontroller.js";
import showDashboard from "./controllers/showDashboard.js";
import quizcontroller from "./controllers/quizcontroller.js";
import generateCertificate from "./controllers/certificateController.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();
connectDB();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Serve uploaded thumbnails
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Auth routes
app.post("/signup", usercontroller.signupUser);
app.post("/login", usercontroller.loginUser);

// Course routes
app.post("/upload", uploadMiddleware, coursecontroller.upload);
app.get("/course", coursecontroller.allcourses);

// Dashboard routes
app.get("/dashboard", dashboardcontroller);
app.get("/teacher-dashboard", teachercontroller);
app.get("/admin-dashboard", admincontroller);
app.get("/selectdashboard", showDashboard);

// Enroll
app.post("/enroll/:id", enroll);

// Quiz routes
app.post("/quiz/:courseId", quizcontroller.uploadQuiz);      
app.get("/quiz/:courseId", quizcontroller.getQuiz);           
app.post("/quiz/:courseId/submit", quizcontroller.submitQuiz); 

// Certificate
app.get("/certificate/:userId/:courseId", generateCertificate);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
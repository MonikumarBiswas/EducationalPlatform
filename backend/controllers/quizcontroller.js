import Course from "../models/Course.js";
import User from "../models/User.js";

// Teacher uploads quiz for a course
const uploadQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { questions } = req.body; 

    if (!questions || questions.length !== 5) {
      return res.json({ message: "Exactly 5 questions are required." });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.json({ message: "Course not found." });

    course.quiz = questions;
    await course.save();

    return res.json({ message: "Quiz uploaded successfully." });
  } catch (error) {
    console.log(error);
    res.json({ message: "Something went wrong." });
  }
};

// Get quiz questions for a course (without correct answers)
const getQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.json({ message: "Course not found." });

    if (!course.quiz || course.quiz.length === 0) {
      return res.json({ message: "No quiz available for this course." });
    }

    // Strip out the answer field before sending to student
    const questions = course.quiz.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    return res.json({ questions });
  } catch (error) {
    console.log(error);
    res.json({ message: "Something went wrong." });
  }
};



// Student submits quiz answers
const submitQuiz = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userID = req.headers["user-id"];
    const { answers } = req.body; // array of 5 selected option indices

    const user = await User.findById(userID);
    if (!user) return res.json({ message: "User not found." });

    // Only students can take quiz
    if (user.role !== "student") {
      return res.json({ message: "Only students can take the quiz." });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.json({ message: "Course not found." });

    if (!course.quiz || course.quiz.length === 0) {
      return res.json({ message: "No quiz found for this course." });
    }

    if (!answers || answers.length !== 5) {
      return res.json({ message: "Please answer all 5 questions." });
    }

    // Grade the quiz
    let correct = 0;
    course.quiz.forEach((q, i) => {
      if (parseInt(answers[i]) === q.answer) {
        correct++;
      }
    });

    const score = (correct / 5) * 100;
  
    let passed = false ; 
    if( score >= 70){
      passed = true ; 
    }

    // If passed and not already in quizPassed, add it
    if (passed) {
      const alreadyPassed = user.quizPassed.some(
        (id) => id.toString() === courseId
      );
      if (!alreadyPassed) {
        await User.findByIdAndUpdate(
          userID,
          { $push: { quizPassed: courseId } },
          { new: true }
        );
      }
    }

    return res.json({
      passed,
      score,
      correct,
      total: 5,
      message: passed
        ? `Congratulations! You passed with ${correct}/5 correct answers.`
        : `You scored ${correct}/5. You need 70% to pass. Try again!`,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Something went wrong." });
  }
};

export default { uploadQuiz, getQuiz, submitQuiz };

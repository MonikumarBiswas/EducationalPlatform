import express from "express" ;
import dotenv from "dotenv" ;
import connectDB from "./config/db.js";
import cors from "cors";
import usercontroller from "./controllers/usercontroller.js";
import bodyParser from "body-parser";
import dashboardcontroller from "./controllers/dashboardcontroller.js";
import coursecontroller from "./controllers/coursecontroller.js";
import teachercontroller from "./controllers/teachercontroller.js";
import enroll from "./controllers/enrollcontroller.js";
import admincontroller from "./controllers/admincontroller.js" ;
import showDashboard from "./controllers/showDashboard.js" ;


const app = express() ; 
dotenv.config() ;
connectDB() ;
const PORT = process.env.PORT  || 3000 ; 




app.use(express.json()) ; 
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));



app.post("/signup", usercontroller.signupUser );
app.post("/login", usercontroller.loginUser);
app.post("/upload" , coursecontroller.upload) ;

app.get("/dashboard" , dashboardcontroller) ;
app.get("/teacher-dashboard" , teachercontroller) ;
app.get("/admin-dashboard" , admincontroller) ;
app.get("/course" ,  coursecontroller.allcourses) ;
app.post("/enroll/:id", enroll) ;
app.get("/selectdashboard" , showDashboard) ;



app.listen((PORT) , () =>{
   console.log("server is running") ;
}) ; 
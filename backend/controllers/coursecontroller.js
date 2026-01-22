import Course  from "../models/Course.js";
import User from "../models/User.js";

const upload = async(req , res) =>{
 
  const userID = req.headers["user-id"] ;
   
    try {

        const {title , description , price , videoLink , materials} = req.body ;

        if(!title || !description || !price || !videoLink ){
          return res.json({ message : "All feilds are required."}); 
        }

        const teacher = await User.findById(userID) ;
       

        if(!teacher){
           return res.json({message: "user not find"}) ; 
        }

        const course = await Course.create({
           title , 
           description,
           price,
           videoLink ,
           materials ,
           teacherId : teacher._id ,
           teacherName : teacher.name ,
           teacherEmail : teacher.email
        })

      const UPLOAD_BONUS = 500 ; 

      await User.findByIdAndUpdate(teacher._id ,
      {
        $push: { uploadedCourses: course._id },
        $inc: { teacherEarnings: UPLOAD_BONUS }
      },
      { new: true }
    );

       return res.json({ message:"course uploaded succesfully.",
        course :{
          _id : teacher._id,
          name : course.title,
          teacherName : teacher.name 
        }
       });

    } catch(error){
       res.json({message: "something went wrong."})
    }
}


const allcourses = async(req,res) =>{

   try{
         const courses = await Course.find() ;
          return res.json(courses) ;
    }catch(error)
   {
      console.log(error) ;
      res.json({message : "courses not finding."})
   }

}

export default {upload , allcourses } ;
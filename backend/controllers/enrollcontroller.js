import Course from "../models/Course.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js" ;

const enroll = async(req , res)=>{

try{
 const userID = req.headers["user-id"] ;
  const user = await User.findById(userID) ;

  if(!user){
     return res.json({message: "user not found"}) ;
  }
  
  if(user.role != "student"){
    return res.json({message: "Only student can enroll the course "}) ;
  }


  const courseID = req.params.id ;
  
  const course = await Course.findById(courseID);

  let alreadyEnrolled = false;

 user.enrolledCourses.forEach((id) => {
  if (id.toString() === courseID) {
    alreadyEnrolled = true;
  }
 });

 if (alreadyEnrolled) {
  return res.json({ message: "Already enrolled the course." });
 }

  if(!course){
    return res.json({message: "Course is not found"}) ;
  }

  const price = course.price  ; 
  const bonus = price * 0.5 ; 

  const teacher = course.teacherId ;

   if(user.studentBalance < price ){
    return res.json({message: "Insufficient fund."})
   }

    await User.findByIdAndUpdate(
      teacher ,
       {
        $inc : {teacherEarnings : bonus }
        },
       {new : true}
    ) ; 

     await User.findByIdAndUpdate(
      user.id,
      {
        $push:{enrolledCourses : course._id},
        $inc :{studentBalance : -price}
      },

     {new : true}
    ) ;


     await User.findOneAndUpdate(
      { role: "admin" },
      {
        $push :{enrolledCourses : course._id},
        $inc :{adminEarnings : (price - bonus)}
      },
     {new : true}
    ) ;

 
    return res.json({
       message:"course enrolled successfully" 
    });

  }catch(error){
    return res.json("course is not enrolled, something went wrong.")
  }

}

export default enroll ; 
import User from "../models/User.js";


const teachercontroller = async(req , res) =>{
  
  const userID = req.headers["user-id"] ;

  if(!userID){
   return res.json({message: "Please login first" })
  }

  const user = await User.findById(userID).populate("uploadedCourses") ;
  

  if(!user){
   return res.json({message: "user not found ."});
  }

  if(user){
    
    return res.json({
       name : user.name ,
       email : user.email , 
       balance : user.teacherEarnings ,
       courses : user.uploadedCourses  

    }) ;
  }

   

}

export default teachercontroller ; 
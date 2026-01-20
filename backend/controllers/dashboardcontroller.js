import User from "../models/User.js";


const dashboardcontroller = async(req , res) =>{
  
  const userID = req.headers["user-id"] ;

  if(!userID){
   return res.json({message: "Please login first" })
  }

  const user = await User.findById(userID).populate("uploadedCourses") ;
  

  if(!user){
   return res.json({message: "user not found ."});
  }

  if(user){
    console.log(user) ;
    return res.json(user) ;
  }

   

}

export default dashboardcontroller ;
import User from "../models/User.js";


const showDashboard = async(req , res) =>{
  
  const userID = req.headers["user-id"] ;

  if(!userID){
   return res.json({message: "Please login first" })
  }

  const user = await User.findById(userID).populate("enrolledCourses") ;
  

  if(!user){
   return res.json({message: "user not found ."});
  }

  if(user){
    return res.json({ role : user.role} ) ;
  }

   

}




export default showDashboard ;
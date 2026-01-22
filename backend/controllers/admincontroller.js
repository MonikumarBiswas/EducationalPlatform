import User from "../models/User.js" ;
import Admin from "../models/Admin.js" ;
import enroll from "./enrollcontroller.js";


const admincontroller = async (req , res ) =>{

    try{
        const userId = req.headers["user-id"] ;

        const user = await User.findById(userId).populate("enrolledCourses") ;
        if(!user || user.role !== "admin"){
            return res.json({ message: "Access denied. Not an admin user."});
        }


        return  res.json({
            name: user.name,
            email: user.email,
            totalEarnings: user.adminEarnings,
            enrolledCourses: user.enrolledCourses
           
        }) ;
    }catch(err){
        console.error("Admin Dashboard error:", err);
        res.json({ message: "Failed to load admin dashboard", error: err.message });
    }

}

export default admincontroller ; 


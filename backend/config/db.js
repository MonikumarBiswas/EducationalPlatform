import mongoose from "mongoose";

const connectDB = async () =>{
   try{
        const conn = await mongoose.connect(process.env.MONGO_URI) ;
        console.log("mogodb data base is connected successfully");
   }
   catch(err){
      console.log("Mongodb connection failed" , err.message);
   }
};

export default connectDB ; 
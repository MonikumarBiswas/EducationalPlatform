import  mongoose  from "mongoose" ;

const adminSchema = new mongoose.Schema(
  {
   
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    
    totalEarnings: { type: Number, default: 0 }, 
    managedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
   
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
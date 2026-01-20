import  mongoose  from "mongoose" ;

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },

    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teacherName: { type: String, required: true },
    teacherEmail: { type: String, required: true },
    thumbnail: { type: String, default: "" }, 
    videoLink: { type: String, default: "" }, 
    materials:{ type : String, default: " "} , 


  createdBy: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User",
   } , 
 

    enrolledStudents: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        enrolledAt: { type: Date, default: Date.now },
      },
    
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;

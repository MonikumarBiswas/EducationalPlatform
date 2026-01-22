import User from "../models/User.js" ;

const signupUser = async (req, res) => {
  try {
    
    const { name, email, password, role } = req.body;
    

    if (!name || !email || !password)
      return res.json({ message: "All fields are required." });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.json({ message: "Email already taken." });

  const user = await User.create({
      name,
      email,
      password,
      role,
    });

  

    return res.json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err); 
    res.json({ message: "Signup failed", error: err.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.json({ message: "Email & password required." });

    const user = await User.findOne({ email });
    const pass = user.password ;
  

    if (!user)
      return res.json({ message: "User not found." });

   
    if ( password != pass )
      return res.json({ message: "Incorrect password." });


    
    // Send Response
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentBalance: user.studentBalance,
      teacherEarnings: user.teacherEarnings,
    });

  } catch (err) {
    res.json({ message: "Login failed", error: err.message });
  }
};


export default {signupUser , loginUser } ; 
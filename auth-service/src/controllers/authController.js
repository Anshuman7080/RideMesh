const User=require("../models/userSchema")
const bcrypt=require("bcrypt")
const {generateOtp}=require("../services/otpService")
const jwt = require('jsonwebtoken');
const { createRiderProfile } = require("../services/userService");
const {publishEvent}=require("../utils/eventBus")
const {redisClient}=require("../config/redis")


const sendOtp = async (req, res) => {
    try {
        console.log("coming in sendOtp");
        const { name, email, password } = req.body
        console.log("name, email, password",name, email, password)

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already present with this email. Try with a different email"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const otp =await generateOtp()  

  
        await redisClient.set(
            `signup:${email}`,
            JSON.stringify({
                name,
                email,
                password: hashedPassword,
                role: 'rider',
                otp
            }),
            'EX', 600  
        )

        // publish event for email

        publishEvent("email.sendSuccessfully",{
            email:email,
            otp:otp
        })
        

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email. Please verify to complete signup."
        })

    } catch (error) {
        console.log("Error in sending OTP:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body

        console.log("email,otp", email, otp);

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            })
        }

        const signupDataString = await redisClient.get(`signup:${email}`)
        console.log("signupDataString", signupDataString)

        if (!signupDataString) {
            return res.status(410).json({
                success: false,
                message: "OTP expired or invalid. Please sign up again."
            })
        }

        const signupData = JSON.parse(signupDataString)

        if (signupData.otp !== otp) {
            return res.status(401).json({
                success: false,
                message: "Incorrect OTP"
            })
        }

        const newUser = await User.create({
            name: signupData.name,
            email: signupData.email,
            password: signupData.password,
            role: signupData.role,
            isVerified: true
        })

        await createRiderProfile(newUser._id.toString(), newUser.name)

        await redisClient.del(`signup:${email}`)

       
        return res.status(201).json({
            success: true,
            message: "Account verified successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        })

    } catch (error) {
        console.log("Error in verifying OTP:", error)
        
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


const resendOtp = async (req, res) => {
    try {
        const { email } = req.body

        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        const signupDataString = await redisClient.get(`signup:${email}`)

      
        if (!signupDataString) {
            return res.status(410).json({
                success: false,
                message: "Signup session expired. Please sign up again."
            })
        }

        const signupData = JSON.parse(signupDataString)

        const newOtp =await generateOtp()
        signupData.otp = newOtp

        await redisClient.set(
            `signup:${email}`,
            JSON.stringify(signupData),
            'EX', 600
        )

       
        publishEvent("email.sendSuccessfully", {
            email: email,
            otp: newOtp
        });

       
        return res.status(200).json({
            success: true,
            message: "New OTP sent to your email"
        })

    } catch (error) {
        console.log("Error in resending OTP:", error)
        
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const accessToken = jwt.sign(
            { id: user._id, role: user.role,name:user?.name },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '60m' }
        );

    
            res.cookie("token", accessToken, {
            httpOnly: true,              
             
            maxAge: 60 * 60 * 1000 
        });


        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token:accessToken
            }
        });

    } catch (error) {
        console.log("Error in login:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


const updateUserRole = async (req, res) => {
  try {

    const { userId, role } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.role = role;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Role updated successfully"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = {
    sendOtp,
    verifyOtp,
    resendOtp,
    login,
    updateUserRole
}
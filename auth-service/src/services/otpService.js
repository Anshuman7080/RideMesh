const otpGenerator = require('otp-generator');
const Otp = require("../models/otpSchema");

const generateOtp=async(userId)=>{
     try{
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        const result = await Otp.findOne({otp: otp, userId: userId});
        console.log('OTP Generated : ', otp);
        console.log('Result : ', result);
    
        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlpahbets: false,
            });
            result = await Otp.findOne({otp: otp});
        }
        return otp;
     }
     catch(error){
            console.log("Error in generating otp",error);
     }
    }

    module.exports={generateOtp};
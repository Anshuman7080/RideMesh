const otpGenerator = require('otp-generator');

const generateOtp=async(userId)=>{
     try{
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        console.log('OTP Generated : ', otp);
    
        return otp;
     }
     catch(error){
            console.log("Error in generating otp",error);
     }
    }

    module.exports={generateOtp};
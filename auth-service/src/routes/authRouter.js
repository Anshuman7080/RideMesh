const express = require("express");
const router = express.Router();

const {sendOtp,verifyOtp,resendOtp,login,updateUserRole,updateIsActive}=require("../controllers/authController")


router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOtp)
router.post('/login', login)
router.patch("/internal/update-role",updateUserRole);
router.patch("/internal/update-isActive",updateIsActive);

module.exports=router;
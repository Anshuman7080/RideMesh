const express = require("express");
const router = express.Router();

const {signUp,login,verifyEmail}=require("../controllers/authController")



router.post("/signup",signUp);
router.post("/login",login);
router.post("/verify-email",verifyEmail)

module.exports=router;
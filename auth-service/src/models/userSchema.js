
const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
       required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
    role:{
        type:String,
        enum:['rider','driver','admin'],
        default:'rider'
    },


},{timestamps:true})

module.exports=mongoose.model("User",userSchema)
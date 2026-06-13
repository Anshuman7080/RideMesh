const mongoose=require("mongoose");

const paymentSchema=new mongoose.Schema({
    ride_id:{
        type:String,
        required:true,
    },
    rider_id:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    razorpay_order_id:{
        type:String,
        maxlength:100
    },
    razorpay_payment_id:{
        type:String,
        maxlength:100
    },
    razorpay_signature:{
        type:String,
        maxlength:255,
    },
    status:{
        type:String,
        enum:['CREATED','PAID','FAILED'],
        default:'CREATED'
    },
    initiated_at:{
        type:Date,
        default:Date.now,
    },
    completed_at:{
        type:Date
    },
    failure_reason:{
        type:String,
        maxlength:255
    }
},{timestamps:false});

module.exports=mongoose.model("Payment",paymentSchema);
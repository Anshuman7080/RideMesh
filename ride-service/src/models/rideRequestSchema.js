// Temporary table that tracks which drivers were notified about a ride request and whether they responded.
// Why do you need this table?
// When a rider requests a ride, you don't just assign a random driver. You:
// 1. Find 5 nearby available drivers
// 2. Send request to closest driver → wait 30 seconds
// 3. If no response → mark EXPIRED → send to next driver
// 4. Repeat until someone accepts
// Without this table you have no way to track which drivers were already asked and rejected the ride.


const mongoose=require("mongoose");

const rideRequestSchema=new mongoose.Schema({

    rideId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ride",
        required:true
    },
    driverId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:[
            "PENDING",
            "ACCEPTED",
            "REJECTED",
            "EXPIRED"
        ],
        default:"PENDING"
    },
    sentAt:{
        type:Date,
        default:Date.now
    },

    respondedAt:Date,
    expiryAt:Date

},{timestamps:true});


rideRequestSchema.index({
    rideId:1
});

rideRequestSchema.index({
    driverId:1
});

module.exports=mongoose.model("RideRequest",rideRequestSchema);

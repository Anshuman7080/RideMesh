const mongoose=require("mongoose");


const rideStatusHistorySchema=new mongoose.Schema({
    
    rideId:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"Ride",
         required:true
    },
    status:{
    type:String,
    enum:[
        "REQUESTED",
        "ACCEPTED",
        "DRIVER_ARRIVED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED"
    ],
    required:true
    },
    changedBy:{
        type:String,
        enum:["rider","driver","system"]
    },
    note:{
        type:String,
        default:""
    }


},{timestamps:{createdAt:"changedAt",updatedAt:false}});


module.exports=mongoose.model("RideStatusHistory",rideStatusHistorySchema);




// Your rides table has a status column. At any point it looks like this:
// id        status        driver_id
// abc-123   IN_PROGRESS   driver-xyz
// Now the ride completes:
// id        status      driver_id
// abc-123   COMPLETED   driver-xyz
// The status changed. But the previous value is gone forever. You have no idea:

// When was the ride requested?
// How long did the driver take to accept?
// Was it ever cancelled and re-requested?
// Did the driver arrive on time?

// The status column only ever shows you right now. It has no memory.

// A real scenario where this becomes a problem
// Imagine this happens:
// Rider books a ride at 10:00 AM
// Driver accepts at 10:15 AM  ← 15 minutes to accept, very slow
// Rider complains: "Driver took too long"
// Without the history table — you cannot prove or disprove anything. The rides table just says COMPLETED. The timestamps requested_at and accepted_at help somewhat, but what if the ride went through this:
// 10:00 → REQUESTED
// 10:05 → ACCEPTED  (driver 1 accepted)
// 10:07 → CANCELLED (driver 1 cancelled)
// 10:08 → REQUESTED again
// 10:15 → ACCEPTED  (driver 2 accepted)
// Your rides table cannot capture this at all. The requested_at would be overwritten or incorrect. You have lost the entire story of what happened.
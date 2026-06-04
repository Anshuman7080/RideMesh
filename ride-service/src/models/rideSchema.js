const mongoose=require("mongoose")

const rideSchema=new mongoose.Schema({
    riderId:{
        type:String,
        required:true,
    },
    driverId:{
        type:String,
        default:null,
    },
    pickup:{
        latitude:{
            type:Number,
            required:true,
        },
        longitude:{
            type:Number,
            required:true
        },
        address:{
            type:String,
            default:""
        }
    },
    dropoff:{
        latitude:{
            type:Number,
            required:true,
        },
        longitude:{
            type:Number,
            required:true,
        },
        address:{
            type:String,
            default:""
        }
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
        default:"REQUESTED"
    },
    estimatedFare:{
        type:Number,
        default:0
    },

    finalFare:{
        type:Number,
        default:0
    },
    distanceKm:{
        type:Number,
        default:0
    },
    riderRating:{
        type:Number,
        min:1,
        max:5
    },
    driverRating:{
        type:Number,
        min:1,
        max:5
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },

    acceptedAt: Date,

    driverArrivedAt: Date,

    startedAt: Date,

    completedAt: Date,

    cancelledAt: Date,

    cancelledBy:{
        type:String,
        enum:["rider","driver","system"]
    },

    cancellationReason:String


},{timestamps:true});


rideSchema.index({
riderId:1
})

rideSchema.index({
    driverId:1
})

rideSchema.index({
    status: 1
});

module.exports=mongoose.model("Ride",rideSchema);
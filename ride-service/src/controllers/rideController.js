const Ride=require("../models/rideSchema");
const RideStatusHistory=require("../models/rideStatusHistorySchema");
const RideRequest=require("../models/rideRequestSchema")
const {calculateFare}=require("../utils/fareCalculator");

const createRide=async(req,res)=>{
    try{
         const riderId=req.headers["x-user-id"]

         if(!riderId){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
         }
              const {pickup,dropoff,distanceKm}=req.body;

              if(!pickup || !dropoff || !distanceKm){
                return res.status(400).json({
                    success:false,
                    message:"All fields are required"
                })
              }


              const estimatedFare=calculateFare(distanceKm);

              const ride=await Ride.create({
                riderId,pickup,dropoff,distanceKm,estimatedFare,
                status:"REQUESTED"
              });


              await RideRequest.insertMany([
                        {
                            rideId: ride._id,
                            driverId: "driver1"
                        },
                        {
                            rideId: ride._id,
                            driverId: "driver2"
                        },
                        {
                            rideId: ride._id,
                            driverId: "driver3"
                        }
                    ]);

              await RideStatusHistory.create({
                rideId:ride._id,
                status:"REQUESTED",
                changedBy:"rider",
                note:"Ride created"
              })

             return res.status(201).json({
                success:true,
                message:"Ride created successfully",
                ride
             })



    }
    catch(error){
         console.log("Error creating ride", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
}

const getRideDetails = async (req, res) => {

    try {

        const { rideId } = req.params;

        if (!rideId) {
            return res.status(404).json({
                success: false,
                message: "RideId not found"
            });
        }

        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found"
            });
        }

        return res.status(200).json({
            success: true,
            ride
        });

    } catch (error) {

        console.log("Error fetching ride", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const cancelRide = async (req, res) => {

    try {

        const { rideId } = req.params;

        
        if (!rideId) {
            return res.status(404).json({
                success: false,
                message: "RideId not found"
            });
        }
           

        const riderId = req.headers["x-user-id"];

        if (!riderId) {
            return res.status(404).json({
                success: false,
                message: "RiderId not found"
            });
        }

        const { reason } = req.body;

        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found"
            });
        }

        if (ride.riderId !== riderId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (
            ride.status !== "REQUESTED" &&
            ride.status !== "ACCEPTED"
        ) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel ride in ${ride.status} state`
            });
        }

        ride.status = "CANCELLED";

        ride.cancelledAt = new Date();

        ride.cancelledBy = "rider";

        ride.cancellationReason =
            reason || "Cancelled by rider";

        await ride.save();

        await RideStatusHistory.create({
            rideId: ride._id,
            status: "CANCELLED",
            changedBy: "rider",
            note: reason || "Cancelled by rider"
        });

        return res.status(200).json({
            success: true,
            message: "Ride cancelled successfully"
        });

    } catch (error) {

        console.log("Error cancelling ride", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


const getDriverRequests = async (req, res) => {

    try {

        const driverId =
            req.headers["x-user-id"];

            if(!driverId){
                return res.status(404).json({
                    success:false,
                    message:"User is not authorized"
                })
            }

        const requests =
            await RideRequest.find({
                driverId,
                status: "PENDING"
            });

        return res.status(200).json({
            success: true,
            requests
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
};



const acceptRide=async(req,res)=>{
    try{
        
        const {rideId}=req.params;
         if(!rideId){
            return res.status(401).json({
                success:false,
                message:"ride Id missing"
            })
        }

        const driverId=req.headers['x-user-id']

        if(!driverId){
            return res.status(401).json({
                success:false,
                message:"Driver Id missing"
            })
        }

        const ride=await Ride.findById(rideId);


        if(!ride){
            return res.status(404).json({
                success:false,
                message:"Ride not found"
            })
        }

        if(ride.status!=='REQUESTED'){
            return res.status(400).json({
                success:false,
                message:`Ride is already ${ride.status}`
            })
        }
         

        const request=await RideRequest.findOne({
            rideId,
            driverId,
            status:"PENDING"
        });

        if(!request){
            return res.status(404).json({
                success:false,
                message:"No pending ride request found"
            })
        }

        request.status='ACCEPTED';
        request.respondedAt=new Date();

        await request.save();

        ride.driverId=driverId;
        ride.status='ACCEPTED';
        ride.acceptedAt=new Date();
        
        await ride.save();

        await RideStatusHistory.create({
            rideId:ride._id,
            status:"ACCEPTED",
            changedBy:"driver",
            note:"Driver accepted ride"
        })

        await RideRequest.updateMany({
            rideId,
            _id:{$ne:request._id}
        },{status:"REJECTED",respondedAt:new Date()})
           

        return res.status(200).json({
            success:true,
            message:"Ride accepted successfully",
            ride
        })

    }
    catch(error){
        console.log("Error in accepting ride",error);

        return res.status(500).json({
            success:false,
            error:error
        })
    }
}

module.exports = {
    createRide,
    getRideDetails,
    cancelRide,
    getDriverRequests,
    acceptRide
};
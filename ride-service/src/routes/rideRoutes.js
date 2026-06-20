const express = require("express");

const router = express.Router();

const {
    createRide,
    getRideDetails,cancelRide,getDriverRequests,acceptRide,driverArrived,startRide,completeRide
    ,rejectRide,driverCancelRide,rateDriver,rateRider,updateDriverLocation,
    setDriverOnline,setDriverOffline,
    getOnlineDrivers,getNearbyDrivers,
    getActiveRide,
    getListOfDriverRide,
    getListOfRiderRide
} = require("../controllers/rideController");

const {publishEvent}=require("../utils/eventBus");


router.get("/test-rabbit", async (req, res) => {
    try {
        await publishEvent("ride.created", {
            rideId: "ride_123",
            userId: "user_1",
            status: "requested"
        });

        res.json({ message: "Message sent to RabbitMq" });
    } catch (error) {
        console.log("Error in router file for testing rabbitMQ", error);
        res.status(500).json({ error: "Failed to send message" });
    }
});

router.get('/activeRide',getActiveRide)

router.post("/create", createRide);

router.get('/driversRide',getListOfDriverRide)

router.get("/rider/history",getListOfRiderRide);


router.get("/request", getDriverRequests);

router.patch("/:rideId/cancel", cancelRide);

router.get("/:rideId", getRideDetails);

router.patch( "/:rideId/accept", acceptRide);

router.patch("/:rideId/reject",rejectRide);



router.patch("/:rideId/arrive",driverArrived);

router.patch("/:rideId/start",startRide);

router.patch("/:rideId/complete",completeRide);

router.patch("/:rideId/driver-cancel",driverCancelRide);

router.post( "/:rideId/rate-driver",rateDriver);

router.post("/:rideId/rate-rider",rateRider);

router.patch( "/drivers/location",updateDriverLocation);

router.patch("/drivers/online",setDriverOnline);

router.patch("/drivers/offline",setDriverOffline);

router.get("/drivers/online",getOnlineDrivers);


router.get("/drivers/nearby",getNearbyDrivers );








module.exports = router;
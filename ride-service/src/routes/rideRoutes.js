const express = require("express");

const router = express.Router();

const {
    createRide,
    getRideDetails,cancelRide,getDriverRequests,acceptRide
} = require("../controllers/rideController");


router.post("/create", createRide);

router.get("/request", getDriverRequests);

router.patch("/:rideId/cancel", cancelRide);

router.get("/:rideId", getRideDetails);

router.patch( "/:rideId/accept", acceptRide);

module.exports = router;
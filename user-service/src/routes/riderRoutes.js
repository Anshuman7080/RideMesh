
const express=require("express");
const router=express.Router();


const {createRider,getRiderDetails,updateRiderDetails,deleteRider,updateRiderRating,getRiderDetailForRide}=require("../controllers/riderController")

router.post("/internal/create", createRider);

router.get("/profile", getRiderDetails);

router.put("/profile", updateRiderDetails);

router.delete("/profile", deleteRider);

router.patch( "/internal/rating/:riderId", updateRiderRating);

router.get("/:riderId/ride",getRiderDetailForRide);


module.exports=router;

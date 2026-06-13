const razorpay=require("../config/razorpay")
const crypto=require("crypto")

const Payment=require("../models/paymentSchema")

const {redisClient} = require('../config/redis')
const {publishEvent}=require("../utils/eventBus");

const createOrder = async (req, res) => {
    try {

        console.log("Comg here");

        const userId = req.headers['x-user-id']

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const { ride_id } = req.body

        if (!ride_id) {
            return res.status(400).json({
                success: false,
                message: "RideID is required"
            })
        }


        console.log("ride_id:",ride_id);
            
         const key = `ride:${ride_id}`;
     
        const rideDataString = await redisClient.get(key);

        if (!rideDataString) {
            return res.status(404).json({
                success: false,
                message: "Ride payment session expired or ride not found"
            })
        }

     
        const rideData = JSON.parse(rideDataString)

        
        if (rideData.riderId !== userId) {
            return res.status(403).json({
                success: false,
                message: "This ride does not belong to you"
            })
        }

        
        const amount = rideData.fare

     
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `ride_${ride_id}`
        })

        if (!order) {
            return res.status(500).json({
                success: false,
                message: "Error occurred while creating order"
            })
        }

  
        const payment = await Payment.create({
            ride_id,
            rider_id: userId,
            amount,
            razorpay_order_id: order.id,
            status: "CREATED"
        })
        
        publishEvent("payment.successfull",{
           rideId:ride_id,
           rider_id:userId,
           amount:amount,
        });

        return res.status(201).json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        })

    } catch (error) {
        console.log("Error in creating order", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}



const verifyPayment=async(req,res)=>{

    try{

        const {razorpay_order_id, razorpay_payment_id, razorpay_signature}=req.body;

        console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        const body=razorpay_order_id + '|' +razorpay_payment_id;

        const expectedSignature=crypto.
        createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex')

        console.log("expectedSignature",expectedSignature)

        const isValid=expectedSignature===razorpay_signature

        if(isValid){
            await Payment.findOneAndUpdate({razorpay_order_id}, {
            status: 'PAID',
            razorpay_payment_id,
            razorpay_signature,
            completed_at: new Date()
        })



    return res.status(200).json({
        success:true,
        message:"Payment successful"
    })
        }else{
            await Payment.findOneAndUpdate({razorpay_order_id},{
                status:"FAILED",
                failed_reason:"Signature verification failed"

            })
           return res.status(400).json({ status: 'failure'})
        }

       
    }catch(error){
       console.log("Error in payment verification",error);
       return res.status(500).json({
        success:false,
        message:error
       })
    }
}

module.exports={createOrder,verifyPayment};
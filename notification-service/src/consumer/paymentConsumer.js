
const {getChannel}=require("../config/rabbitmq");
const {emitToUser}=require("../config/socketEmitter");
const Notification=require("../models/notificationSchema");



const consumePaymentEvents=async()=>{
    try{
        const channel=getChannel();

        if(!channel){
            throw new Error("Channel is not initialized yet");
        }

        const exchange="payment_events";
        const queue="payment_queue";

        await channel.assertExchange(exchange,"topic",{
            durable:true
        })

        await channel.assertQueue(queue,{
            durable:true
        });

        await channel.bindQueue(
            queue,
            exchange,
            "payment.*"
        )
        console.log("Listening to Payment Events....");

        channel.consume(
            queue,
            async(msg)=>{
                if (!msg)return;
                try{
                  const event=msg.fields.routingKey;
                  const data=JSON.parse(msg.content.toString())

                  console.log("Event received",event);


                  await handleEvent(
                    event,
                    data
                  )

                  channel.ack(msg);


                }catch(error){
                   console.error("payment Consumer error",error);

                   channel.nack(msg,false,false);
                }
            }
        )

    }
    catch(error){
            console.log("Error in payment consuming outer",error);
    }
}


async function handleEvent(event,data){
    switch(event){
        case "payment.successfull":
            console.log("coming in payment successful case...")

            emitToUser(
                "driver",
                data.driverId,
                "payment-successfull",
                {
                    rideId:data.rideId,
                    riderId:data?.riderId,
                    amount:data?.amount,
                    message:`payment of ${data.amount} received`

                }

            )

            await Notification.create({
                userId:data.driverId,
                userRole:"driver",
                rideId:data.rideId,
                type:"PAYMENT_SUCCESSFUL",
                title:"Payment completed",
                message:"Payment for ride  completed"
            })
            break;

            default:

            console.log(
                "Unhandled event:",
                event
            );


    }
}

module.exports={consumePaymentEvents}
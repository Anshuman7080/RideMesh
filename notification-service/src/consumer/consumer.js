const {getChannel}=require("../config/rabbitmq");

const consumeEvents=async()=>{
    try{
     const channel=getChannel();
     
     if(!channel){
        throw new Error("Channel is not initialized yet");
     }


     const exchange="ride_events";

     const queue="notification_queue";

     await channel.assertExchange(exchange,"topic",{
        durable:true
     })

     await channel.assertQueue(queue,{
        durable:true
     });

     //ride*
     await channel.bindQueue(queue,"ride_events","ride.*");

     //driver.*
     
     await channel.bindQueue(
        queue,
        "ride_events",
        "driver.*"
     );

     await channel.bindQueue(
        queue,
        "ride_events",
        "rider.*"
     );


     console.log("listening to Ride Events...");
     
     channel.consume(queue,(msg)=>{
        const event=msg.fields.routingKey;
        const data=JSON.parse(msg.content.toString());

        console.log("Event received",event);

        // do the task of notification

        handleEvent(event,data);
        channel.ack(msg);


     })



    }
    catch(error){
        console.log("Error in consuming events",error);
    }
}



function handleEvent(event, data) {
    switch (event) {
        case "ride.created":
            console.log("Notify drivers about new ride");
            break;

        case "ride.accepted":
            console.log("Notify rider driver assigned");
            break;

        case "ride.completed":
            console.log("Send receipt / summary");
            break;

        default:
            console.log("Unhandled event:", event);
    }
}

module.exports = { consumeEvents };
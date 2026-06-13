const {getChannel}=require("../config/rabbitmq");

const publishEvent=async(routingKey,data)=>{
try{

    const channel=getChannel();

    if(!channel){
        throw new Error("RabbitMQ channel not initialized");
    }

    const exchange="auth_events";

    await channel.assertExchange(exchange,"topic",{durable:true});

    channel.publish(exchange,routingKey,Buffer.from(JSON.stringify({
        ...data,
        timestamp:Date.now()
    })),{
            persistent: true
        })

    console.log("Event published:",routingKey);

}catch(error){
    console.log("Error in publish events",error);
}

}


module.exports={publishEvent};
const amqp=require("amqplib");
let channel,connection;


const connectRabbitMQ =async()=>{
    try{
       connection =await amqp.connect("amqp://localhost:5672");
       channel=await connection.createChannel();

       console.log("RabbitMq connected");
       return channel;
         
    }
    catch(error){
        console.log("Error in connecting RabbitMQ",error);
    }
}


function getChannel(){
    return channel;
}

module.exports={
    connectRabbitMQ,
    getChannel
}

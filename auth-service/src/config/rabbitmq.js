const amqp=require("amqplib");

let channel,connection;


const connectRabbitMQ =async()=>{
    try{
       const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://localhost:5672";
       console.log(`Attempting to connect to RabbitMQ at: ${rabbitmqUrl}`);

       connection =await amqp.connect(rabbitmqUrl);
       
       channel=await connection.createChannel();
       
       console.log("RabbitMq connected");
       return channel;
         
    }
    catch(error){
        console.log("Error in connecting RabbitMQ",error.message);
        throw error;
    }
}


function getChannel(){
    return channel;
}

module.exports={
    connectRabbitMQ,
    getChannel
}

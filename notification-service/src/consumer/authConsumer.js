
const {getChannel}=require("../config/rabbitmq");
const {mailSender}=require("../utils/emailService");

const emailVerificationTemplate=require("../utils/emailVerificationTemplate")

const consumeAuthEvents=async()=>{
    try{
        const channel=getChannel();

        if(!channel){
            throw new Error("Channel is not initialized yet");
        }

        const exchange="auth_events";
        const queue="auth_queue";

        await channel.assertExchange(exchange,"topic",{
            durable:true
        })

        await channel.assertQueue(queue,{
            durable:true
        });

        await channel.bindQueue(
            queue,
            exchange,
            "email.*"
        )

        console.log("Listening to auth Events....");

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
                   console.error("auth Consumer error",error);

                   channel.nack(msg,false,false);
                }
            }
        )

    }
    catch(error){
            console.log("Error in auth consuming outer",error);
    }
}


async function handleEvent(event,data){
    switch(event){
        case "email.sendSuccessfully":
            console.log("coming in email send successfully case...")

             await mailSender({
                  email:data.email,
                  title:"Verification Email from Uber",
                  body:emailVerificationTemplate(data.otp)
             });

            break;

            default:

            console.log(
                "Unhandled event:",
                event
            );


    }
}

module.exports={consumeAuthEvents}
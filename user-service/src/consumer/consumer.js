const { getChannel } = require("../config/rabbitmq");

const Rider=require("../models/riderSchema");

const consumeRiderEvents = async () => {
    const channel = getChannel();
    const exchange = "ride_events";
    const queue = "rider_queue";

    await channel.assertExchange(exchange, "topic", { durable: true });
    await channel.assertQueue(queue, { durable: true });


    await channel.bindQueue(queue, exchange, "rider.rating.updated");

    console.log("rider Consumer Started");

    channel.consume(queue, async (msg) => {
        if (!msg) return;

        const event = msg.fields.routingKey;
        const data = JSON.parse(msg.content.toString());

        try {
            await handleEvent(event, data);
            channel.ack(msg);
        } catch (error) {
            console.log("rider Consumer Error", error);
            channel.nack(msg, false, false);
        }
    });
};

module.exports = { consumeRiderEvents };



const handleEvent = async (event, data) => {
    switch (event) {
        
       case "rider.rating.updated":
    try {
        const rider = await Rider.findOne({ userId: data.riderId });

        if (!rider) {
            throw new Error("Rider not found");
        }

      
        if (!data.rating || data.rating < 1 || data.rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }
        const newRating =
            ((rider.rating * rider.totalRides) + data.rating) /
            (rider.totalRides + 1);

        rider.rating = Number(newRating.toFixed(2));
        rider.totalRides += 1;

        await rider.save();

        console.log(`Rating updated for rider ${data.riderId}`);
    } catch (error) {
        console.log("Error updating rider rating", error);
        throw error;
    }
    break;


        default:
            console.log("Unhandled Event", event);
    }
};

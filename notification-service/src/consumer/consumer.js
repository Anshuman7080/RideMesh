const { getChannel } = require("../config/rabbitmq");
const { emitToUser } = require("../config/socketEmitter");
const { redisClient } = require("../config/redis");

const consumeEvents = async () => {
    try {
        const channel = getChannel();

        if (!channel) {
            throw new Error("Channel is not initialized yet");
        }

        const exchange = "ride_events";
        const queue = "notification_queue";

        await channel.assertExchange(exchange, "topic", {
            durable: true
        });

        await channel.assertQueue(queue, {
            durable: true
        });

        await channel.bindQueue(queue, "ride_events", "ride.*");
        await channel.bindQueue(queue, "ride_events", "driver.*");
        await channel.bindQueue(queue, "ride_events", "rider.*");

        console.log("listening to Ride Events...");

        channel.consume(queue, async (msg) => {
            if (!msg) return;

            const event = msg.fields.routingKey;
            const data = JSON.parse(msg.content.toString());

            try {
                await handleEvent(event, data);

                // ✅ success → remove message
                channel.ack(msg);
            } 
            catch (error) {
                console.error("handleEvent failed:", error);

                
               channel.nack(msg, false, false); 
            }
        });

    } 
    catch (error) {
        console.log("Error in consuming events", error);
    }
};

async function handleEvent(event, data) {
    switch (event) {

        case "ride.created":
            console.log("coming in ride created case");

            for (const driverId of data.drivers) {
                console.log("coming in for loop");

                emitToUser(
                    "driver",
                    driverId,
                    "new-ride-request",
                    {
                        rideId: data.rideId,
                        riderId: data.riderId,
                        pickup: data.pickup,
                        dropoff: data.dropoff,
                        estimatedFare: data.estimatedFare,
                        distanceKm: data.distanceKm
                    }
                );
            }
            break;

        case "ride.cancelled":
            emitToUser(
                "rider",
                data.riderId,
                "cancelled-by-driver",
                {
                    riderId: data.riderId,
                    rideId: data.rideId,
                    cancelledBy: "DRIVER",
                    reason: data.cancellationReason,
                    status: data.status
                }
            );
            break;

        case "driver.arrived":
            emitToUser(
                "rider",
                data.riderId,
                "driver_arrived",
                {
                    rideId: data.rideId,
                    status: data.status
                }
            );
            break;

        case "ride.accepted":
            await redisClient.hSet(`ride:${data.rideId}`, {
                riderId: data.riderId,
                driverId: data.driverId
            });

            emitToUser(
                "rider",
                data.riderId,
                "ride-accepted",
                {
                    rideId: data.rideId,
                    driverId: data.driverId,
                    status: "Accepted"
                }
            );
            break;

        case "ride.started":
            emitToUser(
                "rider",
                data.riderId,
                "ride-started",
                {
                    rideId: data.rideId,
                    status: data.status
                }
            );
            break;

        case "ride.completed":
            await redisClient.del(`ride:${data.rideId}`);

            emitToUser(
                "rider",
                data.riderId,
                "ride-completed",
                {
                    rideId: data.rideId,
                    riderId: data.riderId,
                    status: data.status,
                    finalFare: data.finalFare
                }
            );
            break;

        default:
            console.log("Unhandled event:", event);
    }
}

module.exports = { consumeEvents };
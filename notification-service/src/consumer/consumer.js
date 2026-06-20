const { getChannel } = require("../config/rabbitmq");
const { emitToUser } = require("../config/socketEmitter");
const { redisClient } = require("../config/redis");
const Notification = require("../models/notificationSchema");

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

        await channel.bindQueue(
            queue,
            exchange,
            "ride.*"
        );

        await channel.bindQueue(
            queue,
            exchange,
            "driver.*"
        );

        await channel.bindQueue(
            queue,
            exchange,
            "rider.*"
        );

        console.log(
            "Listening to Ride Events..."
        );

        channel.consume(
            queue,
            async (msg) => {

                if (!msg) return;

                try {

                    const event =
                        msg.fields.routingKey;

                    const data =
                        JSON.parse(
                            msg.content.toString()
                        );

                    console.log(
                        "Event received:",
                        event
                    );

                    await handleEvent(
                        event,
                        data
                    );

                    // success
                    channel.ack(msg);

                }
                catch (error) {

                    console.error(
                        "Consumer Error:",
                        error
                    );

                    // remove failed message
                    channel.nack(
                        msg,
                        false,
                        false
                    );
                }
            }
        );

    }
    catch (error) {

        console.log(
            "Error in consuming events",
            error
        );
    }
};

async function handleEvent(
    event,
    data
) {

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

        await Notification.create({
            userId: driverId,
            userRole: "driver",
            rideId: data.rideId,
            type: "RIDE_REQUEST_BY_RIDER",
            title: "Ride Requested",
            message: "You have received a new ride request"
        });
    }

    break;

        case "ride.cancelled":

            emitToUser(
                "rider",
                data.riderId,
                "cancelled-by-driver",
                {
                    riderId:
                        data.riderId,
                    rideId:
                        data.rideId,
                    cancelledBy:
                        "DRIVER",
                    reason:
                        data.cancellationReason,
                    status:
                        data.status
                }
            );

            await Notification.create({
                userId:
                    data.riderId,
                userRole:
                    "rider",
                rideId:
                    data.rideId,
                type:
                    "RIDE_CANCELLED_BY_DRIVER",
                title:
                    "Ride Cancelled",
                message:
                    "Your driver cancelled the ride"
            });

            break;

        case "driver.arrived":

            emitToUser(
                "rider",
                data.riderId,
                "driver-arrived",
                {
                    rideId:
                        data.rideId,
                    status:
                        data.status
                }
            );

            await Notification.create({
                userId:
                    data.riderId,
                userRole:
                    "rider",
                rideId:
                    data.rideId,
                type:
                    "DRIVER_ARRIVED",
                title:
                    "Driver Arrived",
                message:
                    "Your driver has arrived"
            });

            break;

        case "ride.accepted":

            await redisClient.hSet(
                `ride:${data.rideId}`,
                {
                    riderId:
                        data.riderId,
                    driverId:
                        data.driverId
                }
            );

            emitToUser(
                "rider",
                data.riderId,
                "ride-accepted",
                {
                    rideId:
                        data.rideId,
                    driverId:
                        data.driverId,
                    status:
                        "Accepted"
                }
            );

            await Notification.create({
                userId:
                    data.riderId,
                userRole:
                    "rider",
                rideId:
                    data.rideId,
                type:
                    "DRIVER_ASSIGNED",
                title:
                    "Driver Assigned",
                message:
                    "A driver has accepted your ride request"
            });

            break;

        case "ride.started":

            emitToUser(
                "rider",
                data.riderId,
                "ride-started",
                {
                    rideId:
                        data.rideId,
                    status:
                        data.status
                }
            );

            await Notification.create({
                userId:
                    data.riderId,
                userRole:
                    "rider",
                rideId:
                    data.rideId,
                type:
                    "RIDE_STARTED",
                title:
                    "Ride Started",
                message:
                    "Your ride has started"
            });

            break;

        case "ride.completed":

            await redisClient.del(
                `ride:${data.rideId}`
            );

            emitToUser(
                "rider",
                data.riderId,
                "ride-completed",
                {
                    rideId:
                        data.rideId,
                    riderId:
                        data.riderId,
                    status:
                        data.status,
                    finalFare:
                        data.finalFare
                }
            );

            await Notification.create({
                userId:
                    data.riderId,
                userRole:
                    "rider",
                rideId:
                    data.rideId,
                type:
                    "RIDE_COMPLETED",
                title:
                    "Ride Completed",
                message:
                    "Thank you for riding with us"
            });
            

            break;

        case "ride.cancelledByRider":

        if(data?.driverId){
            emitToUser(
                "driver",
                data.driverId,
                "cancelled-by-rider",
                {
                    driverId:
                        data.driverId,
                    rideId:
                        data.rideId,
                    cancelledBy:
                        "Rider",
                    reason:
                        data.reason,
                    status:
                        data.status
                }
            );
        }

            await Notification.create({
                userId:
                    data.riderId,
                userRole:
                    "rider",
                rideId:
                    data.rideId,
                type:
                    "RIDE_CANCELLED_BY_RIDER",
                title:
                    "Ride Cancelled By Rider",
                message:
                    "Your ride cancelled successfully"
            });

            break;

        case "ride.paymentSuccessful":
             
            emitToUser(
                "driver",
                data.driverId,
                "payment-successfull",
                {
                    rideId:
                        data.rideId,
                    status:"PAYMENT_COMPLETED"     
                }
            );


             

        default:

            console.log(
                "Unhandled event:",
                event
            );
    }
}

module.exports = {
    consumeEvents
};
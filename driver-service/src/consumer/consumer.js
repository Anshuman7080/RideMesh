const { getChannel } = require("../config/rabbitmq");
const Driver = require("../models/driverSchema");

const consumeDriverEvents = async () => {
    const channel = getChannel();
    const exchange = "ride_events";
    const queue = "driver_queue";

    await channel.assertExchange(exchange, "topic", { durable: true });
    await channel.assertQueue(queue, { durable: true });

    await channel.bindQueue(queue, exchange, "driver.availability.updated");
    await channel.bindQueue(queue, exchange, "driver.rating.updated");

    console.log("Driver Consumer Started");

    channel.consume(queue, async (msg) => {
        if (!msg) return;

        const event = msg.fields.routingKey;
        const data = JSON.parse(msg.content.toString());

        try {
            await handleEvent(event, data);
            channel.ack(msg);
        } catch (error) {
            console.log("Driver Consumer Error", error);
            channel.nack(msg, false, false);
        }
    });
};

module.exports = { consumeDriverEvents };



const handleEvent = async (event, data) => {
    switch (event) {
        case "driver.availability.updated":
            await Driver.findByIdAndUpdate(
                data.driverId,
                { isAvailable: data.isAvailable }
            );
            break;


        case "driver.rating.updated":

            try {

                const driver = await Driver.findOne({
                    userId: data.driverId
                });

                if (!driver) {
                    throw new Error(
                        "Driver not found"
                    );
                }

                const newRating =
                    (
                        (driver.rating * driver.totalTrips)
                        + data.rating
                    ) /
                    (driver.totalTrips + 1);

                driver.rating =
                    Number(
                        newRating.toFixed(2)
                    );

                driver.totalTrips += 1;

                await driver.save();

                console.log(
                    `Rating updated for driver ${data.driverId}`
                );

            } catch (error) {

                console.log(
                    "Error updating driver rating",
                    error
                );

                throw error; 
            }

    break;

        default:
            console.log("Unhandled Event", event);
    }
};

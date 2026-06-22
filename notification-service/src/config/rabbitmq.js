const amqp = require("amqplib");

let channel, connection;

const connectRabbitMQ = async (retries = 20, delay = 3000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://localhost:5672";
            console.log(`Attempting to connect to RabbitMQ at: ${rabbitmqUrl} (attempt ${attempt}/${retries})`);

            connection = await amqp.connect(rabbitmqUrl);
            channel = await connection.createChannel();

            console.log("RabbitMQ connected");
            return channel;

        } catch (error) {
            console.log(`Error in connecting RabbitMQ (attempt ${attempt}/${retries}): ${error.message}`);

            if (attempt === retries) {
                console.log("RabbitMQ connection failed after all retries — giving up");
                throw error;
            }

            console.log(`Retrying in ${delay / 1000}s...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};

function getChannel() {
    return channel;
}

module.exports = {
    connectRabbitMQ,
    getChannel
};
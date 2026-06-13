const { createClient } = require("redis");

const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redisClient.on("error", (err) => {
    console.log("Redis Error:", err);
});

const connectRedis = async () => {
    try {

        await redisClient.connect();

        console.log(
            "Redis Connected Successfully"
        );

    } catch (error) {

        console.log(
            "Redis Connection Error",
            error
        );
    }
};

module.exports = {
    redisClient,
    connectRedis
};
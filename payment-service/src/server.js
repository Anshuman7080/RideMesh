const express = require("express")
const app = express()

const dotenv = require("dotenv")
const cors = require("cors")
const morgan = require("morgan")

const connectDB = require("./config/db")
const paymentRoutes=require("./routes/paymentRoutes");
const {
    connectRedis
} = require("./config/redis");

const {connectRabbitMQ}=require("./config/rabbitmq");

dotenv.config()

const PORT = process.env.PORT || 5006

app.use(express.json())

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
)

app.use(morgan("dev"))

app.use("/api/v1/payment", paymentRoutes)

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'payment-service' })
})


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    })
})


async function startServer() {
    await connectDB();
    await connectRedis();
   await connectRabbitMQ();

}

startServer();

 app.listen(PORT, () => {
            console.log(`Payment Service running on port ${PORT}`)
})
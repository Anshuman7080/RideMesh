const express = require("express");
const app = express();

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const connectDB=require("./config/db");

const notificationRoutes = require("./routes/notificationRoutes");
const {connectRabbitMQ}=require("./config/rabbitmq");
const {consumeEvents}=require("./consumer/consumer")
const {consumePaymentEvents}=require("./consumer/paymentConsumer");
const {consumeAuthEvents}=require("./consumer/authConsumer");
const http = require("http");

const {  initializeSocket} = require("./sockets/socket");

const { connectRedis} = require("./config/redis");

dotenv.config();

const server =http.createServer(app);

initializeSocket(server);

const PORT = process.env.PORT || 5002;


// Middlewares
app.use(express.json());

app.use(cookieParser());


async function startWorker(){
  await connectDB();
  await connectRedis();
  await connectRabbitMQ();
  await consumeEvents();
  await consumePaymentEvents();
  await consumeAuthEvents();

}
startWorker();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(morgan("dev"));

// app.use((req, res, next) => {
//   console.log("AUTH SERVICE RECEIVED:", req.method, req.originalUrl);
//   next();
// });


// Routes
app.use("/api/v1/notifications", notificationRoutes);

// Health Check Route
app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "Notification Service",
    message: "Notification Service is healthy",
  });
});

// Root Route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Notification Service is running...",
  });
});

// Start Server
server.listen(PORT, () => {
    console.log(
        `Notification Service running on ${PORT}`
    );
});
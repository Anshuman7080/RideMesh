const express = require("express");

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const connectDB=require("./config/db");
const rideRoutes =require("./routes/rideRoutes");

const {connectRabbitMQ}=require("./config/rabbitmq");

const app = express();

const {
    connectRedis
} = require("./config/redis");

console.log("Import Success");

dotenv.config();

const PORT = process.env.PORT || 5004;

// Database Connection
// connectDB();

// connectRedis();

// initializeSocket(server);

// connectRabbitMQ();

async function startServer() {
    await connectDB();
    await connectRedis();
    await connectRabbitMQ();

}

startServer();

// app.listen(PORT, () => {
//     console.log(
//         `Ride Service running on ${PORT}`
//     );
// });

// Middlewares
app.use(express.json());

app.use(cookieParser());

// app.use(
//   cors({
//     origin:"http://localhost:5000",
//     credentials: true,
//   })
// );

app.use(morgan("dev"));

// app.use((req, res, next) => {
//   console.log("Driver SERVICE RECEIVED:", req.method, req.originalUrl);
//   next();
// });


// Routes
app.use("/api/v1/rides",rideRoutes);

// Health Check Route
app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "Ride Service",
    message: "Ride Service is healthy",
  });
});

// Root Route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Ride Service is running...",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Ride Service running on port ${PORT}`);
});




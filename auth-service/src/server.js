const express = require("express");
const app = express();

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const connectDB=require("./config/db");
const {connectRabbitMQ}=require("./config/rabbitmq");
const {connectRedis}=require("./config/redis");
const authRoutes = require("./routes/authRouter");

dotenv.config();

const PORT = process.env.PORT || 5001;

// Database Connection


async function startServer() {
    await connectDB();
    await connectRedis();
    await connectRabbitMQ();
}

startServer();

// Middlewares
app.use(express.json());

app.use(cookieParser());

// app.use(
//   cors({
//     origin:"http://localhost:5173",
//     credentials: true,
//   })
// );

app.use(morgan("dev"));

// app.use((req, res, next) => {
//   console.log("AUTH SERVICE RECEIVED:", req.method, req.originalUrl);
//   next();
// });


// Routes
app.use("/api/v1/auth", authRoutes);

// Health Check Route
app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    service: "Auth Service",
    message: "Auth Service is healthy",
  });
});

// Root Route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Auth Service is running...",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
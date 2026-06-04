const express = require("express");
const app = express();

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const connectDB=require("./config/db");
const rideRoutes =require("./routes/rideRoutes");


dotenv.config();

const PORT = process.env.PORT || 5004;

// Database Connection
connectDB();

// Middlewares
app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

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
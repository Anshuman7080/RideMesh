const express = require("express");
const app = express();

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const connectDB=require("./config/db");

const authRoutes = require("./routes/authRouter");

dotenv.config();

const PORT = process.env.PORT || 5001;

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
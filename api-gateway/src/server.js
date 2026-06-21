const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const authProxy = require("./routes/authProxy");
const userProxy = require("./routes/userProxy");
const driverProxy=require("./routes/driverProxy")
const limiter = require("./middleware/rateLimiter");
const authMiddleware = require("./middleware/authMiddleware");
const rideProxy=require("./routes/rideProxy");
const {notificationRestProxy,notificationSocketProxy}=require("./routes/notificationProxy");
const paymentProxy=require("./routes/paymentProxy")
const http=require("http");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
// console.log("AUTH_SERVICE_URL =", process.env.AUTH_SERVICE_URL);
// app.use(express.json());

app.use(
  cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })  
);

// app.use(limiter);


app.use(morgan("dev"));

// app.use("/api/v1/riders", (req, res, next) => {
//   console.log("riders ROUTE HIT");
//   next();
// });

// app.use((req, res, next) => {
//     console.log("REQUEST RECEIVED:", req.method, req.originalUrl);
//     next();
// });



app.use("/api/v1/auth", authProxy);
app.use("/api/v1/riders", authMiddleware, userProxy);

app.use("/api/v1/drivers",authMiddleware,driverProxy);

app.use("/api/v1/rides",authMiddleware,rideProxy);

app.use("/api/v1/notifications",authMiddleware,notificationRestProxy);
app.use("/socket.io", notificationSocketProxy);

app.use("/api/v1/payment",authMiddleware,paymentProxy);

const server=http.createServer(app);

// server.on("upgrade",(req,socket,head)=>{
//   if(req.url.startsWith("/socket.io")){
//     console.log("[Gateway] Forwarding raw WebSocket upgrade handshake to notification-service...");
//     notificationProxy.upgrade(req, socket, head);
//   }
// })

server.on("upgrade", notificationSocketProxy.upgrade);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "API Gateway Running"
  });
});

// app.listen(PORT, () => {
//   console.log(`Gateway running on ${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`Gateway running on ${PORT}`);
});


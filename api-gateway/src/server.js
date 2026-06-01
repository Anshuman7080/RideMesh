const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const authProxy = require("./routes/authProxy");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
console.log("AUTH_SERVICE_URL =", process.env.AUTH_SERVICE_URL);
// app.use(express.json());

app.use(cors());

app.use(morgan("dev"));

app.use("/api/v1/auth", (req, res, next) => {
  console.log("AUTH ROUTE HIT");
  next();
});


app.use("/api/v1/auth", authProxy);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "API Gateway Running"
  });
});

app.listen(PORT, () => {
  console.log(`Gateway running on ${PORT}`);
});

app.post("/test", (req, res) => {
  console.log("TEST HIT");
  res.json({ success: true });
});
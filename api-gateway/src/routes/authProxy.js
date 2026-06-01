const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");

dotenv.config();

console.log("AUTH_SERVICE_URL =", process.env.AUTH_SERVICE_URL);

module.exports = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
  logLevel: "debug",
  secure: false,

  onProxyReq: (proxyReq, req) => {
    console.log(
      `[Gateway] Forwarding ${req.method} ${req.originalUrl}`
    );
  },

  onError: (err, req, res) => {
    console.error("Proxy Error:", err);
  },
});
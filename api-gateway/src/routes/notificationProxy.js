const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");

dotenv.config();

const NOTIFICATION_HOST = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5005";

// REST proxy — re-adds the /api/v1/notifications prefix that Express strips
const notificationRestProxy = createProxyMiddleware({
    target: NOTIFICATION_HOST,
    changeOrigin: true,
    pathRewrite: (path) => `/api/v1/notifications${path}`,
    logLevel: "debug",
    xfwd: true,
    on: {
        proxyReq: (proxyReq, req) => {
            console.log(`[Gateway] Forwarding ${req.method} ${req.originalUrl} to notification service`);
            if (req.user) {
                proxyReq.setHeader("x-user-id", req.user.id);
                proxyReq.setHeader("x-user-role", req.user.role);
                proxyReq.setHeader("x-user-name", req.user.name);
            }
        },
        error: (err, req, res) => {
            console.error("[Gateway Proxy Error]:", err.message);
        }
    }
});

// WebSocket proxy — bare target, no path rewriting, matches Socket.io's default /socket.io path
const notificationSocketProxy = createProxyMiddleware({
    target: NOTIFICATION_HOST,
    changeOrigin: true,
    ws: true,
    logLevel: "debug",
    xfwd: true,
    on: {
        error: (err, req, res) => {
            console.error("[Gateway Proxy Error]:", err.message);
        }
    }
});

module.exports = { notificationRestProxy, notificationSocketProxy };
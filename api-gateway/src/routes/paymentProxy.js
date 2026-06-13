const {createProxyMiddleware}=require("http-proxy-middleware");

const dotenv=require("dotenv");
dotenv.config()

console.log("AUTH_SERVICE_URL =", process.env.PAYMENT_SERVICE_URL);

const paymentProxy=createProxyMiddleware({
    target:process.env.PAYMENT_SERVICE_URL,
    changeOrigin:true,
    logLevel:"debug",

    on:{
        proxyReq:(proxyReq,req)=>{
            console.log(`[Gateway] Forwarding ${req.method} ${req.originalUrl} to payment service`)
            
            if (req.user){
                console.log("req.user is",req.user);
                proxyReq.setHeader("x-user-id",req.user.userId)
                proxyReq.setHeader("x-user-role",req.user.role)
                proxyReq.setHeader("x-user-name",req.user.name)
            }
        }
    }
})


module.exports = paymentProxy
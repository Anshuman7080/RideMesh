// test-signature.js
const crypto = require('crypto')

const razorpay_order_id = "order_T0zayIMoroiSmE"  // from your createOrder response
const razorpay_payment_id = "pay_test123456"       // any fake string — just for testing
const key_secret = "your_razorpay_key_secret"      // from .env, RAZORPAY_KEY_SECRET

const body = razorpay_order_id + "|" + razorpay_payment_id

const signature = crypto
    .createHmac('sha256', key_secret)
    .update(body)
    .digest('hex')

console.log("razorpay_payment_id:", razorpay_payment_id)
console.log("razorpay_signature:", signature)
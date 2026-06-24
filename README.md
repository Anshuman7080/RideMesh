# RideMesh 🚗💨

> **A production-grade, event-driven ride-sharing platform built on a Node.js microservices architecture — featuring real-time driver tracking, asynchronous inter-service messaging via RabbitMQ, and Redis-backed state management.**

🌐 **Live Demo:** [https://ridemesh-frontend.onrender.com](https://ridemesh-frontend.onrender.com)
   **Demo Video:** [https://drive.google.com/file/d/15nHh6bz_QGiNgJpEOP9MVKc-EVzgujYj/view?usp=sharing](https://drive.google.com/file/d/15nHh6bz_QGiNgJpEOP9MVKc-EVzgujYj/view?usp=sharing)

---

## 🚀 Try It Live

No signup needed — use the demo accounts below:

| Role   | Email              | Password    |
|--------|--------------------|-------------|
| 🧍 Rider  | rider@gmail.com    | 123456789   |
| 🚗 Driver | driver@gmail.com   | 12345678    |

> **Tip:** Open two browser tabs — one as Rider, one as Driver — to experience the full ride flow end to end.

---

## 🏗️ System Architecture

RideMesh transitions away from a monolithic pattern into a highly scalable, decoupled network of **6 independent backend services** communicating asynchronously through **RabbitMQ** and synchronizing live state via **Redis Cloud**.

### Services

| Service | Port | Responsibility |
|---|---|---|
| `api-gateway` | 5000 | Single entry point — route proxying, JWT validation, middleware |
| `auth-service` | 5001 | Registration, login, Redis-backed OTP flow, JWT issuance |
| `user-service` | 5002 | Rider profiles, account lifecycle, internal state tracking |
| `driver-service` | 5003 | Driver availability, real-time GPS state, document approvals |
| `ride-service` | 5004 | Ride lifecycle — creation, geospatial matching, fare engine, status updates |
| `notification-service` | 5005 | Event-driven SMTP email notifications via RabbitMQ consumers |
| `frontend` | 5173 | React/Vite SPA — Rider and Driver interfaces |
| `rabbitmq` | 5672 / 15672 | AMQP message broker — pub/sub topic exchange across all services |

---

## ✨ Key Features

- **🔐 JWT Auth with RBAC** — Access and refresh token pair with role-based route protection (Rider / Driver)
- **📍 Real-time Driver Tracking** — Live GPS coordinates streamed over Socket.io, rendered on an interactive map
- **⚡ Redis OTP Flow** — OTP state stored in Redis with TTL expiry; no DB writes until verified
- **🐇 Async Messaging via RabbitMQ** — Services communicate through topic exchanges; 
- **🗺️ Geospatial Ride Matching** — Ride service queries nearest available drivers using location data
- **💰 Dynamic Fare Calculation** — Distance-based fare engine with real-time pricing on ride request
- **📧 Email & Notifications** — Ride confirmation, OTP, and status updates via SMTP triggered by RabbitMQ events
- **🐳 Fully Containerized** — Docker Compose orchestration with an isolated `ridemesh-network` bridge

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, Tailwind CSS, Redux Toolkit |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (isolated cluster per service) |
| Cache / Session | Redis Cloud |
| Message Broker | RabbitMQ (AMQP) |
| Real-time | Socket.io |
| Containerization | Docker, Docker Compose |

---

## 🗂️ Project Structure

```
ridemesh/
├── api-gateway/
├── auth-service/
├── user-service/
├── driver-service/
├── ride-service/
├── notification-service/
├── frontend/
├── docker-compose.yml
└── .env                  # Root-level secrets (excluded from Git)
```

---

## ⚙️ Local Setup

### Prerequisites
- Docker & Docker Compose
- MongoDB Atlas cluster URIs (one per service)
- Redis Cloud instance
- Gmail App Password for SMTP

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Anshuman7080/ridemesh.git
cd ridemesh

# 2. Create the root .env file
cp .env.example .env
# Fill in your credentials (see below)

# 3. Start all services
docker-compose up --build
```

### Environment Variables

Create a `.env` file at the project root:

```env
# --- GLOBAL SECRETS ---
JWT_SECRET_KEY=your_jwt_secret_key
JWT_SECRET_KEY_FOR_REFRESHTOKEN=your_refresh_token_secret_key

# --- MONGODB ATLAS URIS (per service) ---
MONGO_URI_AUTH=mongodb+srv://...
MONGO_URI_USER=mongodb+srv://...
MONGO_URI_DRIVER=mongodb+srv://...
MONGO_URI_RIDE=mongodb+srv://...
MONGO_URI_NOTIF=mongodb+srv://...

# --- REDIS CLOUD ---
REDIS_HOST=your_redis_cloud_endpoint
REDIS_PORT=your_redis_port
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_cloud_password

# --- SMTP ---
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_specific_password

# --- CLIENT ---
CLIENT_URL=http://localhost:5173

# --- INTERNAL SERVICE URLS ---
AUTH_SERVICE_URL=http://auth-service:5001
USER_SERVICE_URL=http://user-service:5002
DRIVER_SERVICE_URL=http://driver-service:5003
RIDE_SERVICE_URL=http://ride-service:5004
NOTIFICATION_SERVICE_URL=http://notification-service:5005
```

---

## 🔒 Security Notes

- All `.env` files are excluded from Git via `.gitignore`
- JWT refresh tokens are stored in HttpOnly cookies
- OTP states are stored in Redis with TTL — never persisted to MongoDB until verification succeeds
- Each service connects to its own isolated MongoDB Atlas cluster

---

## 👨‍💻 Author

**Anshuman Dubey** — [github.com/Anshuman7080](https://github.com/Anshuman7080)

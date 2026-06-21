# RideMesh 🚗💨

RideMesh is a high-performance, event-driven ride-sharing microservices platform built using the **MERN Stack** (Node.js, Express, React, MongoDB) and orchestrated completely via **Docker Compose**. 

The architecture transitions away from a monolithic pattern into a highly scalable, decoupled network of independent services that communicate asynchronously through **RabbitMQ** and synchronize state securely using **Redis Cloud**.

---

## 🏗️ System Architecture Overview

RideMesh is split into **8 core containerized services** communicating over an isolated virtual bridge network layer (`ridemesh-network`).

* **`api-gateway` (Port 5000):** The single entry point for all client requests. Handles route proxying, middleware integration, and token validation.
* **`frontend` (Port 5173):** A fast, modern React user interface built on Vite and styled with Tailwind CSS.
* **`auth-service` (Port 5001):** Manages user registration, credential verification, and Redis-backed OTP registration states.
* **`user-service` (Port 5002):** Manages rider profiles, internal state tracking, and account cycles.
* **`driver-service` (Port 5003):** Handles real-time driver availability states, profiling, and document approvals.
* **`ride-service` (Port 5004):** The core lifecycle engine managing ride creation, geospatial request matching, pricing, and ride updates.
* **`notification-service` (Port 5005):** An event-driven background service handling SMTP email updates and internal notifications.
* **`rabbitmq` (Ports 5672, 15672):** The asynchronous message broker enforcing pub/sub topic exchange communications across the entire mesh.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS, Redux Toolkit
* **Backend:** Node.js, Express.js
* **Databases:** MongoDB Atlas (Multi-cluster isolation)
* **Caching & Session Storage:** Redis Cloud
* **Message Broker:** RabbitMQ (AMQP Advanced Message Queuing Protocol)
* **Containerization:** Docker & Docker Compose

---

## 🔑 Hardened Environment Configuration

RideMesh enforces strict security boundaries by separating development scripts from runtime credentials. All sensitive connection tokens are managed through a single root-level `.env` file which is **strictly excluded** from Git version control via `.gitignore`.

To set up the project locally, create a `.env` file at the root of the project with the following keys:

```text
# --- GLOBAL SECRETS ---
JWT_SECRET_KEY=your_jwt_secret_key
JWT_SECRET_KEY_FOR_REFRESHTOKEN=your_refresh_token_secret_key

# --- MONGODB ATLAS PRODUCTION URIS ---
MONGO_URI_AUTH=mongodb+srv://...
MONGO_URI_USER=mongodb+srv://...
MONGO_URI_DRIVER=mongodb+srv://...
MONGO_URI_RIDE=mongodb+srv://...
MONGO_URI_NOTIF=mongodb+srv://...

# --- REDIS CLOUD CREDENTIALS ---
REDIS_HOST=your_redis_cloud_endpoint
REDIS_PORT=your_redis_port
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_cloud_password

# --- SMTP EMAIL SERVICE ---
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_specific_password

# --- FRONTEND CLIENT URL ---
CLIENT_URL=http://localhost:5173
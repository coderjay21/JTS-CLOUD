# JTS-Cloud (Learning & MVP Project) 🚀



# IT'S A WORK IN PROGRESS, SO PLEASE BEAR WITH ME.
MOBILE SEETUP KESE KRNA HAI VO ABHI ACCHE SE NAHI BATAYA GAYA HAI, LEKIN JALDI UPDATE KR DUNGA. ABHI K LIYE AAP BACKEND AUR FRONTEND KA CODE CLONE KR SAKTE HO .

---

JTS-Cloud is a personal cloud storage project built primarily for learning the MERN stack and exploring hardware-level integrations. The core focus of this project is to build a functional cloud storage engine on a small scale while creating a customized, zero-cost authentication system.

Instead of using paid third-party SMS services (like Twilio or Firebase), this project features a custom-built, self-hosted SMS Gateway that utilizes a local Android smartphone running Termux to deliver OTPs.

---

# 🛠️ Project Goals & Features (What I Built & Learnt)

- **Custom SMS Gateway (₹0 Cost Jugaad):** Connected a local Redmi (my personal Android device) running Termux to my laptop's Node.js backend via the local network to trigger real-time SMS verification.

- **Jio Operator Filter Bypass:** Learnt how telecom filters block automated texts, and fixed it by changing the backend code to send human-like conversational text patterns (`Your JTS-Cloud code...`).

- **Secure MVP Authentication:** Implemented a functional 6-digit random OTP generator with a 5-minute database expiry window, returning a secure JSON Web Token (JWT) on success.

- **Basic Security Practices:** Applied backend safety layers like Helmet for security headers, strict JSON payload size limits (max 100kb), and Express Rate Limiting to avoid spam hits.

- **Basic Error Interception:** Handled global errors (`uncaughtException` and `unhandledRejection`) to keep the local Node.js process from crashing during development testing.

---

# 🏗️ Tech Stack & Architecture

- **Frontend:** React.js (Vite)
- **Backend:** Node.js + Express.js REST API
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT + OTP Verification
- **Device Bridge:** Termux Engine (F-Droid version) + Termux:API package
- **Network Protocol:** HTTP requests over local Wi-Fi / Hotspot network

---

# 📁 Project Folder Structure

Make sure your local directory structure looks like this before starting:

```text
JTS-CLOUD/
├── backend/            # Express.js core server logic
├── frontend/           # React.js web application
└── jts-sms-gateway/    # Script running inside your Android phone (Termux)
```

---

# 📁 Environment Setup (`.env`)

Create a `.env` file inside your `backend/` folder:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_local_secret_key
JWT_EXPIRES_IN=30d
SMS_GATEWAY_URL=http://<YOUR_TERMUX_IP>:8080/send-sms
FRONTEND_URL=http://localhost:5173
```

---

# 🚀 How to Setup and Run Locally

Follow these sequential steps to get the entire ecosystem up and running on your local machine and phone.

---

# 📱 Step 1: Phone Setup (Termux SMS Gateway)

## 1. Install Required Applications

Download and install the following apps strictly from the F-Droid repository:

- Termux
- Termux:API

> ⚠️ Do NOT use Play Store versions because they are outdated and may break functionality.

---

## 2. Grant Permissions

Open:

```text
Android Settings → Apps → Termux:API
```

Enable these permissions:

- SMS Permission
- Phone Permission

Also:

- Disable Battery Saver Restrictions
- Enable Autostart for both Termux apps

---

## 3. Initialize Termux Environment

Open Termux and run:

```bash
termux-setup-storage

pkg update && pkg upgrade -y

pkg install termux-api nodejs -y
```

---

## 4. Run the SMS Gateway Server

Navigate to your gateway folder and start the listener:

```bash
cd jts-sms-gateway

npm install

node server.js
```

---

## 5. Get Your Phone's Local IP Address

Run:

```bash
ifconfig
```

Look for the `wlan0` section and note down the IP address.

Example:

```text
10.166.X.X
```

Your SMS gateway port will run on:

```text
8080
```

---

# 💻 Step 2: Backend Server Setup (Laptop)

## 1. Navigate to Backend Directory

```bash
cd backend
```

---

## 2. Install Backend Dependencies

```bash
npm install express cors helmet express-rate-limit mongoose dotenv axios jsonwebtoken
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=8000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_custom_secure_jwt_secret_key
JWT_EXPIRES_IN=30d
SMS_GATEWAY_URL=http://<YOUR_PHONE_IP_FROM_IFCONFIG>:8080/send-sms
FRONTEND_URL=http://localhost:5173
```

---

## 4. Start Backend Development Server

```bash
node server.js
```

---

# 💻 Step 3: Frontend Web Setup (Laptop)

## 1. Navigate to Frontend Directory

```bash
cd ../frontend
```

---

## 2. Install Frontend Dependencies

```bash
npm install

npm install axios
```

---

## 3. Start React Development Server

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

---

# 🧪 Active API Endpoints Reference (Postman Testing)

# 🔐 Authentication Matrix

---

## 1. Send OTP Sequence

### Endpoint

```http
POST http://localhost:8000/api/v1/auth/send-otp
```

### Body (Raw JSON)

```json
{
  "name": "Jay Agarwal",
  "phone": "YOUR_10_DIGIT_PHONE_NUMBER"
}
```

---

## 2. Verify OTP Sequence

### Endpoint

```http
POST http://localhost:8000/api/v1/auth/verify-otp
```

### Body (Raw JSON)

```json
{
  "phone": "YOUR_10_DIGIT_PHONE_NUMBER",
  "otp": "RECEIVED_6_DIGIT_OTP"
}
```

---

# ⚠️ Known Constraints & Small-Scale Limits (Asli Realities)

Since this is a learning experiment, it has clear limitations and is **not meant for commercial production use**.

---

## 1. Concurrency Limit

A normal SIM card and Android OS cannot process heavy concurrent SMS traffic efficiently.

If multiple users request OTPs simultaneously:

- Messages may queue
- SMS delivery may slow down
- Some requests may fail

---

## 2. Dynamic IP Problem

Local Wi-Fi IP addresses change frequently.

If your phone's IP changes:

- Backend requests will fail
- You must manually update:

```env
SMS_GATEWAY_URL=http://NEW_PHONE_IP:8080/send-sms
```

inside your backend `.env` file.

---

## 3. Telecom Operator Restrictions

Sending too many automated SMS requests using normal Jio/Airtel SIM cards may cause:

- SMS throttling
- Temporary blocking
- Spam detection flags

This setup is intended only for:

- Learning purposes
- Local MVP experiments
- Small-scale testing

# 👨‍💻 Author

Built with curiosity, jugaad engineering, and pure learning mindset by **Jay Agarwal** 🚀

---
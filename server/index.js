const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

// =========================
// APP + SERVER
// =========================
const app = express();
const server = http.createServer(app);

// =========================
// WEB SOCKET (NEWS ENGINE)
// =========================
const startNewsSocket = require("./ws/newsSocket");

// =========================
// CORS CONFIG
// =========================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://kyc-rho.vercel.app",
  "https://bitclub.vercel.app",
  "https://apex-investment.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// =========================
// OPTIONAL MANUAL HEADERS (SAFE)
// =========================
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
});

// =========================
// MIDDLEWARE
// =========================
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// =========================
// ROUTES
// =========================
app.use("/", require("./routes/authRoute"));
app.use("/api", require("./routes/newsRoute"));

// =========================
// DATABASE
// =========================
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Database Connected successfully!"))
  .catch((error) => console.log("❌ Database not connected:", error));

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 Bitclub running at http://localhost:${PORT}`);

  // =========================
  // START NEWS WEBSOCKET ENGINE
  // =========================
  startNewsSocket(server);
});
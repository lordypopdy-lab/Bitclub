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

app.set("trust proxy", 1);

const startNewsSocket = require("./ws/newsSocket");

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://kyc-rho.vercel.app",
  "https://bitclub.vercel.app",
  "https://bitclub-spa.vercel.app",
  "https://apex-investment.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.use("/", require("./routes/authRoute"));
app.use("/api", require("./routes/newsRoute"));

app.get("/", (req, res) => {
  res.send("Bitclub API running...");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database Connected successfully!");
  })
  .catch((error) => {
    console.log("Database not connected:", error);
  });

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 Bitclub running at port ${PORT}`);

  startNewsSocket(server);
});
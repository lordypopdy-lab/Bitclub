const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');

const { startMarketServer } = require("./controllers/authCryptoMarket");

const app = express();
const server = http.createServer(app); // 👈 create HTTP server from Express

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', require('./routes/authRoute'));

// Start WebSocket server on the same HTTP server
startMarketServer(server); // 👈 pass server into market controller

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Database Connected successfully!'))
  .catch((error) => console.log('Database not connected', error));

// Start combined server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Bitclub running at http://localhost:${PORT}`);
});

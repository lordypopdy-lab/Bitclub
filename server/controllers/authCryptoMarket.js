import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";

const MarketGetter = async (req, res)=> {

// === Create HTTP and Express server ===
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// === Store connected frontends ===
const clients = new Set();

wss.on("connection", (ws) => {
  console.log("📡 Frontend connected");
  clients.add(ws);

  ws.on("close", () => {
    console.log("❌ Frontend disconnected");
    clients.delete(ws);
  });

  // Optional: heartbeat ping to keep alive
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) ws.ping();
  }, 10000);

  ws.on("close", () => clearInterval(pingInterval));
});

// === Binance WebSocket Setup ===
const streams = [
  "bnbusdt@aggTrade",
  "btcusdt@markPrice",
  "ethusdt@aggTrade",
  "solusdt@markPrice",
  "xrpusdt@aggTrade",
  "adausdt@markPrice",
  "dogeusdt@aggTrade",
  "maticusdt@markPrice",
  "ltcusdt@aggTrade",
  "trxusdt@markPrice",
  "dotusdt@aggTrade",
  "avaxusdt@markPrice",
];

const binanceUrl = `wss://fstream.binance.com/stream?streams=${streams.join("/")}`;

let binanceSocket;

function connectToBinance() {
  console.log("🔗 Connecting to Binance WebSocket...");
  binanceSocket = new WebSocket(binanceUrl);

  binanceSocket.on("open", () => {
    console.log("✅ Connected to Binance WebSocket");
  });

  binanceSocket.on("message", (data) => {
    try {
      const parsed = JSON.parse(data);
      const stream = parsed.stream;
      const payload = parsed.data;

      let formatted;

      if (stream.endsWith("@aggTrade")) {
        formatted = {
          type: "trade",
          symbol: stream.split("@")[0],
          price: payload.p,
          quantity: payload.q,
          timestamp: payload.T,
        };
      } else if (stream.endsWith("@markPrice")) {
        formatted = {
          type: "markPrice",
          symbol: stream.split("@")[0],
          markPrice: payload.p,
          time: payload.E,
        };
      }

      // Broadcast to all connected frontends
      if (formatted) {
        for (const client of clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(formatted));
          }
        }
      }
    } catch (err) {
      console.error("❌ Error parsing Binance data:", err);
    }
  });

  binanceSocket.on("close", () => {
    console.warn("🔌 Binance WebSocket closed. Reconnecting...");
    setTimeout(connectToBinance, 5000); // Reconnect after delay
  });

  binanceSocket.on("error", (err) => {
    console.error("🚨 Binance WebSocket error:", err);
    binanceSocket.close();
  });
}

connectToBinance(); // Start connection


// === Start the server ===
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Backend WebSocket server running at ws://localhost:${PORT}`);
});
}


module.exports = {
    MarketGetter,
};
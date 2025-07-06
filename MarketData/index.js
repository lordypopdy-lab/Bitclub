import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import fs from "fs";

// === Create HTTP and Express server ===
const app = express();
const server = http.createServer(app);

// === Store clients per stream type ===
const markPriceClients = new Set();
const aggTradeClients = new Set();
const tickerClients = new Set(); // NEW

// === Load streams from JSON files ===
const markPriceRaw = fs.readFileSync("./component/MarketPrice.json");
const aggTradeRaw = fs.readFileSync("./component/AggTrade.json");
const tickerRaw = fs.readFileSync("./component/Ticker.json"); // NEW

const { streams: markPriceStreams } = JSON.parse(markPriceRaw);
const { streams: aggTradeStreams } = JSON.parse(aggTradeRaw);
const { streams: tickerStreams } = JSON.parse(tickerRaw); // NEW

// === Setup WebSocket servers ===
const wssMarkPrice = new WebSocketServer({ noServer: true });
const wssAggTrade = new WebSocketServer({ noServer: true });
const wssTicker = new WebSocketServer({ noServer: true }); // NEW

// === Handle upgrade requests ===
server.on("upgrade", (req, socket, head) => {
  const { url } = req;

  if (url === "/ws/markPrice") {
    wssMarkPrice.handleUpgrade(req, socket, head, (ws) => {
      wssMarkPrice.emit("connection", ws, req);
    });
  } else if (url === "/ws/aggTrade") {
    wssAggTrade.handleUpgrade(req, socket, head, (ws) => {
      wssAggTrade.emit("connection", ws, req);
    });
  } else if (url === "/ws/ticker") {
    wssTicker.handleUpgrade(req, socket, head, (ws) => {
      wssTicker.emit("connection", ws, req);
    });
  } else {
    socket.destroy();
  }
});

// === Handle frontend WebSocket connections ===
function setupClientManager(wss, clientSet, label) {
  wss.on("connection", (ws) => {
    console.log(`📡 ${label} client connected`);
    clientSet.add(ws);

    ws.on("close", () => {
      console.log(`❌ ${label} client disconnected`);
      clientSet.delete(ws);
    });

    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    }, 10000);

    ws.on("close", () => clearInterval(pingInterval));
  });
}

setupClientManager(wssMarkPrice, markPriceClients, "MarkPrice");
setupClientManager(wssAggTrade, aggTradeClients, "AggTrade");
setupClientManager(wssTicker, tickerClients, "Ticker"); // NEW

// === Connect to Binance WebSocket and forward to clients ===
function connectToBinance(streams, type, clientSet) {
  const streamPath = streams.join("/");
  const url = `wss://fstream.binance.com/stream?streams=${streamPath}`;
  let socket;

  function start() {
    console.log(`🔗 Connecting to Binance (${type})...`);
    socket = new WebSocket(url);

    socket.on("open", () => {
      console.log(`✅ Connected to Binance (${type})`);
    });

    socket.on("message", (data) => {
      try {
        const parsed = JSON.parse(data);
        const stream = parsed.stream;
        const payload = parsed.data;
        const symbol = stream.split("@")[0];

        let formatted;
        if (type === "markPrice") {
          formatted = {
            type: "markPrice",
            symbol,
            markPrice: payload.p,
            time: payload.E,
          };
        } else if (type === "aggTrade") {
          formatted = {
            type: "trade",
            symbol,
            price: payload.p,
            quantity: payload.q,
            timestamp: payload.T,
          };
        } else if (type === "ticker") {
          formatted = {
            type: "ticker",
            symbol,
            priceChange: payload.p,
            priceChangePercent: payload.P,
            lastPrice: payload.c,
            highPrice: payload.h,
            lowPrice: payload.l,
            volume: payload.v,
            time: payload.E,
          };
        }

        if (formatted) {
          for (const client of clientSet) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(formatted));
            }
          }
        }
      } catch (err) {
        console.error(`❌ Error (${type}):`, err);
      }
    });

    socket.on("close", () => {
      console.warn(`🔌 Binance (${type}) WebSocket closed. Reconnecting...`);
      setTimeout(start, 5000);
    });

    socket.on("error", (err) => {
      console.error(`🚨 Binance (${type}) error:`, err);
      socket.close();
    });
  }

  start();
}

// === Start separate Binance WebSocket connections ===
connectToBinance(markPriceStreams, "markPrice", markPriceClients);
connectToBinance(aggTradeStreams, "aggTrade", aggTradeClients);
connectToBinance(tickerStreams, "ticker", tickerClients); // NEW

// === Start server ===
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running at ws://localhost:${PORT}`);
  console.log("👉 /ws/markPrice for Mark Price");
  console.log("👉 /ws/aggTrade for Agg Trade");
  console.log("👉 /ws/ticker     for 24hr Ticker"); // NEW
});

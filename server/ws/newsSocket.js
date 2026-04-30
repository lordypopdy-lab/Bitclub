const WebSocket = require("ws");
const { fetchNewsFromSources } = require("../services/newsService");
const { rankNews } = require("../utils/rankNews");

let clients = [];

const startNewsSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);

    ws.on("close", () => {
      clients = clients.filter((c) => c !== ws);
    });
  });

  // 🔥 PUSH NEWS EVERY 20 SECONDS
  setInterval(async () => {
    const news = await fetchNewsFromSources();
    const ranked = rankNews(news).slice(0, 20);

    clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(ranked));
      }
    });
  }, 20000);
};

module.exports = startNewsSocket;
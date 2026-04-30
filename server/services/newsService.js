const axios = require("axios");
const Parser = require("rss-parser");

const parser = new Parser();

// =========================
// FETCH NEWS FROM SOURCES
// =========================
const fetchNewsFromSources = async () => {
  try {
    const [newsApiRes, cryptoPanicRes, coinDeskFeed] = await Promise.allSettled([
      axios.get(`https://newsapi.org/v2/everything`, {
        params: {
          q: "crypto OR bitcoin OR ethereum",
          sortBy: "publishedAt",
          language: "en",
          pageSize: 20,
          apiKey: process.env.NEWS_API_KEY,
        },
        timeout: 5000,
      }),

      axios.get(`https://cryptopanic.com/api/v1/posts/`, {
        params: {
          auth_token: process.env.CRYPTOPANIC_KEY,
          public: true,
        },
        timeout: 5000,
      }),

      parser.parseURL("https://www.coindesk.com/arc/outboundfeeds/rss/"),
    ]);

    let combined = [];

    // =========================
    // NEWSAPI
    // =========================
    if (newsApiRes.status === "fulfilled") {
      const articles = newsApiRes.value.data?.articles || [];
      combined.push(...articles.map(mapNewsApi));
    }

    // =========================
    // CRYPTOPANIC
    // =========================
    if (cryptoPanicRes.status === "fulfilled") {
      const results = cryptoPanicRes.value.data?.results || [];
      combined.push(...results.map(mapCryptoPanic));
    }

    // =========================
    // COINDESK RSS
    // =========================
    if (coinDeskFeed.status === "fulfilled") {
      const items = coinDeskFeed.value.items || [];
      combined.push(...items.map(mapRss));
    }

    return combined;
  } catch (error) {
    console.log("Aggregator error:", error.message);
    return [];
  }
};

// =========================
// NORMALIZERS
// =========================
const mapNewsApi = (item) => ({
  title: item.title,
  url: item.url,
  image: item.urlToImage,
  source: "NewsAPI",
  publishedAt: item.publishedAt,
  type: "news",
});

const mapCryptoPanic = (item) => ({
  title: item.title,
  url: item.url,
  image: item.image,
  source: "CryptoPanic",
  publishedAt: item.published_at,
  type: "news",
});

const mapRss = (item) => ({
  title: item.title,
  url: item.link,
  image: null,
  source: "CoinDesk",
  publishedAt: item.pubDate,
  type: "news",
});

module.exports = { fetchNewsFromSources };
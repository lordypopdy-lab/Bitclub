const axios = require("axios");
const Parser = require("rss-parser");

const parser = new Parser();

// =========================
// EXTRACT IMAGE FROM HTML
// =========================
const extractImageFromContent = (content) => {
  if (!content) return null;

  const match = content.match(/<img.*?src="(.*?)"/i);
  return match ? match[1] : null;
};

// =========================
// SAFE IMAGE (NO PLACEHOLDER BUG)
// =========================
const getSafeImage = (img) => {
  if (!img) return "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600";
  return img;
};

// =========================
// FETCH NEWS FROM SOURCES
// =========================
const fetchNewsFromSources = async () => {
  try {
    const [newsApiRes, cryptoPanicRes, coinDeskFeed] =
      await Promise.allSettled([
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

      combined.push(
        ...articles.map((item) => ({
          title: item.title,
          url: item.url,
          image: getSafeImage(item.urlToImage),
          source: item.source?.name || "NewsAPI",
          publishedAt: item.publishedAt,
          description: item.description,
          content: item.content,
        }))
      );
    }

    // =========================
    // CRYPTOPANIC
    // =========================
    if (cryptoPanicRes.status === "fulfilled") {
      const results = cryptoPanicRes.value.data?.results || [];

      combined.push(
        ...results.map((item) => ({
          title: item.title,
          url: item.url,
          image: getSafeImage(item.thumbnail || item.image),
          source: "CryptoPanic",
          publishedAt: item.published_at,
          description: item.title,
          content: item.title,
        }))
      );
    }

    // =========================
    // COINDESK RSS (FIXED)
    // =========================
    if (coinDeskFeed.status === "fulfilled") {
      const items = coinDeskFeed.value.items || [];

      combined.push(
        ...items.map((item) => {
          const image =
            item.enclosure?.url ||
            extractImageFromContent(item["content:encoded"]) ||
            extractImageFromContent(item.content);

          return {
            title: item.title,
            url: item.link,
            image: getSafeImage(image),
            source: "CoinDesk",
            publishedAt: item.pubDate,
            description: item.contentSnippet,
            content: item.contentSnippet,
          };
        })
      );
    }

    // =========================
    // SORT (LATEST FIRST)
    // =========================
    combined.sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    return combined;
  } catch (error) {
    console.log("Aggregator error:", error.message);
    return [];
  }
};

module.exports = { fetchNewsFromSources };
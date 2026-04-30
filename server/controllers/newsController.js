const NodeCache = require("node-cache");
const { fetchNewsFromSources } = require("../services/newsService");
const { rankNews } = require("../utils/rankNews");

const cache = new NodeCache({ stdTTL: 30 }); // 30 sec cache
let fallback = [];

const getCryptoNews = async (req, res) => {
  try {
    const cached = cache.get("news");

    if (cached) {
      return res.json({ source: "cache", articles: cached });
    }

    let news = await fetchNewsFromSources();

    news = rankNews(news).slice(0, 30);

    cache.set("news", news);
    fallback = news;

    return res.json({ source: "live", articles: news });
  } catch (err) {
    console.log(err.message);

    return res.json({
      source: "fallback",
      articles: fallback,
    });
  }
};

module.exports = { getCryptoNews };
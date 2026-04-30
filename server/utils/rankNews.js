const rankNews = (news) => {
  const now = Date.now();

  return news
    .map((item) => {
      const timeScore = Math.max(
        0,
        100 - (now - new Date(item.publishedAt).getTime()) / 600000
      );

      const keywordScore =
        /bitcoin|btc|ethereum|eth|crypto|hack|etf/i.test(item.title)
          ? 30
          : 10;

      const sourceScore =
        item.source === "CryptoPanic" ? 30 :
        item.source === "NewsAPI" ? 20 : 15;

      return {
        ...item,
        score: timeScore + keywordScore + sourceScore,
      };
    })
    .sort((a, b) => b.score - a.score);
};

module.exports = { rankNews };
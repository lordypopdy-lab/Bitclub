const rateLimit = require("express-rate-limit");

const newsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many requests. Slow down.",
});

module.exports = newsLimiter;
const express = require("express");
const router = express.Router();
const { getCryptoNews } = require("../controllers/newsController");
const newsLimiter = require("../middlewares/rateLimit");

router.get("/getCryptoNews", newsLimiter, getCryptoNews);

module.exports = router;
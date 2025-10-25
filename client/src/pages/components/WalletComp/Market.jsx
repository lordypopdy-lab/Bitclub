import React, { useEffect, useState } from "react";

const Market = () => {
  const [priceBackup, setPriceBackup] = useState({});
  const [pricesTicker, setPricesTicker] = useState({});

  useEffect(() => {
    // ✅ Normalize symbols for consistency (important for merging)
    const normalize = (s) => s?.toUpperCase().replace("/", "") || "";

    // ✅ Load token data from localStorage
    const rawData = JSON.parse(localStorage.getItem("tokens")) || [];
    const transformed = {};

    rawData.forEach((coin) => {
      const sym = normalize(coin.symbol);
      if (sym) transformed[sym] = coin;
    });

    setPriceBackup(transformed);

    // ✅ Connect WebSocket for live prices
    const socketTicker = new WebSocket(import.meta.env.VITE_API_MARKET_TICKER);

    socketTicker.onopen = () => console.log("✅ Ticker WebSocket connected");

    socketTicker.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const symbol = normalize(msg.symbol || msg.s);
        if (!symbol) return;

        // Map Binance-like structure safely
        const newData = {
          lastPrice: Number(msg.c ?? msg.lastPrice ?? 0),
          priceChangePercent: Number(msg.P ?? msg.priceChangePercent ?? 0),
          volume: Number(msg.v ?? msg.volume ?? 0),
        };

        setPricesTicker((prev) => ({
          ...prev,
          [symbol]: {
            ...prev[symbol],
            ...newData,
          },
        }));
      } catch (e) {
        console.error("❌ Invalid WS message:", e);
      }
    };

    socketTicker.onerror = (err) =>
      console.error("❌ Ticker WebSocket error:", err);
    socketTicker.onclose = () => console.warn("🔌 WebSocket disconnected");

    return () => socketTicker.close();
  }, []);

  // ✅ Merge live + backup data (WebSocket overrides)
  const allSymbols = Object.keys({
    ...priceBackup,
    ...pricesTicker,
  });

  const formatVolume = (value) => {
    const num = Number(value || 0);
    if (num >= 1e12) return (num / 1e12).toFixed(4) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(4) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(4) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(4) + "K";
    return num.toFixed(2);
  };

  const getValidNumber = (val) =>
    val !== undefined && val !== null && val !== "" && !isNaN(val)
      ? Number(val)
      : null;

  return (
    <>
      {allSymbols.map((symbol) => {
        const backup = priceBackup[symbol] || {};
        const ticker = pricesTicker[symbol] || {};

        const tokenName = backup.name || symbol.replace("USDT", "");
        const image = backup.image || "/placeholder.png";

        // ✅ Always prefer valid live data
        const lastPrice =
          getValidNumber(ticker.lastPrice) ??
          getValidNumber(backup.current_price) ??
          0;

        const changePercent =
          getValidNumber(ticker.priceChangePercent) ??
          getValidNumber(backup.price_change_percentage_24h) ??
          0;

        const volume =
          getValidNumber(ticker.volume) ??
          getValidNumber(backup.total_volume) ??
          getValidNumber(backup.volume) ??
          0;

        const formattedChange =
          changePercent > 0
            ? `+${changePercent.toFixed(3)}%`
            : `${changePercent.toFixed(3)}%`;

        const changeColor = changePercent > 0 ? "text-primary" : "text-red";

        return (
          <li key={symbol} style={{ marginTop: "9px" }}>
            <a
              data-bs-toggle="modal"
              data-bs-target="#detailChart"
              className="coin-item style-1 gap-12 bg-surface"
            >
              <img src={image} alt={tokenName} className="img" />
              <div className="content">
                <div className="title">
                  <p className="mb-4 text-large">{tokenName}</p>
                  <span className="text-secondary">
                    ${formatVolume(volume)}
                  </span>
                </div>
                <div className="box-price">
                  <p className="text-small mb-4">
                    <span className="text-light">
                      $
                      {lastPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </p>
                  <p className={`text-end ${changeColor}`}>{formattedChange}</p>
                </div>
              </div>
            </a>
          </li>
        );
      })}
    </>
  );
};

export default Market;

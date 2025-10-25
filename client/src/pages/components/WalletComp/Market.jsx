import React, { useEffect, useState } from "react";

const Market = () => {
  const [priceBackup, setPriceBack] = useState({});
  const [pricesTicker, setPricesTicker] = useState({});

  useEffect(() => {
    // Load token data from localStorage
    const rawData = JSON.parse(localStorage.getItem("tokens")) || [];
    const transformed = {};

    rawData.forEach((coin) => {
      if (coin.symbol) {
        transformed[coin.symbol.toUpperCase()] = coin;
      }
    });

    setPriceBack(transformed);

    // Connect WebSocket for live prices
    const socketTcker = new WebSocket(import.meta.env.VITE_API_MARKET_TICKER);

    socketTcker.onopen = () => console.log("✅ Ticker WebSocket connected");

    socketTcker.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const symbol = msg.symbol?.toUpperCase();
        if (!symbol) return;

        setPricesTicker((prev) => ({
          ...prev,
          [symbol]: {
            ...prev[symbol],
            ...msg,
          },
        }));
      } catch (e) {
        console.error("❌ Invalid WS message:", e);
      }
    };

    socketTcker.onerror = (err) =>
      console.error("❌ Ticker WebSocket error:", err);
    socketTcker.onclose = () => console.warn("🔌 WebSocket disconnected");

    return () => socketTcker.close();
  }, []);

  // Merge WebSocket and backup data
  const allSymbols = [
    ...new Set([
      ...Object.keys(priceBackup || {}),
      ...Object.keys(pricesTicker || {}),
    ]),
  ];

  const formatVolume = (value) => {
    const num = Number(value || 0);
    if (num >= 1e12) return (num / 1e12).toFixed(5) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(5) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(5) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(5) + "K";
    return num.toFixed(2);
  };

  return (
    <>
      {allSymbols.map((symbol) => {
        const backup = priceBackup[symbol] || {};
        const ticker = pricesTicker[symbol] || {};

        const tokenName = backup.name || symbol.replace("USDT", "");
        const image = backup.image || "/placeholder.png";

        // Live or fallback values
        const lastPrice = ticker.lastPrice || backup.current_price || 0;
        const changePercent =
          ticker.priceChangePercent || backup.price_change_percentage_24h || 0;
        const volume =
          ticker.volume || backup.total_volume || backup.volume || 0;

        // Add + or – before change
        const formattedChange =
          changePercent > 0
            ? `+${Number(changePercent).toFixed(2)}%`
            : `${Number(changePercent).toFixed(2)}%`;

        // Red for negative, blue for positive
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
                      {Number(lastPrice).toLocaleString(undefined, {
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

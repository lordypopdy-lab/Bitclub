import React, { useEffect, useState } from "react";

const Market = () => {
  const [priceBackup, setPriceBack] = useState({});
  const [pricesTicker, setPricesTicker] = useState({});

  useEffect(() => {
    const rawData = JSON.parse(localStorage.getItem("tokens")) || [];
    const transformed = {};

    rawData.forEach((coin) => {
      if (coin.symbol) {
        transformed[coin.symbol.toUpperCase()] = coin;
      }
    });

    setPriceBack(transformed);

    // ✅ Connect to WebSocket
    const socketTicker = new WebSocket(import.meta.env.VITE_API_MARKET_TICKER);

    socketTicker.onopen = () => console.log("✅ Ticker WebSocket connected");

    socketTicker.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        // ✅ Binance sends data for one symbol per message
        if (!msg.symbol) return;
        const symbol = msg.symbol.toUpperCase();

        // ✅ Normalize Binance ticker fields
        const updated = {
          symbol,
          lastPrice: parseFloat(msg.c ?? msg.lastPrice ?? 0),
          priceChangePercent: parseFloat(
            msg.P ?? msg.priceChangePercent ?? 0
          ),
          volume: parseFloat(msg.v ?? msg.volume ?? 0),
        };

        setPricesTicker((prev) => ({
          ...prev,
          [symbol]: updated,
        }));
      } catch (err) {
        console.error("❌ Invalid WS message:", err);
      }
    };

    socketTicker.onerror = (err) =>
      console.error("❌ WebSocket error:", err);
    socketTicker.onclose = () => console.warn("🔌 WebSocket disconnected");

    return () => socketTicker.close();
  }, []);

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
          0;

        const formattedChange =
          changePercent > 0
            ? `+${changePercent.toFixed(2)}%`
            : `${changePercent.toFixed(2)}%`;

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

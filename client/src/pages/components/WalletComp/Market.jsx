import React, { useEffect, useState } from "react";

const Market = () => {
  const [priceBackup, setPriceBackup] = useState({});
  const [pricesTicker, setPricesTicker] = useState({});

  useEffect(() => {
    // Load backup data from localStorage and normalize keys to UPPERCASE
    const rawData = JSON.parse(localStorage.getItem("tokens")) || [];
    const transformed = {};
    rawData.forEach((coin) => {
      if (coin.symbol) {
        transformed[coin.symbol.toUpperCase()] = coin;
      }
    });
    setPriceBackup(transformed);

    // Connect WebSocket for live ticker updates
    const socketTicker = new WebSocket(import.meta.env.VITE_API_MARKET_TICKER);

    socketTicker.onopen = () => console.log("✅ Connected to Ticker WebSocket");

    socketTicker.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // support both array payloads and single object payloads
        const items = Array.isArray(data) ? data : [data];

        setPricesTicker((prev) => {
          const next = { ...prev };

          items.forEach((msg) => {
            // symbol might be in different fields or lower/upper case
            const rawSymbol = msg.s || msg.symbol || msg.S || msg.sym;
            if (!rawSymbol) return;

            const symbolKey = String(rawSymbol).toUpperCase();

            // parse common fields from various ticker formats (Binance uses c, P, v)
            // prefer common names: lastPrice, priceChangePercent, volume
            const lastPriceRaw = msg.c ?? msg.lastPrice ?? msg.price ?? msg.priceClose ?? null;
            const changePercentRaw = msg.P ?? msg.priceChangePercent ?? msg.priceChange ?? null;
            const volumeRaw = msg.v ?? msg.volume ?? msg.q ?? null;

            const lastPrice = lastPriceRaw !== undefined && lastPriceRaw !== null && lastPriceRaw !== ""
              ? Number(lastPriceRaw)
              : undefined;

            const priceChangePercent = changePercentRaw !== undefined && changePercentRaw !== null && changePercentRaw !== ""
              ? Number(changePercentRaw)
              : undefined;

            const volume = volumeRaw !== undefined && volumeRaw !== null && volumeRaw !== ""
              ? Number(volumeRaw)
              : undefined;

            // merge keeping previous fields if WS didn't send them
            next[symbolKey] = {
              ...next[symbolKey],
              ...(lastPrice !== undefined ? { lastPrice } : {}),
              ...(priceChangePercent !== undefined ? { priceChangePercent } : {}),
              ...(volume !== undefined ? { volume } : {}),
            };
          });

          return next;
        });
      } catch (err) {
        console.error("❌ Error parsing WS message:", err);
      }
    };

    socketTicker.onerror = (err) =>
      console.error("❌ WebSocket error:", err?.message || err);
    socketTicker.onclose = () => console.warn("🔌 Ticker WebSocket disconnected");

    return () => socketTicker.close();
  }, []);

  // small auto-refresh to keep UI reactive if needed
  useEffect(() => {
    const id = setInterval(() => {
      setPricesTicker((p) => ({ ...p }));
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const allSymbols = [
    ...new Set([
      ...Object.keys(priceBackup || {}),
      ...Object.keys(pricesTicker || {}),
    ]),
  ];

  const formatVolume = (val) => {
    const num = Number(val || 0);
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
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

        // prefer valid WS values, else fallback to backup
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
                  <span className="text-secondary">${formatVolume(volume)}</span>
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

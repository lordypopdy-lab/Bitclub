import React, { useEffect, useState } from "react";

const Market = () => {
  const [priceBackup, setPriceBackup] = useState({});
  const [pricesTicker, setPricesTicker] = useState({});

  useEffect(() => {
    // Load token data from localStorage and normalize keys
    const rawData = JSON.parse(localStorage.getItem("tokens")) || [];
    const transformed = {};
    rawData.forEach((coin) => {
      if (coin.symbol) {
        transformed[coin.symbol.toUpperCase()] = coin;
      }
    });
    setPriceBackup(transformed);

    // Connect to WebSocket
    const socketTicker = new WebSocket(import.meta.env.VITE_API_MARKET_TICKER);

    socketTicker.onopen = () => console.log("✅ Connected to Ticker WebSocket");

    socketTicker.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle single or multiple messages
        const items = Array.isArray(data) ? data : [data];

        setPricesTicker((prev) => {
          const next = { ...prev };

          items.forEach((msg) => {
            // Binance sends 's' (symbol), lowercase like btcusdt
            const rawSymbol =
              msg.s || msg.symbol || msg.S || msg.sym || msg.pair;
            if (!rawSymbol) return;

            const symbolKey = String(rawSymbol).toUpperCase();

            // Debug once to confirm fields
            if (!next.__debugPrinted) {
              console.log("📦 WS sample message:", msg);
              next.__debugPrinted = true; // prevent spamming
            }

            // Extract known Binance ticker fields
            const lastPrice =
              Number(msg.c ?? msg.lastPrice ?? msg.price ?? msg.p ?? 0) || null;
            const priceChangePercent =
              Number(msg.P ?? msg.priceChangePercent ?? msg.percent ?? 0) || null;
            const volume =
              Number(msg.v ?? msg.V ?? msg.volume ?? msg.q ?? 0) || null;

            next[symbolKey] = {
              ...next[symbolKey],
              ...(lastPrice ? { lastPrice } : {}),
              ...(priceChangePercent ? { priceChangePercent } : {}),
              ...(volume ? { volume } : {}),
            };
          });

          return next;
        });
      } catch (err) {
        console.error("❌ WebSocket Parse Error:", err);
      }
    };

    socketTicker.onerror = (err) => console.error("❌ WebSocket error:", err);
    socketTicker.onclose = () => console.warn("🔌 WebSocket closed");

    return () => socketTicker.close();
  }, []);

  // Re-render every 30s for fallback refresh
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
  ].filter((s) => s !== "__debugPrinted");

  const formatVolume = (val) => {
    const num = Number(val || 0);
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

        // Prefer live WebSocket data
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
            <a data-bs-toggle="modal" data-bs-target="#detailChart">
              <img src={image} alt={tokenName} width="32" height="32" />
              <div>
                <div>
                  <p>{tokenName}</p>
                  <span>${formatVolume(volume)}</span>
                </div>
                <div>
                  <p>
                    $
                    {lastPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className={changeColor}>{formattedChange}</p>
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

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { DetailChartModal } from "../../models/DetailChartModal";

const Gainers = () => {
  const [priceBackup, setPriceBack] = useState({});
  const [pricesTicker, setPricesTicker] = useState({});
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Load cached tokens
    const loadTokens = () => {
      const rawData = JSON.parse(localStorage.getItem("tokens")) || [];
      const transformed = {};
      rawData.forEach((coin) => {
        if (coin.symbol) transformed[coin.symbol.toUpperCase()] = coin;
      });
      setPriceBack(transformed);
    };

    // WebSocket
    const connectTicker = () => {
      const ws = new WebSocket(import.meta.env.VITE_API_MARKET_TICKER);

      ws.onopen = () => console.log("✅ Ticker WebSocket connected");

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const symbol = msg.symbol?.toUpperCase();
        if (!symbol) return;

        setPricesTicker((prev) => ({
          ...prev,
          [symbol]: { ...prev[symbol], ...msg },
        }));
      };

      ws.onerror = (err) => console.error("❌ Ticker WebSocket error:", err);
      ws.onclose = () => console.warn("🔌 Ticker WebSocket disconnected");

      return () => ws.close();
    };

    loadTokens();
    connectTicker();

    // Auto refresh
    const interval = setInterval(() => {
      setRefreshTrigger((prev) => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Get gainers (LIVE first)
  const gainersList = Object.keys(pricesTicker)
    .filter((symbol) => pricesTicker[symbol]?.priceChangePercent > 0)
    .sort(
      (a, b) =>
        pricesTicker[b].priceChangePercent -
        pricesTicker[a].priceChangePercent
    )
    .slice(0, 10);

  // ✅ Fallback
  const fallbackList = Object.keys(priceBackup)
    .filter((symbol) => priceBackup[symbol]?.price_change_percentage_24h > 0)
    .sort(
      (a, b) =>
        priceBackup[b].price_change_percentage_24h -
        priceBackup[a].price_change_percentage_24h
    )
    .slice(0, 10);

  const finalList = gainersList.length > 0 ? gainersList : fallbackList;

  // ✅ OPEN MODAL (FIXED)
  const handleOpenModal = (symbol) => {
    const cleanSymbol = symbol.replace("USDT", ""); // 🔥 VERY IMPORTANT

    setSelectedCoin({
      symbol: cleanSymbol,
      name: priceBackup?.[cleanSymbol]?.name || cleanSymbol,
    });

    setIsModalOpen(true);
  };

  // ✅ FORMATTERS (same as Top)
  const formatPrice = (symbol) => {
    const live = pricesTicker?.[symbol + "USDT"]?.lastPrice;
    const backup = priceBackup?.[symbol]?.current_price || 0;

    return Number(live ?? backup).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatChange = (symbol) => {
    const live = pricesTicker?.[symbol + "USDT"]?.priceChangePercent;
    const backup = priceBackup?.[symbol]?.price_change_percentage_24h;

    const value =
      !isNaN(Number(live))
        ? Number(live)
        : !isNaN(Number(backup))
        ? Number(backup)
        : null;

    if (value === null) return { text: "--", isUp: true };

    return { text: value.toFixed(2) + "%", isUp: value >= 0 };
  };

  return (
    <div>
      {finalList.map((symbol, index) => {
        const cleanSymbol = symbol.replace("USDT", "");
        const change = formatChange(cleanSymbol);

        return (
          <li key={symbol + refreshTrigger} style={{ marginTop: "18px" }}>
            <a
              className="coin-item justify-content-between"
              onClick={() => handleOpenModal(symbol)}
            >
              <div className="d-flex align-items-center gap-12 flex-1">
                <h4 className="text-primary">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </h4>

                <p>
                  <span className="mb-4 text-button fw-6">
                    {cleanSymbol}
                  </span>
                  <span className="text-secondary"> / USDT</span>
                </p>
              </div>

              <div className="d-flex justify-content-between align-items-center flex-st2">
                <span className="text-small">
                  ${formatPrice(cleanSymbol)}
                </span>

                <div className="text-end">
                  <span
                    className={`text-button ${
                      change.isUp ? "text-primary" : "text-red"
                    }`}
                  >
                    {change.text}
                  </span>

                  <p className="mt-4 text-secondary">
                    ${formatPrice(cleanSymbol)}
                  </p>
                </div>
              </div>
            </a>
          </li>
        );
      })}

      {/* VIEW MORE */}
      <div className="d-block m-2 coin-item p-2 text-center">
        <NavLink to="/wallet">
          <div className="align-items-center">
            <span className="text-small text-primary">View More</span>
          </div>
        </NavLink>
      </div>

      {/* ✅ MODAL */}
      {selectedCoin && (
        <DetailChartModal
          details={{
            ...selectedCoin,
            current_price:
              pricesTicker?.[selectedCoin.symbol + "USDT"]?.lastPrice ??
              priceBackup?.[selectedCoin.symbol]?.current_price ??
              0,

            pricePercentage:
              pricesTicker?.[selectedCoin.symbol + "USDT"]
                ?.priceChangePercent ??
              priceBackup?.[selectedCoin.symbol]
                ?.price_change_percentage_24h ??
              0,

            ath_change_percentage:
              priceBackup?.[selectedCoin.symbol]
                ?.ath_change_percentage ?? 0,
          }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Gainers;
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { DetailChartModal } from "../../models/DetailChartModal"; // import your shared modal

const Favourite = () => {
  const [priceBackup, setPriceBack] = useState({});
  const [pricesTicker, setPricesTicker] = useState({});
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadTokens = () => {
      const rawData = JSON.parse(localStorage.getItem("tokens")) || [];
      const transformed = {};
      rawData.forEach((coin) => {
        if (coin.symbol) transformed[coin.symbol.toUpperCase()] = coin;
      });
      setPriceBack(transformed);
    };

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
  }, []);

  const coins = ["SOL", "XRP", "LINK", "TRX", "DOGE", "AVAX", "ADA"]; // favourite coins

  const formatVolume = (value) => {
    const num = Number(value || 0);
    if (num >= 1e12) return (num / 1e12).toFixed(5) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(5) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(5) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(5) + "K";
    return num.toFixed(2);
  };

  const handleOpenModal = (symbol) => {
    const coinData = priceBackup[symbol];
    if (!coinData) return;
    setSelectedCoin({ symbol, ...coinData });
    setIsModalOpen(true);
  };

  const renderPrice = (symbol) => {
    const ticker = pricesTicker[`${symbol}USDT`];
    const backup = priceBackup[symbol];
    const price = ticker?.lastPrice ?? backup?.current_price ?? 0;
    return `$${Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderPriceChange = (symbol) => {
    const ticker = pricesTicker[`${symbol}USDT`];
    const backup = priceBackup[symbol];
    const change =
      ticker?.priceChangePercent ?? backup?.price_change_percentage_24h;

    if (change === undefined) return <span className="text-button">--</span>;
    const isIncrease = Number(change) > 0;
    return (
      <span className={`coin-btn ${isIncrease ? "increase" : "decrease"}`}>
        {Number(change).toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })}
        %
      </span>
    );
  };

  const renderVolume = (symbol) => {
    const ticker = pricesTicker[`${symbol}USDT`];
    const backup = priceBackup[symbol];
    const volume = ticker?.volume ?? backup?.volume ?? 0;
    return `$${formatVolume(volume)}`;
  };

  return (
    <div>
      {coins.map((symbol) => (
        <li key={symbol} style={{ marginTop: "18px" }}>
          <a
            className="coin-item style-2 gap-12"
            onClick={() => handleOpenModal(symbol)}
          >
            <img
              src={priceBackup[symbol]?.image || "/default-icon.png"}
              alt={`${symbol} Logo`}
              className="img"
            />
            <div className="content">
              <div className="title">
                <p className="mb-4 text-button">{symbol}</p>
                <span className="text-secondary">{renderVolume(symbol)}</span>
              </div>
              <div className="d-flex align-items-center gap-12">
                <span className="text-small">{renderPrice(symbol)}</span>
                {renderPriceChange(symbol)}
              </div>
            </div>
          </a>
        </li>
      ))}

      <div className="d-block m-2 coin-item p-2 text-center">
        <NavLink to="/wallet">
          <div className="align-items-center">
            <span className="text-small text-primary">View More</span>
          </div>
        </NavLink>
      </div>

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
              priceBackup?.[selectedCoin.symbol]?.price_change_percentage_24h ??
              0,
            ath_change_percentage:
              priceBackup?.[selectedCoin.symbol]?.ath_change_percentage ?? 0,
          }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Favourite;

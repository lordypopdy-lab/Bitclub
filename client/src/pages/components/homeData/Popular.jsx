import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { DetailChartModal } from "../../models/DetailChartModal";

const Popular = () => {
  const [priceBackup, setPriceBack] = useState({});
  const [pricesTicker, setPricesTicker] = useState({});
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const tokenLoader = async () => {
      const rawData = JSON.parse(localStorage.getItem("tokens")) || [];
      const transformed = {};
      rawData.forEach((coin) => {
        if (coin.symbol) transformed[coin.symbol.toUpperCase()] = coin;
      });
      setPriceBack((prev) => ({ ...prev, ...transformed }));
    };

    const FavTokens = async () => {
      const socketTcker = new WebSocket(import.meta.env.VITE_API_MARKET_TICKER);

      socketTcker.onopen = () => console.log("Ticker WebSocket connected");
      socketTcker.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const symbol = msg.symbol?.toUpperCase();
        if (!symbol) return;
        setPricesTicker((prev) => ({
          ...prev,
          [symbol]: { ...prev[symbol], ...msg },
        }));
      };
      socketTcker.onerror = (err) =>
        console.error("Ticker WebSocket error:", err);
      socketTcker.onclose = () =>
        console.warn("Ticker WebSocket disconnected");

      return () => socketTcker.close();
    };

    tokenLoader();
    FavTokens();
  }, []);

  const coins = ["BTC", "ETH", "SOL", "BNB", "XRP", "LINK", "TRX", "DOGE"];
  const coins1 = ["SOL", "XRP", "LINK", "TRX", "DOGE", "AVAX", "ADA"];

  const handleOpenModal = (symbol) => {
    setSelectedCoin({ symbol: symbol.toUpperCase() });
    setIsModalOpen(true);
  };

  const renderPriceChange = (symbol) => {
    const ticker = pricesTicker[`${symbol}USDT`];
    const backup = priceBackup[symbol];

    const change =
      ticker?.priceChangePercent ?? backup?.price_change_percentage_24h;
    if (change === undefined) return { text: "--", isUp: true };
    return { text: Number(change).toFixed(3) + "%", isUp: Number(change) >= 0 };
  };

  const renderPrice = (symbol) => {
    const ticker = pricesTicker[`${symbol}USDT`];
    const backup = priceBackup[symbol];
    return ticker?.lastPrice ?? backup?.current_price ?? 0;
  };

  const formatVolume = (value) => {
    const num = Number(value || 0);
    if (num >= 1e12) return (num / 1e12).toFixed(5) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(5) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(5) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(5) + "K";
    return num.toFixed(2);
  };

  const renderVolume = (symbol) => {
    const ticker = pricesTicker[`${symbol}USDT`];
    const backup = priceBackup[symbol];
    return ticker?.volume ?? backup?.volume ?? 0;
  };

  return (
    <div>
      {coins.map((coin) => {
        const change = renderPriceChange(coin);
        return (
          <li key={coin} style={{ marginTop: "18px" }}>
            <NavLink
              className="coin-item style-2 gap-12"
              onClick={() => handleOpenModal(coin)}
            >
              <img
                src={priceBackup[coin]?.image || "/default-icon.png"}
                alt={`${coin} Logo`}
                className="img"
              />
              <div className="content">
                <div className="title">
                  <p className="mb-4 text-button">{coin}</p>
                  <span className="text-secondary">
                    ${formatVolume(renderVolume(coin))}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-12">
                  <span className="text-small">
                    $
                    {Number(renderPrice(coin)).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 5,
                    })}
                  </span>
                  <span
                    className={`coin-btn ${
                      change.isUp ? "increase" : "decrease"
                    }`}
                  >
                    {change.text}
                  </span>
                </div>
              </div>
            </NavLink>
          </li>
        );
      })}

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

export default Popular;

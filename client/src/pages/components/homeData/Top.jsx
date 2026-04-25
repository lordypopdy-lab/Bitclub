import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { DetailChartModal } from "../../models/DetailChartModal";

const Top = () => {
  const [priceBackup, setPriceBack] = useState({});
  const [pricesTicker, setPricesTicker] = useState({});
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load cached coins from localStorage
    const loadTokens = () => {
      const rawData = JSON.parse(localStorage.getItem("tokens")) || [];
      const transformed = {};
      rawData.forEach((coin) => {
        if (coin.symbol) transformed[coin.symbol.toUpperCase()] = coin;
      });
      setPriceBack(transformed);
    };

    // Connect WebSocket for live prices
    const connectTicker = () => {
      const ws = new WebSocket(import.meta.env.VITE_API_MARKET_TICKER);

      ws.onopen = () => console.log("Ticker WebSocket connected");
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const symbol = msg.symbol?.toUpperCase();
        if (!symbol) return;

        setPricesTicker((prev) => ({
          ...prev,
          [symbol]: { ...prev[symbol], ...msg },
        }));
      };
      ws.onerror = (err) => console.error("Ticker WebSocket error:", err);
      ws.onclose = () => console.warn("Ticker WebSocket disconnected");

      return () => ws.close();
    };

    loadTokens();
    connectTicker();
  }, []);

  const coins = [
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "DOGE", name: "Dogecoin" },
    { symbol: "SOL", name: "Solana" },
    { symbol: "BNB", name: "Binance Coin" },
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "TRX", name: "TRON" },
    { symbol: "FIL", name: "Filecoin" },
  ];

  const handleOpenModal = (coin) => {
    setSelectedCoin({ symbol: coin.symbol.toUpperCase(), name: coin.name });
    setIsModalOpen(true);
  };

  const formatPrice = (symbol, fractionDigits = 2) => {
    const live = pricesTicker?.[symbol + "USDT"]?.lastPrice;
    const backup = priceBackup?.[symbol]?.current_price || 0;
    return Number(live ?? backup).toLocaleString(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
  };

  const formatChange = (symbol) => {
    const live = pricesTicker?.[symbol + "USDT"]?.priceChangePercent;
    const backup = priceBackup?.[symbol]?.price_change_percentage_24h;
    const value = !isNaN(Number(live))
      ? Number(live)
      : !isNaN(Number(backup))
        ? Number(backup)
        : null;
    if (value === null) return { text: "--", isUp: true };
    return { text: value.toFixed(3) + "%", isUp: value >= 0 };
  };

  return (
    <div>
      {coins.map((coin, index) => {
        const symbol = coin.symbol.toUpperCase();
        const change = formatChange(symbol);
        return (
          <li key={symbol} style={{ marginTop: "18px" }}>
            <NavLink
              className="coin-item justify-content-between"
              onClick={() => handleOpenModal(coin)}
            >
              <div className="d-flex align-items-center gap-12 flex-1">
                <h4 className="text-primary">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </h4>
                <p>
                  <span className="mb-4 text-button fw-6">{symbol}</span>
                  <span className="text-secondary">/ USDT</span>
                </p>
              </div>
              <div className="d-flex justify-content-between align-items-center flex-st2">
                <span className="text-small">
                  {formatPrice(symbol, symbol === "DOGE" ? 5 : 2)}
                </span>
                <div className="text-end">
                  <span
                    className={`text-button ${change.isUp ? "text-primary" : "text-red"}`}
                  >
                    {change.text}
                  </span>
                  <p className="mt-4 text-secondary">
                    ${formatPrice(symbol, symbol === "DOGE" ? 5 : 2)}
                  </p>
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

export default Top;

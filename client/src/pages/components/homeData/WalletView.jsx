import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Sparkline from "../Sparkline";
import { DetailChartModal } from "../../models/DetailChartModal";

const WalletView = () => {
  const [priceBackup, setPriceBack] = useState({});
  const [pricesTicker, setPricesTicker] = useState({});
  const [sparklineData, setSparklineData] = useState({});
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load cached coins from localStorage
    const rawData = JSON.parse(localStorage.getItem("tokens")) || [];
    const transformed = {};
    rawData.forEach((coin) => {
      if (coin.symbol) transformed[coin.symbol.toUpperCase()] = coin;
    });
    setPriceBack(transformed);

    // Connect WebSocket for live prices
    const ws = new WebSocket(import.meta.env.VITE_API_MARKET_TICKER);

    ws.onopen = () => console.log("Ticker WebSocket connected");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const symbol = msg.symbol?.toUpperCase();
      if (!symbol) return;

      setPricesTicker((prev) => {
        const updatedTicker = {
          ...prev,
          [symbol]: { ...prev[symbol], ...msg },
        };

        // Update sparkline data (last 50 points)
        setSparklineData((prevData) => {
          const prevSpark = prevData[symbol] || [];
          const newPrice = Number(msg.lastPrice) || 0;
          const newSpark = [...prevSpark, newPrice].slice(-50);
          return { ...prevData, [symbol]: newSpark };
        });

        return updatedTicker;
      });
    };

    ws.onerror = (err) => console.error("Ticker WebSocket error:", err);
    ws.onclose = () => console.warn("Ticker WebSocket disconnected");

    return () => ws.close();
  }, []);

  const coins = [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETC", name: "Ethereum Classic" },
    { symbol: "XRP", name: "Ripple" },
    { symbol: "TRX", name: "TRON" },
    { symbol: "FIL", name: "Filecoin" },
    { symbol: "USDC", name: "USD Coin" },
  ];

const handleOpenModal = (coin) => {
  // Only store static coin info in selectedCoin
  setSelectedCoin({
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
  });
  setIsModalOpen(true);
};

  return (
    <div>
      {coins.map((coin) => {
        const symbol = coin.symbol.toUpperCase();
        const liveData = pricesTicker?.[symbol + "USDT"];
        const backupData = priceBackup?.[symbol];

        const currentPrice =
          liveData?.lastPrice ?? backupData?.current_price ?? 0;

        const priceChangeValue = !isNaN(Number(liveData?.priceChangePercent))
          ? Number(liveData.priceChangePercent)
          : !isNaN(Number(backupData?.price_change_percentage_24h))
            ? Number(backupData.price_change_percentage_24h)
            : NaN;

        const isUp = priceChangeValue >= 0;

        const sparkData =
          sparklineData[symbol + "USDT"] ||
          backupData?.sparkline_in_7d?.price?.slice(-50) ||
          [];

        return (
          <li key={coin.symbol} style={{ marginTop: "18px" }}>
            <a
              className="coin-item justify-content-between"
              onClick={() => handleOpenModal(coin)}
            >
              <div className="d-flex align-items-center flex-1">
                <p>
                  <span className="mb-4 text-button fw-6">{coin.symbol}</span>
                  <span className="text-secondary">/ USDT</span>
                </p>
              </div>

              <div className="d-flex align-items-center gap-2 flex-st2">
                <span className="text-small">
                  {Number(currentPrice).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>

                <div
                  style={{
                    width: "110px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 6px",
                  }}
                >
                  <Sparkline
                    width={110}
                    height={40}
                    priceChangePercent={priceChangeValue}
                    data={sparkData}
                  />
                </div>

                <div className="text-end">
                  <span
                    className={`text-button ${isUp ? "text-primary" : "text-red"}`}
                  >
                    {isNaN(priceChangeValue)
                      ? "--"
                      : priceChangeValue.toFixed(3)}
                    %
                  </span>
                  <p className="mt-4 text-secondary">
                    ${Number(currentPrice).toLocaleString()}
                  </p>
                </div>
              </div>
            </a>
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
            // Live updates from WebSocket state
            current_price:
              pricesTicker?.[selectedCoin.symbol + "USDT"]?.lastPrice ??
              priceBackup?.[selectedCoin.symbol]?.current_price ??
              0,
            pricePercentage: !isNaN(
              Number(
                pricesTicker?.[selectedCoin.symbol + "USDT"]
                  ?.priceChangePercent,
              ),
            )
              ? Number(
                  pricesTicker[selectedCoin.symbol + "USDT"].priceChangePercent,
                )
              : (Number(
                  priceBackup?.[selectedCoin.symbol]
                    ?.price_change_percentage_24h,
                ) ?? 0),
            ath_change_percentage:
              priceBackup?.[selectedCoin.symbol]?.ath_change_percentage ?? 0,
            sparkline_in_7d:
              sparklineData[selectedCoin.symbol + "USDT"] ||
              priceBackup?.[selectedCoin.symbol]?.sparkline_in_7d?.price?.slice(
                -50,
              ) ||
              [],
          }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default WalletView;

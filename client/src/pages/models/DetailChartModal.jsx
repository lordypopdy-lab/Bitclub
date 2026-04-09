import { useEffect, useState, useRef } from "react";
import { Sparkline } from "../components/Sparkline";

export const DetailChartModal = ({ details, isOpen, onClose }) => {
  const wsRef = useRef(null);

  const tabs = ["1H", "1D", "1W", "1M", "1Y"];
  const [activeTab, setActiveTab] = useState("1D");
  const [chartData, setChartData] = useState([]);

  const [liveData, setLiveData] = useState({
    price: null,
    change: null,
  });

  // ✅ INTERVAL MAPPING (VERY IMPORTANT)
  const getInterval = (tab) => {
    switch (tab) {
      case "1H": return "1m";
      case "1D": return "5m";
      case "1W": return "30m";
      case "1M": return "2h";
      case "1Y": return "1d";
      default: return "5m";
    }
  };

  // ✅ LOAD HISTORICAL DATA (WHEN TAB CHANGES OR MODAL OPENS)
  useEffect(() => {
    if (!details?.symbol || !isOpen) return;

    const fetchHistory = async () => {
      try {
        const interval = getInterval(activeTab);
        const symbol = `${details.symbol.toUpperCase()}USDT`;

        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`
        );

        const data = await res.json();

        if (!Array.isArray(data)) return;

        const prices = data.map((candle) => parseFloat(candle[4])); // close price

        setChartData(prices);
      } catch (err) {
        console.error("History fetch error:", err);
      }
    };

    fetchHistory();
  }, [activeTab, details?.symbol, isOpen]);

  // ✅ LIVE STREAM (APPEND TO CURRENT CHART)
  useEffect(() => {
    if (!details?.symbol || !isOpen) return;

    const symbol = `${details.symbol.toLowerCase()}usdt`;

    const ws = new WebSocket(
      `wss://fstream.binance.com/stream?streams=${symbol}@miniTicker`
    );

    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)?.data;
      if (!data) return;

      const price = parseFloat(data.c);
      const change = parseFloat(data.P);

      if (!isNaN(price)) {
        setChartData((prev) => {
          if (!prev || prev.length === 0) return [price];
          return [...prev, price].slice(-100);
        });
      }

      if (!isNaN(price) && !isNaN(change)) {
        setLiveData({ price, change });
      }
    };

    ws.onerror = () => ws.close();

    return () => ws.close();
  }, [details?.symbol, isOpen]);

  if (!details) return null;

  const price =
    liveData.price ??
    Number(details.current_price) ??
    0;

  const change =
    liveData.change ??
    Number(details.pricePercentage) ??
    0;

  const isUp = change >= 0;

  return (
    <div
      className={`modal fade action-sheet ${isOpen ? "show" : ""}`}
      style={{ display: isOpen ? "block" : "none" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="box-detail-chart">

            {/* TOP */}
            <div className="top">
              <h3 className="d-flex align-items-center gap-8">
                {details.symbol?.toUpperCase()}/USD
              </h3>

              <h2 className="mt-4">
                ${Number(price).toLocaleString()}
              </h2>

              <p className="mt-4">
                <span className={isUp ? "text-primary" : "text-red"}>
                  {change.toFixed(3)}%
                </span>
                &emsp;Last 24 hours
              </p>
            </div>

            {/* 🔥 CHART */}
            <div
              style={{
                width: "100%",
                height: "100px",
                padding: "0 10px",
              }}
            >
              <Sparkline
                width={350}
                height={100}
                priceChangePercent={change}
                data={Array.isArray(chartData) ? chartData : []}
              />
            </div>

            {/* 🔥 TIME TABS */}
            <div className="content mt-3">
              <ul className="tab-time d-flex justify-content-between">
                {tabs.map((tab) => (
                  <li key={tab}>
                    <button
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: "none",
                        background:
                          activeTab === tab
                            ? "#25c866"
                            : "transparent",
                        color:
                          activeTab === tab
                            ? "#fff"
                            : "#aaa",
                        cursor: "pointer",
                        fontWeight: "500",
                      }}
                    >
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* BOTTOM */}
            <div className="bottom">
              <h6 className="text-button">Token information</h6>

              <ul className="mt-16 d-flex gap-16">
                <li className="flex-1">
                  <div className="accent-box-v6 bg-surface d-flex justify-content-between align-items-center">
                    <div className="content">
                      <p className="text-small text-light">
                        {details.symbol?.toUpperCase()} / USD
                      </p>

                      <span
                        className={`d-inline-block text-light mt-8 coin-btn ${
                          isUp ? "increase" : "decrease"
                        }`}
                      >
                        {change.toFixed(3)}%
                      </span>
                    </div>
                  </div>
                </li>

                <li className="flex-1">
                  <div className="accent-box-v6 bg-surface d-flex justify-content-between align-items-center">
                    <div className="content">
                      <p className="text-small text-light">
                        {details.name}
                      </p>

                      <span
                        className={`d-inline-block text-light mt-8 coin-btn ${
                          Number(details.ath_change_percentage) >= 0
                            ? "increase"
                            : "decrease"
                        }`}
                      >
                        {Number(
                          details.ath_change_percentage
                        ).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </li>
              </ul>

              <button
                onClick={() => (location.href = "/Deposite")}
                style={{
                  marginTop: "20px",
                  padding: "12px",
                  width: "100%",
                  borderRadius: "12px",
                  border: "none",
                  background:
                    "linear-gradient(135deg,#25c866,#f5c738)",
                  color: "#fff",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Buy Asset
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
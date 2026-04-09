import { useEffect, useState, useRef } from "react";
import ModalSparkline from "../components/ModalSparkline";

export const DetailChartModal = ({ details, isOpen, onClose }) => {
  const wsRef = useRef(null);

  const tabs = ["1H", "1D", "1W", "1M", "1Y"];
  const [activeTab, setActiveTab] = useState("1D");
  const [chartData, setChartData] = useState([]);

  const [liveData, setLiveData] = useState({
    price: null,
    change: null,
  });

  const getInterval = (tab) => {
    switch (tab) {
      case "1H":
        return "1m";
      case "1D":
        return "5m";
      case "1W":
        return "30m";
      case "1M":
        return "2h";
      case "1Y":
        return "1d";
      default:
        return "5m";
    }
  };

  const getLimit = (tab) => {
    switch (tab) {
      case "1H":
        return 60;
      case "1D":
        return 288;
      case "1W":
        return 336;
      case "1M":
        return 720;
      case "1Y":
        return 365;
      default:
        return 100;
    }
  };

  // ✅ LOAD FULL HISTORY
  useEffect(() => {
    if (!details?.symbol || !isOpen) return;

    const fetchHistory = async () => {
      const symbol = `${details.symbol.toUpperCase()}USDT`;
      const interval = getInterval(activeTab);
      const limit = getLimit(activeTab);

      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
      );

      const data = await res.json();
      if (!Array.isArray(data)) return;

      const prices = data.map((c) => parseFloat(c[4]));
      setChartData(prices);
    };

    fetchHistory();
  }, [activeTab, details?.symbol, isOpen]);

  // ✅ LIVE STREAM
  useEffect(() => {
    if (!details?.symbol || !isOpen) return;

    const ws = new WebSocket(
      `wss://fstream.binance.com/stream?streams=${details.symbol.toLowerCase()}usdt@miniTicker`,
    );

    wsRef.current = ws;

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)?.data;
      if (!data) return;

      const price = parseFloat(data.c);
      const change = parseFloat(data.P);

      if (!isNaN(price)) {
        setChartData((prev) => [...prev, price]);
      }

      if (!isNaN(price) && !isNaN(change)) {
        setLiveData({ price, change });
      }
    };

    return () => ws.close();
  }, [details?.symbol, isOpen]);

  if (!isOpen || !details) return null;

  const price = liveData.price ?? Number(details.current_price) ?? 0;
  const change = liveData.change ?? Number(details.pricePercentage) ?? 0;
  const isUp = change >= 0;

  return (
    <div
      className="modal show"
      style={{
        display: "block",
        background: "linear-gradient(180deg,#0a0a0a,#111)",
        minHeight: "80vh",
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: "100%", margin: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-content"
          style={{
            background: "transparent",
            border: "none",
            padding: "20px",
            marginTop: "27vh",
          }}
        >
          {/* 🔥 HEADER */}
          <h3 style={{ color: "#25c866", fontWeight: "600" }}>
            {details.symbol}/USD
          </h3>

          <h1 style={{ color: "#fff", fontSize: "38px", marginTop: "6px" }}>
            ${Number(price).toLocaleString()}
          </h1>

          <p style={{ marginTop: "4px" }}>
            <span style={{ color: isUp ? "#25c866" : "#ff4d4f" }}>
              {change.toFixed(3)}%
            </span>
            <span style={{ color: "#aaa", marginLeft: "8px" }}>
              Last 24 hours
            </span>
          </p>

          {/* 🔥 CHART */}
          <div style={{ marginTop: "20px" }}>
            <ModalSparkline
              width={337}
              height={120}
              priceChangePercent={change}
              data={chartData}
            />
          </div>

          {/* 🔥 TABS */}
          <div style={{ marginTop: "20px" }}>
            <ul
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 0,
                listStyle: "none",
              }}
            >
              {tabs.map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      border: "none",
                      background: activeTab === tab ? "#25c866" : "transparent",
                      color: activeTab === tab ? "#000" : "#D9D9D9",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 🔥 TOKEN INFO */}
          <div style={{ marginTop: "30px" }}>
            <h4 style={{ color: "#fff", marginBottom: "14px" }}>
              Token information
            </h4>

            <div style={{ display: "flex", gap: "12px" }}>
              {/* Symbol Card */}
              <div
                style={{
                  flex: 6,
                  background: "#02140a",
                  padding: "16px",
                  borderRadius: "14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ color: "#ccc", marginBottom: "8px" }}>
                  {details.symbol}/USD
                </p>
                <span
                  style={{
                    background: "#25c866",
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    alignSelf: "flex-start", // ensures badge stays on left
                  }}
                >
                  {change.toFixed(3)}%
                </span>
              </div>

              {/* Name Card */}
              <div
                style={{
                  flex: 1,
                  background: "#02140a",
                  padding: "16px",
                  borderRadius: "14px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ color: "#ccc", marginBottom: "8px" }}>
                  {details.name}
                </p>
                <span
                  style={{
                    background:
                      Number(details.ath_change_percentage) >= 0
                        ? "#25c866"
                        : "#ff4d4f",
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    alignSelf: "flex-start",
                  }}
                >
                  {Number(details.ath_change_percentage).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* 🔥 BUTTON */}
          <button
            onClick={() => (location.href = "/Deposite")}
            style={{
              marginTop: "30px",
              width: "100%",
              padding: "16px",
              borderRadius: "30px",
              border: "none",
              background: "#25c866",
              color: "#fff",
              fontWeight: "700",
              fontSize: "18px",
              boxShadow: "0 6px 30px rgba(37,200,102,0.4)",
              cursor: "pointer",
            }}
          >
            Buy Assets
          </button>
        </div>
      </div>
    </div>
  );
};

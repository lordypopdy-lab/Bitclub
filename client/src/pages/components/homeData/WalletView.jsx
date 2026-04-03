import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Sparkline from "../Sparkline";

const WalletView = () => {
  const [priceBackup, setPriceBack] = useState({});
  const [pricesTicker, setPricesTicker] = useState({});

  useEffect(() => {
    const tokenLoader = async () => {
      const rawData = JSON.parse(localStorage.getItem("tokens")) || [];

      const transformed = {};
      rawData.forEach((coin) => {
        if (coin.symbol) {
          transformed[coin.symbol.toUpperCase()] = coin;
        }
      });

      setPriceBack((prev) => ({
        ...prev,
        ...transformed,
      }));
    };
    const FavTokens = async () => {
      const socketTcker = new WebSocket(import.meta.env.VITE_API_MARKET_TICKER);
      //=======WebSocket Ticker Section========//

      socketTcker.onopen = () => {
        console.log("✅ Ticker WebSocket connected");
      };

      socketTcker.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const symbol = msg.symbol?.toUpperCase();

        if (!symbol) return;

        //console.log(msg)

        setPricesTicker((prev) => ({
          ...prev,
          [symbol]: {
            ...prev[symbol],
            ...msg,
          },
        }));
      };

      socketTcker.onerror = (err) => {
        console.error("❌ Ticker WebSocket error:", err);
      };

      socketTcker.onclose = () => {
        console.warn("🔌 Ticker WebSocket disconnected");
      };
      return () => socketTcker.close();
    };
    FavTokens();
    tokenLoader();
  }, []);

  return (
    <div>
      <li style={{ marginTop: "18px" }}>
        <a
          data-bs-toggle="modal"
          data-bs-target="#detailChart"
          className="coin-item justify-content-between"
        >
          <div className="d-flex align-items-center gap-12 flex-1">
            <h4 className="text-primary">02</h4>
            <p>
              <span className="mb-4 text-button fw-6">BTC</span>
              <span className="text-secondary">/ USDT</span>
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-st2">
            {/* PRICE */}
            <span className="text-small">
              {pricesTicker?.BTCUSDT?.lastPrice
                ? Number(pricesTicker.BTCUSDT.lastPrice).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )
                : Number(priceBackup?.BTC?.current_price || 0).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
            </span>

            {/* 🔥 MINI CHART */}
            <div
              style={{
                width: "90px",
                height: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 6px",
              }}
            >
              <Sparkline symbol="btcusdt" width={100} height={40} />
            </div>

            <div className="text-end">
              {/* % CHANGE */}
              {(() => {
                const live = pricesTicker?.BTCUSDT?.priceChangePercent;
                const backup = priceBackup?.BTC?.price_change_percentage_24h;

                const value =
                  live !== undefined ? Number(live) : Number(backup);

                if (isNaN(value)) {
                  return <span className="text-button">--</span>;
                }

                return value > 0 ? (
                  <span className="text-button text-primary">
                    {value.toFixed(3)}%
                  </span>
                ) : (
                  <span className="text-button text-red">
                    {value.toFixed(3)}%
                  </span>
                );
              })()}

              {/* USD */}
              <p className="mt-4 text-secondary">
                $
                {pricesTicker?.BTCUSDT?.lastPrice
                  ? Number(pricesTicker.BTCUSDT.lastPrice).toLocaleString()
                  : Number(
                      priceBackup?.BTC?.current_price || 0,
                    ).toLocaleString()}
              </p>
            </div>
          </div>
        </a>
      </li>
      <li style={{ marginTop: "18px" }}>
        <a
          data-bs-toggle="modal"
          data-bs-target="#detailChart"
          className="coin-item justify-content-between"
        >
          <div className="d-flex align-items-center gap-12 flex-1">
            <h4 className="text-primary">01</h4>
            <p>
              <span className="mb-4 text-button fw-6">ETC</span>
              <span className="text-secondary">/ USDT</span>
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-st2">
            {/* PRICE */}
            <span className="text-small">
              {pricesTicker?.ETCUSDT?.lastPrice
                ? Number(pricesTicker.ETCUSDT.lastPrice).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )
                : Number(priceBackup?.ETC?.current_price || 0).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
            </span>

            {/* 🔥 PREMIUM MINI CHART */}
            <div
              style={{
                width: "110px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 6px",
              }}
            >
              <Sparkline symbol="ethusdt" width={100} height={40} />
            </div>

            <div className="text-end">
              {/* % CHANGE */}
              {(() => {
                const live = pricesTicker?.ETCUSDT?.priceChangePercent;
                const backup = priceBackup?.ETC?.price_change_percentage_24h;

                const value =
                  live !== undefined ? Number(live) : Number(backup);

                if (isNaN(value)) {
                  return <span className="text-button">--</span>;
                }

                return value > 0 ? (
                  <span className="text-button text-primary">
                    {value.toFixed(3)}%
                  </span>
                ) : (
                  <span className="text-button text-red">
                    {value.toFixed(3)}%
                  </span>
                );
              })()}

              {/* USD */}
              <p className="mt-4 text-secondary">
                $
                {pricesTicker?.ETCUSDT?.lastPrice
                  ? Number(pricesTicker.ETCUSDT.lastPrice).toLocaleString()
                  : Number(
                      priceBackup?.ETC?.current_price || 0,
                    ).toLocaleString()}
              </p>
            </div>
          </div>
        </a>
      </li>
      <li style={{ marginTop: "18px" }}>
        <a
          data-bs-toggle="modal"
          data-bs-target="#detailChart"
          className="coin-item justify-content-between"
        >
          <div className="d-flex align-items-center gap-12 flex-1">
            <h4 className="text-primary">02</h4>
            <p>
              <span className="mb-4 text-button fw-6">USDC</span>
              <span className="text-secondary">/ USDT</span>
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-st2">
            {/* PRICE */}
            <span className="text-small">
              {pricesTicker?.USDCUSDT?.lastPrice
                ? Number(pricesTicker.USDCUSDT.lastPrice).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )
                : Number(priceBackup?.USDC?.current_price || 0).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
            </span>

            {/* 🔥 PREMIUM MINI CHART (FLAT-OPTIMIZED) */}
            <div
              style={{
                width: "110px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 6px",
                opacity: 0.7,
              }}
            >
              <Sparkline symbol="usdcusdt" width={100} height={40} />
            </div>

            <div className="text-end">
              {/* % CHANGE */}
              {(() => {
                const live = pricesTicker?.USDCUSDT?.priceChangePercent;
                const backup = priceBackup?.USDC?.price_change_percentage_24h;

                const value =
                  live !== undefined ? Number(live) : Number(backup);

                if (isNaN(value)) {
                  return <span className="text-button">--</span>;
                }

                return value > 0 ? (
                  <span className="text-button text-primary">
                    {value.toFixed(3)}%
                  </span>
                ) : (
                  <span className="text-button text-red">
                    {value.toFixed(3)}%
                  </span>
                );
              })()}

              {/* USD */}
              <p className="mt-4 text-secondary">
                $
                {pricesTicker?.USDCUSDT?.lastPrice
                  ? Number(pricesTicker.USDCUSDT.lastPrice).toLocaleString()
                  : Number(
                      priceBackup?.USDC?.current_price || 0,
                    ).toLocaleString()}
              </p>
            </div>
          </div>
        </a>
      </li>
      <li style={{ marginTop: "18px" }}>
        <a
          data-bs-toggle="modal"
          data-bs-target="#detailChart"
          className="coin-item justify-content-between"
        >
          <div className="d-flex align-items-center gap-12 flex-1">
            <h4 className="text-primary">02</h4>
            <p>
              <span className="mb-4 text-button fw-6">XRP</span>
              <span className="text-secondary">/ USDT</span>
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-st2">
            {/* PRICE */}
            <span className="text-small">
              {pricesTicker?.XRPUSDT?.lastPrice
                ? Number(pricesTicker.XRPUSDT.lastPrice).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )
                : Number(priceBackup?.XRP?.current_price || 0).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
            </span>

            {/* 🔥 PREMIUM MINI CHART (FLAT-OPTIMIZED) */}
            <div
              style={{
                width: "110px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 6px",
                opacity: 0.7,
              }}
            >
              <Sparkline symbol="xrpusdt" width={100} height={40} />
            </div>

            <div className="text-end">
              {/* % CHANGE */}
              {(() => {
                const live = pricesTicker?.XRPUSDT?.priceChangePercent;
                const backup = priceBackup?.XRP?.price_change_percentage_24h;

                const value =
                  live !== undefined ? Number(live) : Number(backup);

                if (isNaN(value)) {
                  return <span className="text-button">--</span>;
                }

                return value > 0 ? (
                  <span className="text-button text-primary">
                    {value.toFixed(3)}%
                  </span>
                ) : (
                  <span className="text-button text-red">
                    {value.toFixed(3)}%
                  </span>
                );
              })()}

              {/* USD */}
              <p className="mt-4 text-secondary">
                $
                {pricesTicker?.XRPUSDT?.lastPrice
                  ? Number(pricesTicker.XRPUSDT.lastPrice).toLocaleString()
                  : Number(
                      priceBackup?.XRP?.current_price || 0,
                    ).toLocaleString()}
              </p>
            </div>
          </div>
        </a>
      </li>
      <li style={{ marginTop: "18px" }}>
        <a
          data-bs-toggle="modal"
          data-bs-target="#detailChart"
          className="coin-item justify-content-between"
        >
          <div className="d-flex align-items-center gap-12 flex-1">
            <h4 className="text-primary">02</h4>
            <p>
              <span className="mb-4 text-button fw-6">TRX</span>
              <span className="text-secondary">/ USDT</span>
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-st2">
            {/* PRICE */}
            <span className="text-small">
              {pricesTicker?.TRXUSDT?.lastPrice
                ? Number(pricesTicker.TRXUSDT.lastPrice).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )
                : Number(priceBackup?.TRX?.current_price || 0).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
            </span>

            {/* 🔥 PREMIUM MINI CHART (FLAT-OPTIMIZED) */}
            <div
              style={{
                width: "110px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 6px",
                opacity: 0.7,
              }}
            >
              <Sparkline symbol="trxusdt" width={100} height={40} />
            </div>

            <div className="text-end">
              {/* % CHANGE */}
              {(() => {
                const live = pricesTicker?.TRXUSDT?.priceChangePercent;
                const backup = priceBackup?.TRX?.price_change_percentage_24h;

                const value =
                  live !== undefined ? Number(live) : Number(backup);

                if (isNaN(value)) {
                  return <span className="text-button">--</span>;
                }

                return value > 0 ? (
                  <span className="text-button text-primary">
                    {value.toFixed(3)}%
                  </span>
                ) : (
                  <span className="text-button text-red">
                    {value.toFixed(3)}%
                  </span>
                );
              })()}

              {/* USD */}
              <p className="mt-4 text-secondary">
                $
                {pricesTicker?.TRXUSDT?.lastPrice
                  ? Number(pricesTicker.TRXUSDT.lastPrice).toLocaleString()
                  : Number(
                      priceBackup?.TRX?.current_price || 0,
                    ).toLocaleString()}
              </p>
            </div>
          </div>
        </a>
      </li>
      <li style={{ marginTop: "18px" }}>
        <a
          data-bs-toggle="modal"
          data-bs-target="#detailChart"
          className="coin-item justify-content-between"
        >
          <div className="d-flex align-items-center gap-12 flex-1">
            <h4 className="text-primary">02</h4>
            <p>
              <span className="mb-4 text-button fw-6">FIL</span>
              <span className="text-secondary">/ USDT</span>
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-st2">
            {/* PRICE */}
            <span className="text-small">
              {pricesTicker?.FILUSDT?.lastPrice
                ? Number(pricesTicker.FILUSDT.lastPrice).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )
                : Number(priceBackup?.FIL?.current_price || 0).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
            </span>

            {/* 🔥 PREMIUM MINI CHART (FLAT-OPTIMIZED) */}
            <div
              style={{
                width: "110px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 6px",
                opacity: 0.7,
              }}
            >
              <Sparkline symbol="filusdt" width={100} height={40} />
            </div>

            <div className="text-end">
              {/* % CHANGE */}
              {(() => {
                const live = pricesTicker?.FILUSDT?.priceChangePercent;
                const backup = priceBackup?.FIL?.price_change_percentage_24h;

                const value =
                  live !== undefined ? Number(live) : Number(backup);

                if (isNaN(value)) {
                  return <span className="text-button">--</span>;
                }

                return value > 0 ? (
                  <span className="text-button text-primary">
                    {value.toFixed(3)}%
                  </span>
                ) : (
                  <span className="text-button text-red">
                    {value.toFixed(3)}%
                  </span>
                );
              })()}

              {/* USD */}
              <p className="mt-4 text-secondary">
                $
                {pricesTicker?.FILUSDT?.lastPrice
                  ? Number(pricesTicker.FILUSDT.lastPrice).toLocaleString()
                  : Number(
                      priceBackup?.FIL?.current_price || 0,
                    ).toLocaleString()}
              </p>
            </div>
          </div>
        </a>
      </li>
      <div className="d-block m-2 coin-item p-2 text-center">
        <NavLink to="/wallet">
          <div className="align-items-center">
            <span className="text-small text-primary">View More</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default WalletView;

import { NavLink } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const Losers = () => {
    const [priceBackup, setPriceBack] = useState({});
    const [pricesTicker, setPricesTicker] = useState({});
    const [refreshTrigger, setRefreshTrigger] = useState(0); // for auto-refresh

    useEffect(() => {
        // Load tokens from localStorage
        const tokenLoader = async () => {
            const rawData = JSON.parse(localStorage.getItem("tokens")) || [];
            const transformed = {};

            rawData.forEach((coin) => {
                if (coin.symbol) {
                    transformed[coin.symbol.toUpperCase()] = coin;
                }
            });

            setPriceBack(transformed);
        };

        // Connect WebSocket for real-time data
        const FavTokens = async () => {
            const socketTcker = new WebSocket(import.meta.env.VITE_API_MARKET_TICKER);

            socketTcker.onopen = () => console.log('✅ Ticker WebSocket connected');

            socketTcker.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                const symbol = msg.symbol?.toUpperCase();
                if (!symbol) return;

                setPricesTicker((prev) => ({
                    ...prev,
                    [symbol]: {
                        ...prev[symbol],
                        ...msg,
                    },
                }));
            };

            socketTcker.onerror = (err) => console.error('❌ Ticker WebSocket error:', err);
            socketTcker.onclose = () => console.warn('🔌 Ticker WebSocket disconnected');

            return () => socketTcker.close();
        };

        FavTokens();
        tokenLoader();

        // 🔁 Auto refresh every 30 seconds
        const interval = setInterval(() => {
            setRefreshTrigger((prev) => prev + 1);
            console.log('🔁 Auto-refresh triggered at', new Date().toLocaleTimeString());
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // Filter losers from WebSocket
    const losersList = Object.keys(pricesTicker)
        .filter((symbol) => pricesTicker[symbol]?.priceChangePercent < 0)
        .sort((a, b) => pricesTicker[a].priceChangePercent - pricesTicker[b].priceChangePercent)
        .slice(0, 10);

    // Fallback losers from backup
    const fallbackList = Object.keys(priceBackup)
        .filter((symbol) => priceBackup[symbol]?.price_change_percentage_24h < 0)
        .sort((a, b) => priceBackup[a].price_change_percentage_24h - priceBackup[b].price_change_percentage_24h)
        .slice(0, 10);

    // Choose live losers or fallback
    const finalList = losersList.length > 0 ? losersList : fallbackList;

    return (
        <div>
            {finalList.map((symbol) => {
                const tokenSymbol = symbol.replace("USDT", "");
                const backup = priceBackup[symbol] || {};
                const ticker = pricesTicker[symbol] || {};

                const lastPrice = ticker.lastPrice || backup.current_price || 0;
                const changePercent = ticker.priceChangePercent || backup.price_change_percentage_24h || 0;

                return (
                    <li key={symbol + refreshTrigger} style={{ marginTop: '18px' }}>
                        <a className="coin-item style-2 gap-12">
                            <div className="content">
                                <div className="title">
                                    <p className="mb-4 text-button">{tokenSymbol}</p>
                                </div>
                                <div className="d-flex align-items-center gap-12">
                                    <span className="text-small">
                                        ${Number(lastPrice).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>

                                    <span className="coin-btn decrease">
                                        {Number(changePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                        %
                                    </span>
                                </div>
                            </div>
                        </a>
                    </li>
                );
            })}

            <div className="d-block m-2 coin-item p-2 text-center">
                <NavLink to="/wallet">
                    <div className="align-items-center">
                        <span className="text-small text-primary">
                            View More
                        </span>
                    </div>
                </NavLink>
            </div>
        </div>
    );
};

export default Losers;

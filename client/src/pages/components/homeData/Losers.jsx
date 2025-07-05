import { NavLink } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const Losers = () => {
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

            socketTcker.onopen = () => {
                console.log('✅ Ticker WebSocket connected');
            };

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

            socketTcker.onerror = (err) => {
                console.error('❌ Ticker WebSocket error:', err);
            };

            socketTcker.onclose = () => {
                console.warn('🔌 Ticker WebSocket disconnected');
            };

            return () => socketTcker.close();
        };

        FavTokens();
        tokenLoader();
    }, []);

    // Filter losers: symbols with priceChangePercent < 0
    const losersList = Object.keys(pricesTicker)
        .filter((symbol) => {
            const data = pricesTicker[symbol];
            return data?.priceChangePercent < 0;
        })
        .slice(0, 10); // limit list to top 10 losers if needed

    return (
        <div>
            {losersList.map((symbol) => {
                const tokenSymbol = symbol.replace("USDT", "");
                const backup = priceBackup[tokenSymbol] || {};
                const ticker = pricesTicker[symbol] || {};

                return (
                    <li key={symbol} style={{ marginTop: '18px' }}>
                        <a className="coin-item style-2 gap-12">
                            <div className="content">
                                <div className="title">
                                    <p className="mb-4 text-button">{tokenSymbol}</p>
                                </div>
                                <div className="d-flex align-items-center gap-12">
                                    <span className="text-small">
                                        {ticker.lastPrice
                                            ? `$${Number(ticker.lastPrice).toLocaleString(undefined, {
                                                minimumFractionDigits: 4,
                                                maximumFractionDigits: 4,
                                            })}`
                                            : `$${Number(backup?.current_price || 0).toLocaleString(undefined, {
                                                minimumFractionDigits: 4,
                                                maximumFractionDigits: 4,
                                            })}`}
                                    </span>

                                    <span className="coin-btn decrease">
                                        {(ticker?.priceChangePercent || backup?.price_change_percentage_24h || 0).toLocaleString(undefined, {
                                            minimumFractionDigits: 4,
                                            maximumFractionDigits: 4,
                                        })}%
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

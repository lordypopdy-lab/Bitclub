import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const MarketCap = () => {
    const [priceBackup, setPriceBack] = useState({});
    const [pricesTicker, setPricesTicker] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tokenLoader = async () => {
            const rawData = JSON.parse(localStorage.getItem("tokens")) || [];

            const transformed = {};
            rawData.forEach((coin) => {
                if (coin.symbol) {
                    transformed[coin.symbol.toUpperCase()] = coin;
                }
            });

            setPriceBack(transformed);
            setLoading(false);
        };

        const streamPrices = async () => {
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

        streamPrices();
        tokenLoader();
    }, []);

    const formatMarketCap = (value) => {
        if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
        if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
        if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
        if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K';
        return value?.toFixed(2) || '0.00';
    };

    const sortedByMarketCap = Object.entries(priceBackup)
        .filter(([_, data]) => data?.market_cap)
        .sort((a, b) => b[1].market_cap - a[1].market_cap)
        .slice(0, 10);

    return (
        <div>
            {loading
                ? Array.from({ length: 10 }).map((_, idx) => (
                    <li key={idx} style={{ marginTop: '18px' }}>
                        <div className="coin-item style-2 gap-12 skeleton-loader">
                            <div className="content">
                                <div className="title">
                                    <div className="skeleton skeleton-text" style={{ width: '60px', height: '16px' }} />
                                </div>
                                <div className="d-flex align-items-center gap-12">
                                    <div className="skeleton skeleton-text" style={{ width: '70px', height: '14px' }} />
                                    <div className="skeleton skeleton-text" style={{ width: '50px', height: '14px' }} />
                                    <div className="skeleton skeleton-text" style={{ width: '80px', height: '14px' }} />
                                </div>
                            </div>
                        </div>
                    </li>
                ))
                : sortedByMarketCap.map(([symbol, data]) => {
                    const ticker = pricesTicker[symbol + 'USDT'] || {};

                    return (
                        <li key={symbol} style={{ marginTop: '18px' }}>
                            <a className="coin-item style-2 gap-12">
                                <div className="content">
                                    <div className="title">
                                        <p className="mb-4 text-button">{symbol}</p>
                                    </div>
                                    <div className="d-flex align-items-center gap-12">
                                        <span className="text-small">
                                            {ticker?.lastPrice
                                                ? `$${Number(ticker.lastPrice).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}`
                                                : `$${Number(data?.current_price || 0).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}`}
                                        </span><br />
                                        <span>
                                            {ticker?.priceChangePercent !== undefined ? (
                                                Number(ticker.priceChangePercent) > 0 ? (
                                                    <span className="text-button text-primary">
                                                        {Number(ticker.priceChangePercent).toFixed(3)}%
                                                    </span>
                                                ) : (
                                                    <span className="text-button text-red">
                                                        {Number(ticker.priceChangePercent).toFixed(3)}%
                                                    </span>
                                                )
                                            ) : data?.price_change_percentage_24h !== undefined ? (
                                                data.price_change_percentage_24h > 0 ? (
                                                    <span className="text-button text-primary">
                                                        {Number(data.price_change_percentage_24h).toFixed(3)}%
                                                    </span>
                                                ) : (
                                                    <span className="text-button text-red">
                                                        {Number(data.price_change_percentage_24h).toFixed(3)}%
                                                    </span>
                                                )
                                            ) : (
                                                <span className="text-button">--</span>
                                            )}
                                        </span>
                                        <span className="text-button">
                                            {formatMarketCap(data?.market_cap)}
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

export default MarketCap;
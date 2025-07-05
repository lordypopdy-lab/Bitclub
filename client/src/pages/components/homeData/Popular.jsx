import React from 'react'
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Popular = () => {
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
        }
        const FavTokens = async () => {
            const socketTcker = new WebSocket(import.meta.env.VITE_API_MARKET_TICKER);
            //=======WebSocket Ticker Section========//

            socketTcker.onopen = () => {
                console.log('✅ Ticker WebSocket connected')
            }

            socketTcker.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                const symbol = msg.symbol?.toUpperCase();

                if (!symbol) return;

                //console.log(msg)
                setPricesTicker((prev) => ({
                    ...prev,
                    [symbol]: {
                        ...prev[symbol],
                        ...msg
                    },
                }))
            }

            socketTcker.onerror = ((err) => {
                console.error('❌ Ticker WebSocket error:', err);
            })

            socketTcker.onclose = () => {
                console.warn('🔌 Ticker WebSocket disconnected');
            }
            return () => socketTcker.close();
        }
        FavTokens();
        tokenLoader();
    }, [])

    const formatVolume = (value) => {
        const num = Number(value || 0);
        if (num >= 1e12) return (num / 1e12).toFixed(5) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(5) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(5) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(5) + 'K';
        return num.toFixed(2);
    };

    return (
        <div>
            <li style={{ marginTop: '18px' }}>
                <a data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item style-2 gap-12">
                    <img
                        src={priceBackup?.BTC?.image || "/default-icon.png"}
                        alt="TRX Logo"
                        className="img"
                    />

                    <div className="content">
                        <div className="title">
                            <p className="mb-4 text-button">BTC</p>
                            <span className="text-secondary">
                                ${formatVolume(pricesTicker?.BTCUSDT?.volume || priceBackup?.BTC?.volume || 0)}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                            <span className="text-small">
                                {pricesTicker?.BTCUSDT?.lastPrice
                                    ? `$${Number(pricesTicker.BTCUSDT.lastPrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`
                                    : `$${Number(priceBackup?.BTC?.current_price || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                            </span>
                            {pricesTicker.BTCUSDT?.priceChangePercent !== undefined ? (
                                Number(pricesTicker.BTCUSDT.priceChangePercent) > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(pricesTicker.BTCUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(pricesTicker.BTCUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : priceBackup?.BTC?.price_change_percentage_24h !== undefined ? (
                                priceBackup.BTC.price_change_percentage_24h > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(priceBackup.BTC.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(priceBackup.BTC.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : (
                                <span className="text-button">--</span>
                            )}
                        </div>
                    </div>
                </a>
            </li>
            <li style={{ marginTop: '18px' }}>
                <a data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item style-2 gap-12">
                    <img
                        src={priceBackup?.ETH?.image || "/default-icon.png"}
                        alt="TRX Logo"
                        className="img"
                    />

                    <div className="content">
                        <div className="title">
                            <p className="mb-4 text-button">ETH</p>
                            <span className="text-secondary">
                                ${formatVolume(pricesTicker?.ETHUSDT?.volume || priceBackup?.ETH?.volume || 0)}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                            <span className="text-small">
                                {pricesTicker?.ETHUSDT?.lastPrice
                                    ? `$${Number(pricesTicker.ETHUSDT.lastPrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`
                                    : `$${Number(priceBackup?.ETH?.current_price || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                            </span>
                            {pricesTicker.ETHUSDT?.priceChangePercent !== undefined ? (
                                Number(pricesTicker.ETHUSDT.priceChangePercent) > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(pricesTicker.ETHUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(pricesTicker.ETHUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : priceBackup?.ETH?.price_change_percentage_24h !== undefined ? (
                                priceBackup.ETH.price_change_percentage_24h > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(priceBackup.ETH.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(priceBackup.ETH.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : (
                                <span className="text-button">--</span>
                            )}
                        </div>
                    </div>
                </a>
            </li>
            <li style={{ marginTop: '18px' }}>
                <a data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item style-2 gap-12">
                    <img
                        src={priceBackup?.SOL?.image || "/default-icon.png"}
                        alt="TRX Logo"
                        className="img"
                    />

                    <div className="content">
                        <div className="title">
                            <p className="mb-4 text-button">SOL</p>
                            <span className="text-secondary">
                                ${formatVolume(pricesTicker?.SOLUSDT?.volume || priceBackup?.SOL?.volume || 0)}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                            <span className="text-small">
                                {pricesTicker?.SOLUSDT?.lastPrice
                                    ? `$${Number(pricesTicker.SOLUSDT.lastPrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`
                                    : `$${Number(priceBackup?.SOL?.current_price || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                            </span>
                            {pricesTicker.SOLUSDT?.priceChangePercent !== undefined ? (
                                Number(pricesTicker.SOLUSDT.priceChangePercent) > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(pricesTicker.SOLUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(pricesTicker.SOLUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : priceBackup?.SOL?.price_change_percentage_24h !== undefined ? (
                                priceBackup.SOL.price_change_percentage_24h > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(priceBackup.SOL.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(priceBackup.SOL.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : (
                                <span className="text-button">--</span>
                            )}
                        </div>
                    </div>
                </a>
            </li>
            <li style={{ marginTop: '18px' }}>
                <a data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item style-2 gap-12">
                    <img
                        src={priceBackup?.BNB?.image || "/default-icon.png"}
                        alt="BNB Logo"
                        className="img"
                    />

                    <div className="content">
                        <div className="title">
                            <p className="mb-4 text-button">BNB</p>
                            <span className="text-secondary">
                                ${formatVolume(pricesTicker?.BNBUSDT?.volume || priceBackup?.BNB?.volume || 0)}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                            <span className="text-small">
                                {pricesTicker?.BNBUSDT?.lastPrice
                                    ? `$${Number(pricesTicker.BNBUSDT.lastPrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`
                                    : `$${Number(priceBackup?.BNB?.current_price || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                            </span>
                            {pricesTicker.BNBUSDT?.priceChangePercent !== undefined ? (
                                Number(pricesTicker.BNBUSDT.priceChangePercent) > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(pricesTicker.BNBUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(pricesTicker.BNBUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : priceBackup?.BNB?.price_change_percentage_24h !== undefined ? (
                                priceBackup.BNB.price_change_percentage_24h > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(priceBackup.BNB.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(priceBackup.BNB.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : (
                                <span className="text-button">--</span>
                            )}
                        </div>
                    </div>
                </a>
            </li>
            <li style={{ marginTop: '18px' }}>
                <a data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item style-2 gap-12">
                    <img
                        src={priceBackup?.XRP?.image || "/default-icon.png"}
                        alt="TRX Logo"
                        className="img"
                    />

                    <div className="content">
                        <div className="title">
                            <p className="mb-4 text-button">XRP</p>
                            <span className="text-secondary">
                                ${formatVolume(pricesTicker?.XRPUSDT?.volume || priceBackup?.XRP?.volume || 0)}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                            <span className="text-small">
                                {pricesTicker?.XRPUSDT?.lastPrice
                                    ? `$${Number(pricesTicker.XRPUSDT.lastPrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`
                                    : `$${Number(priceBackup?.XRP?.current_price || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                            </span>
                            {pricesTicker.XRPUSDT?.priceChangePercent !== undefined ? (
                                Number(pricesTicker.XRPUSDT.priceChangePercent) > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(pricesTicker.XRPUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(pricesTicker.XRPUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : priceBackup?.XRP?.price_change_percentage_24h !== undefined ? (
                                priceBackup.XRP.price_change_percentage_24h > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(priceBackup.XRP.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(priceBackup.XRP.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : (
                                <span className="text-button">--</span>
                            )}
                        </div>
                    </div>
                </a>
            </li>
            <li style={{ marginTop: '18px' }}>
                <a data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item style-2 gap-12">
                    <img
                        src={priceBackup?.LINK?.image || "/default-icon.png"}
                        alt="TRX Logo"
                        className="img"
                    />

                    <div className="content">
                        <div className="title">
                            <p className="mb-4 text-button">LINK</p>
                            <span className="text-secondary">
                                ${formatVolume(pricesTicker?.LINKUSDT?.volume || priceBackup?.LINK?.volume || 0)}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                            <span className="text-small">
                                {pricesTicker?.LINKUSDT?.lastPrice
                                    ? `$${Number(pricesTicker.LINKUSDT.lastPrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`
                                    : `$${Number(priceBackup?.LINK?.current_price || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                            </span>
                            {pricesTicker.LINKUSDT?.priceChangePercent !== undefined ? (
                                Number(pricesTicker.LINKUSDT.priceChangePercent) > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(pricesTicker.LINKUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(pricesTicker.LINKUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : priceBackup?.LINK?.price_change_percentage_24h !== undefined ? (
                                priceBackup.LINK.price_change_percentage_24h > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(priceBackup.LINK.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(priceBackup.LINK.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : (
                                <span className="text-button">--</span>
                            )}
                        </div>
                    </div>
                </a>
            </li>
            <li style={{ marginTop: '18px' }}>
                <a data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item style-2 gap-12">
                    <img
                        src={priceBackup?.TRX?.image || "/default-icon.png"}
                        alt="TRX Logo"
                        className="img"
                    />

                    <div className="content">
                        <div className="title">
                            <p className="mb-4 text-button">TRX</p>
                            <span className="text-secondary">
                                ${formatVolume(pricesTicker?.TRXUSDT?.volume || priceBackup?.TRX?.volume || 0)}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                            <span className="text-small">
                                {pricesTicker?.TRXUSDT?.lastPrice
                                    ? `$${Number(pricesTicker.TRXUSDT.lastPrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 3,
                                        maximumFractionDigits: 3,
                                    })}`
                                    : `$${Number(priceBackup?.TRX?.current_price || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                            </span>
                            {pricesTicker.TRXUSDT?.priceChangePercent !== undefined ? (
                                Number(pricesTicker.TRXUSDT.priceChangePercent) > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(pricesTicker.TRXUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(pricesTicker.TRXUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : priceBackup?.TRX?.price_change_percentage_24h !== undefined ? (
                                priceBackup.TRX.price_change_percentage_24h > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(priceBackup.TRX.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(priceBackup.TRX.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : (
                                <span className="text-button">--</span>
                            )}
                        </div>
                    </div>
                </a>
            </li>
            <li style={{ marginTop: '18px' }}>
                <a data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item style-2 gap-12">
                    <img
                        src={priceBackup?.DOGE?.image || "/default-icon.png"}
                        alt="DOGE Logo"
                        className="img"
                    />

                    <div className="content">
                        <div className="title">
                            <p className="mb-4 text-button">DOGE</p>
                            <span className="text-secondary">
                                ${formatVolume(pricesTicker?.DOGEUSDT?.volume || priceBackup?.DOGE?.volume || 0)}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-12">
                            <span className="text-small">
                                {pricesTicker?.DOGEUSDT?.lastPrice
                                    ? `$${Number(pricesTicker.DOGEUSDT.lastPrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 3,
                                        maximumFractionDigits: 3,
                                    })}`
                                    : `$${Number(priceBackup?.DOGE?.current_price || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                            </span>
                            {pricesTicker.DOGEUSDT?.priceChangePercent !== undefined ? (
                                Number(pricesTicker.DOGEUSDT.priceChangePercent) > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(pricesTicker.DOGEUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(pricesTicker.DOGEUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : priceBackup?.DOGE?.price_change_percentage_24h !== undefined ? (
                                priceBackup.DOGE.price_change_percentage_24h > 0 ? (
                                    <span className="coin-btn increase">
                                        {Number(priceBackup.DOGE.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="coin-btn decrease">
                                        {Number(priceBackup.DOGE.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : (
                                <span className="text-button">--</span>
                            )}
                        </div>
                    </div>
                </a>
            </li>
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
    )
}

export default Popular

import React from 'react'
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react'

const Top = () => {
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
    return (
        <div>
            <li style={{ marginTop: '18px' }}>
                <a data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item justify-content-between">
                    <div className="d-flex align-items-center gap-12 flex-1">
                        <h4 className="text-primary">01</h4>
                        <p>
                            <span className="mb-4 text-button fw-6">ETH</span>
                            <span className="text-secondary">/ USDT</span>
                        </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-st2">
                        <span className="text-small">
                            {pricesTicker?.ETHUSDT?.lastPrice
                                ? `${Number(pricesTicker.ETHUSDT.lastPrice).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}`
                                : `${Number(priceBackup?.ETH?.current_price || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}`}

                        </span>
                        <div className="text-end">
                            {pricesTicker.ETHUSDT?.priceChangePercent !== undefined ? (
                                Number(pricesTicker.ETHUSDT.priceChangePercent) > 0 ? (
                                    <span className="text-button text-primary">
                                        {Number(pricesTicker.ETHUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="text-button text-red">
                                        {Number(pricesTicker.ETHUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : priceBackup?.ETH?.price_change_percentage_24h !== undefined ? (
                                priceBackup.ETH.price_change_percentage_24h > 0 ? (
                                    <span className="text-button text-primary">
                                        {Number(priceBackup.ETH.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="text-button text-red">
                                        {Number(priceBackup.ETH.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : (
                                <span className="text-button">--</span>
                            )}

                            <p className="mt-4 text-secondary">
                                {pricesTicker.ETHUSDT?.lastPrice
                                    ? `$${Number(pricesTicker.ETHUSDT.lastPrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`
                                    : `$${Number(priceBackup?.ETH?.price_change_24h || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                            </p>
                        </div>

                    </div>
                </a>
            </li>
            <li style={{ marginTop: '18px' }}>
                <a data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item justify-content-between">
                    <div className="d-flex align-items-center gap-12 flex-1">
                        <h4 className="text-primary">01</h4>
                        <p>
                            <span className="mb-4 text-button fw-6">DOGE</span>
                            <span className="text-secondary">/ USDT</span>
                        </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-st2">
                        <span className="text-small">
                            {pricesTicker?.DOGEUSDT?.lastPrice
                                ? `${Number(pricesTicker.DOGEUSDT.lastPrice).toLocaleString(undefined, {
                                    minimumFractionDigits: 5,
                                    maximumFractionDigits: 5,
                                })}`
                                : `${Number(priceBackup?.DOGE?.current_price || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}`}

                        </span>
                        <div className="text-end">
                            {pricesTicker.DOGEUSDT?.priceChangePercent !== undefined ? (
                                Number(pricesTicker.DOGEUSDT.priceChangePercent) > 0 ? (
                                    <span className="text-button text-primary">
                                        {Number(pricesTicker.DOGEUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="text-button text-red">
                                        {Number(pricesTicker.DOGEUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : priceBackup?.DOGE?.price_change_percentage_24h !== undefined ? (
                                priceBackup.DOGE.price_change_percentage_24h > 0 ? (
                                    <span className="text-button text-primary">
                                        {Number(priceBackup.DOGE.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="text-button text-red">
                                        {Number(priceBackup.DOGE.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : (
                                <span className="text-button">--</span>
                            )}

                            <p className="mt-4 text-secondary">
                                {pricesTicker.DOGEUSDT?.lastPrice
                                    ? `$${Number(pricesTicker.DOGEUSDT.lastPrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 5,
                                        maximumFractionDigits: 5,
                                    })}`
                                    : `$${Number(priceBackup?.DOGE?.price_change_24h || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                            </p>
                        </div>

                    </div>
                </a>
            </li>
            <li style={{ marginTop: '18px' }}>
                <a data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item justify-content-between">
                    <div className="d-flex align-items-center gap-12 flex-1">
                        <h4 className="text-primary">01</h4>
                        <p>
                            <span className="mb-4 text-button fw-6">SOL</span>
                            <span className="text-secondary">/ USDT</span>
                        </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-st2">
                        <span className="text-small">
                            {pricesTicker?.SOLUSDT?.lastPrice
                                ? `${Number(pricesTicker.SOLUSDT.lastPrice).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}`
                                : `${Number(priceBackup?.SOL?.current_price || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}`}

                        </span>
                        <div className="text-end">
                            {pricesTicker.SOLUSDT?.priceChangePercent !== undefined ? (
                                Number(pricesTicker.SOLUSDT.priceChangePercent) > 0 ? (
                                    <span className="text-button text-primary">
                                        {Number(pricesTicker.SOLUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="text-button text-red">
                                        {Number(pricesTicker.SOLUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : priceBackup?.SOL?.price_change_percentage_24h !== undefined ? (
                                priceBackup.SOL.price_change_percentage_24h > 0 ? (
                                    <span className="text-button text-primary">
                                        {Number(priceBackup.SOL.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="text-button text-red">
                                        {Number(priceBackup.SOL.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : (
                                <span className="text-button">--</span>
                            )}

                            <p className="mt-4 text-secondary">
                                {pricesTicker.SOLUSDT?.lastPrice
                                    ? `$${Number(pricesTicker.SOLUSDT.lastPrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`
                                    : `$${Number(priceBackup?.SOL?.price_change_24h || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                            </p>
                        </div>

                    </div>
                </a>
            </li>
            <li style={{ marginTop: '18px' }}>
                <a data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item justify-content-between">
                    <div className="d-flex align-items-center gap-12 flex-1">
                        <h4 className="text-primary">02</h4>
                        <p>
                            <span className="mb-4 text-button fw-6">BNB</span>
                            <span className="text-secondary">/ USDT</span>
                        </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-st2">
                        <span className="text-small">
                            {pricesTicker?.BNBUSDT?.lastPrice
                                ? `${Number(pricesTicker.BNBUSDT.lastPrice).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}`
                                : `${Number(priceBackup?.BNB?.current_price || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}`}

                        </span>
                        <div className="text-end">
                            {pricesTicker.BNBUSDT?.priceChangePercent !== undefined ? (
                                Number(pricesTicker.BNBUSDT.priceChangePercent) > 0 ? (
                                    <span className="text-button text-primary">
                                        {Number(pricesTicker.BNBUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="text-button text-red">
                                        {Number(pricesTicker.BNBUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : priceBackup?.BNB?.price_change_percentage_24h !== undefined ? (
                                priceBackup.BNB.price_change_percentage_24h > 0 ? (
                                    <span className="text-button text-primary">
                                        {Number(priceBackup.BNB.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="text-button text-red">
                                        {Number(priceBackup.BNB.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : (
                                <span className="text-button">--</span>
                            )}

                            <p className="mt-4 text-secondary">
                                {pricesTicker.BNBUSDT?.lastPrice
                                    ? `$${Number(pricesTicker.BNBUSDT.lastPrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`
                                    : `$${Number(priceBackup?.BNB?.price_change_24h || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                            </p>
                        </div>

                    </div>
                </a>
            </li>
            <li style={{ marginTop: '18px' }}>
                <a data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item justify-content-between">
                    <div className="d-flex align-items-center gap-12 flex-1">
                        <h4 className="text-primary">01</h4>
                        <p>
                            <span className="mb-4 text-button fw-6">BTC</span>
                            <span className="text-secondary">/ USDT</span>
                        </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-st2">
                        <span className="text-small">
                            {pricesTicker?.BTCUSDT?.lastPrice
                                ? `${Number(pricesTicker.BTCUSDT.lastPrice).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}`
                                : `${Number(priceBackup?.BTC?.current_price || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}`}

                        </span>
                        <div className="text-end">
                            {pricesTicker.BTCUSDT?.priceChangePercent !== undefined ? (
                                Number(pricesTicker.BTCUSDT.priceChangePercent) > 0 ? (
                                    <span className="text-button text-primary">
                                        {Number(pricesTicker.BTCUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="text-button text-red">
                                        {Number(pricesTicker.BTCUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : priceBackup?.BTC?.price_change_percentage_24h !== undefined ? (
                                priceBackup.BTC.price_change_percentage_24h > 0 ? (
                                    <span className="text-button text-primary">
                                        {Number(priceBackup.BTC.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="text-button text-red">
                                        {Number(priceBackup.BTC.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : (
                                <span className="text-button">--</span>
                            )}

                            <p className="mt-4 text-secondary">
                                {pricesTicker.BTCUSDT?.lastPrice
                                    ? `$${Number(pricesTicker.BTCUSDT.lastPrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`
                                    : `$${Number(priceBackup?.BTC?.price_change_24h || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                            </p>
                        </div>

                    </div>
                </a>
            </li>
            <li style={{ marginTop: '18px' }}>
                <a data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item justify-content-between">
                    <div className="d-flex align-items-center gap-12 flex-1">
                        <h4 className="text-primary">01</h4>
                        <p>
                            <span className="mb-4 text-button fw-6">TRX</span>
                            <span className="text-secondary">/ USDT</span>
                        </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-st2">
                        <span className="text-small">
                            {pricesTicker?.TRXUSDT?.lastPrice
                                ? `${Number(pricesTicker.TRXUSDT.lastPrice).toLocaleString(undefined, {
                                    minimumFractionDigits: 3,
                                    maximumFractionDigits: 3,
                                })}`
                                : `${Number(priceBackup?.TRX?.current_price || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}`}

                        </span>
                        <div className="text-end">
                            {pricesTicker.TRXUSDT?.priceChangePercent !== undefined ? (
                                Number(pricesTicker.TRXUSDT.priceChangePercent) > 0 ? (
                                    <span className="text-button text-primary">
                                        {Number(pricesTicker.TRXUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="text-button text-red">
                                        {Number(pricesTicker.TRXUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : priceBackup?.TRX?.price_change_percentage_24h !== undefined ? (
                                priceBackup.TRX.price_change_percentage_24h > 0 ? (
                                    <span className="text-button text-primary">
                                        {Number(priceBackup.TRX.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="text-button text-red">
                                        {Number(priceBackup.TRX.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : (
                                <span className="text-button">--</span>
                            )}

                            <p className="mt-4 text-secondary">
                                {pricesTicker.TRXUSDT?.lastPrice
                                    ? `$${Number(pricesTicker.TRXUSDT.lastPrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 3,
                                        maximumFractionDigits: 3,
                                    })}`
                                    : `$${Number(priceBackup?.TRX?.current_price || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                            </p>
                        </div>

                    </div>
                </a>
            </li>
            <li style={{ marginTop: '18px' }}>
                <a data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item justify-content-between">
                    <div className="d-flex align-items-center gap-12 flex-1">
                        <h4 className="text-primary">01</h4>
                        <p>
                            <span className="mb-4 text-button fw-6">FIL</span>
                            <span className="text-secondary">/ USDT</span>
                        </p>
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-st2">
                        <span className="text-small">
                            {pricesTicker?.FILUSDT?.lastPrice
                                ? `${Number(pricesTicker.FILUSDT.lastPrice).toLocaleString(undefined, {
                                    minimumFractionDigits: 3,
                                    maximumFractionDigits: 3,
                                })}`
                                : `${Number(priceBackup?.FIL?.current_price || 0).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}`}

                        </span>
                        <div className="text-end">
                            {pricesTicker.FILUSDT?.priceChangePercent !== undefined ? (
                                Number(pricesTicker.FILUSDT.priceChangePercent) > 0 ? (
                                    <span className="text-button text-primary">
                                        {Number(pricesTicker.FILUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="text-button text-red">
                                        {Number(pricesTicker.FILUSDT.priceChangePercent).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : priceBackup?.FIL?.price_change_percentage_24h !== undefined ? (
                                priceBackup.FIL.price_change_percentage_24h > 0 ? (
                                    <span className="text-button text-primary">
                                        {Number(priceBackup.FIL.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                ) : (
                                    <span className="text-button text-red">
                                        {Number(priceBackup.FIL.price_change_percentage_24h).toLocaleString(undefined, {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        })}%
                                    </span>
                                )
                            ) : (
                                <span className="text-button">--</span>
                            )}

                            <p className="mt-4 text-secondary">
                                {pricesTicker.FILUSDT?.lastPrice
                                    ? `$${Number(pricesTicker.FILUSDT.lastPrice).toLocaleString(undefined, {
                                        minimumFractionDigits: 3,
                                        maximumFractionDigits: 3,
                                    })}`
                                    : `$${Number(priceBackup?.FIL?.current_price || 0).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}`}
                            </p>
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

export default Top

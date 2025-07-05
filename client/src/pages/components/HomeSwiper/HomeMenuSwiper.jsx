import React from 'react'
import { FreeMode } from 'swiper/modules';
import { useEffect, useState } from 'react';
import coin3 from "../../../images/coin/coin3.jpg";
import market1 from "../../../images/coin/market1.jpg";
import market3 from "../../../images/coin/market3.jpg";
import { Swiper, SwiperSlide } from 'swiper/react';

const HomeMenuSwiper = () => {

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
            <Swiper
                slidesPerView={2.4}
                spaceBetween={7}
                freeMode={true}
                pagination={{
                    clickable: true,
                }}
                modules={[FreeMode]}
                className="mySwiper"
            >
                <div className="pt-12 pb-12 mt-4">
                    <h5>Market</h5>
                    <div className="swiper" >
                        <SwiperSlide>
                            <a href="/Exchange" className="coin-box d-block">
                                <div className="coin-logo">
                                    <img src={market1} alt="img" className="logo" />
                                    <div className="title">
                                        <p>{priceBackup?.BTC?.name || '--'}</p>
                                        <span>{priceBackup?.BTC?.symbol?.toUpperCase() || '--'}</span>
                                    </div>

                                </div>
                                <div className="mt-8 mb-8 coin-chart">
                                    <div id="line-chart-1"></div>
                                </div>
                                <div className="coin-price d-flex justify-content-between">
                                    {/* <span>${listMain.btc_price}</span> */}
                                    <span>
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
                                    {pricesTicker?.BTCUSDT?.priceChangePercent !== undefined ? (
                                        Number(pricesTicker.BTCUSDT.priceChangePercent) > 0 ? (
                                            <span className="text-primary d-flex align-items-center gap-2">
                                                <i className="icon-select-up"></i>
                                                {Number(pricesTicker.BTCUSDT.priceChangePercent).toFixed(4)}%
                                            </span>
                                        ) : (
                                            <span className="text-danger d-flex align-items-center gap-2">
                                                <i className="icon-select-down"></i>
                                                {Number(pricesTicker.BTCUSDT.priceChangePercent).toFixed(4)}%
                                            </span>
                                        )
                                    ) : priceBackup?.BTC?.price_change_percentage_24h !== undefined ? (
                                        priceBackup.BTC.price_change_percentage_24h > 0 ? (
                                            <span className="text-primary d-flex align-items-center gap-2">
                                                <i className="icon-select-up"></i>
                                                {Number(priceBackup.BTC.price_change_percentage_24h).toFixed(4)}%
                                            </span>
                                        ) : (
                                            <span className="text-danger d-flex align-items-center gap-2">
                                                <i className="icon-select-down"></i>
                                                {Number(priceBackup.BTC.price_change_percentage_24h).toFixed(4)}%
                                            </span>
                                        )
                                    ) : (
                                        <span className="text-muted">--</span>
                                    )}

                                </div>
                                <div className="blur bg1">
                                </div>

                            </a>
                        </SwiperSlide>
                        <SwiperSlide>
                            <a href="/Exchange" className="coin-box d-block">
                                <div className="coin-logo">
                                    <img src={market3} alt="img" className="logo" />
                                    <div className="title">
                                        <p>Binance</p>
                                        <span>{priceBackup?.BNB?.symbol?.toUpperCase() || '--'}</span>
                                    </div>
                                </div>
                                <div className="mt-8 mb-8 coin-chart">
                                    <div id="line-chart-2"></div>
                                </div>
                                <div className="coin-price d-flex justify-content-between">
                                    <span>
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
                                    {pricesTicker?.BNBUSDT?.priceChangePercent !== undefined ? (
                                        Number(pricesTicker.BNBUSDT.priceChangePercent) > 0 ? (
                                            <span className="text-primary d-flex align-items-center gap-2">
                                                <i className="icon-select-up"></i>
                                                {Number(pricesTicker.BNBUSDT.priceChangePercent).toFixed(4)}%
                                            </span>
                                        ) : (
                                            <span className="text-danger d-flex align-items-center gap-2">
                                                <i className="icon-select-down"></i>
                                                {Number(pricesTicker.BNBUSDT.priceChangePercent).toFixed(4)}%
                                            </span>
                                        )
                                    ) : priceBackup?.BNB?.price_change_percentage_24h !== undefined ? (
                                        priceBackup.BNB.price_change_percentage_24h > 0 ? (
                                            <span className="text-primary d-flex align-items-center gap-2">
                                                <i className="icon-select-up"></i>
                                                {Number(priceBackup.BNB.price_change_percentage_24h).toFixed(4)}%
                                            </span>
                                        ) : (
                                            <span className="text-danger d-flex align-items-center gap-2">
                                                <i className="icon-select-down"></i>
                                                {Number(priceBackup.BNB.price_change_percentage_24h).toFixed(4)}%
                                            </span>
                                        )
                                    ) : (
                                        <span className="text-muted">--</span>
                                    )}
                                </div>
                                <div className="blur bg2">
                                </div>
                            </a>
                        </SwiperSlide>
                        <SwiperSlide>
                            <a href="/Exchange" className="coin-box d-block">
                                <div className="coin-logo">
                                    <img src={coin3} alt="img" className="logo" />
                                    <div className="title">
                                        <p>Ethereum</p>
                                        <span>{priceBackup?.ETH?.symbol?.toUpperCase() || '--'}</span>
                                    </div>
                                </div>
                                <div className="mt-8 mb-8 coin-chart">
                                    <div id="line-chart-3"></div>
                                </div>
                                <div className="coin-price d-flex justify-content-between">
                                    <span>
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
                                    {pricesTicker?.ETHUSDT?.priceChangePercent !== undefined ? (
                                        Number(pricesTicker.ETHUSDT.priceChangePercent) > 0 ? (
                                            <span className="text-primary d-flex align-items-center gap-2">
                                                <i className="icon-select-up"></i>
                                                {Number(pricesTicker.ETHUSDT.priceChangePercent).toFixed(4)}%
                                            </span>
                                        ) : (
                                            <span className="text-danger d-flex align-items-center gap-2">
                                                <i className="icon-select-down"></i>
                                                {Number(pricesTicker.ETHUSDT.priceChangePercent).toFixed(4)}%
                                            </span>
                                        )
                                    ) : priceBackup?.ETH?.price_change_percentage_24h !== undefined ? (
                                        priceBackup.ETH.price_change_percentage_24h > 0 ? (
                                            <span className="text-primary d-flex align-items-center gap-2">
                                                <i className="icon-select-up"></i>
                                                {Number(priceBackup.ETH.price_change_percentage_24h).toFixed(4)}%
                                            </span>
                                        ) : (
                                            <span className="text-danger d-flex align-items-center gap-2">
                                                <i className="icon-select-down"></i>
                                                {Number(priceBackup.ETH.price_change_percentage_24h).toFixed(4)}%
                                            </span>
                                        )
                                    ) : (
                                        <span className="text-muted">--</span>
                                    )}
                                </div>
                                <div className="blur bg3">
                                </div>
                            </a>
                        </SwiperSlide>
                    </div>
                </div>
            </Swiper>
        </div>
    )
}

export default HomeMenuSwiper

import axios from "axios";
import { ethers } from "ethers";
import { useContext } from "react";
import toast from "react-hot-toast";
import avt2 from "../images/avt/avt2.jpg";
import { timeAgo } from "./utils/timeAgo";
import { useEffect, useState } from "react";
import logo144 from "../images/logo/logo144.png";
import FadeLoader from 'react-spinners/FadeLoader';
import { UserContext } from "../../context/UserContext";

import Top from "./components/homeData/Top";
import Losers from "./components/homeData/Losers";
import Gainers from "./components/homeData/Gainers";
import Popular from "./components/homeData/Popular";
import Favourite from "./components/homeData/Favourite";
import MarketCap from "./components/homeData/MarketCap";
import HomeActionMenu from "./components/HomeAction/HomeActionMenu";
import HomeMenuSwiper from "./components/HomeSwiper/HomeMenuSwiper";
import HomeMenuSwiperList from "./components/HomeSwiper/HomeMenuSwiperList";

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import tfLineChart from "../js/linechart";

const Home = () => {

    const { user } = useContext(UserContext);
    const [pricesAggTrade, setPricesAggTrade] = useState({});
    const [priceBackup, setPriceBack] = useState({});
    const [accountList, setAccountList] = useState(null);
    const [history, setHistory] = useState('')
    const [Notification, setNotification] = useState('');
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState({
        name: '',
        images: '',
        symbol: '',
        current_price: '',
        market_cap: '',
        lastTradindVolume24: '',
        pricePercentage: '',
        ath_change_percentage: ''
    });

    useEffect(() => {
        tfLineChart.load();
        setLoading(true);
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
        const getNotification = async () => {
            const email = localStorage.getItem('email');
            try {
                axios.post('/getNotification', { email }).then(({ data }) => {
                    const datas = data.notificationList.reverse()
                    const NotificationList = datas.map((data, index) => {
                        const time = data.timestamp;
                        return (
                            <>
                                <li key={index} className="mt-12">
                                    <a href="#" className="noti-item bg-menuDark">
                                        <div className="pb-8 line-bt d-flex">
                                            <p className="text-button fw-6">{data.header} {data.message}</p>
                                            <i className="dot-lg bg-primary"></i>
                                        </div>
                                        <span className="d-block mt-8">{timeAgo(time)}</span>
                                    </a>
                                </li>
                            </>
                        )
                    })
                    setNotification(NotificationList);
                })
            } catch (error) {
                console.log(error);
            }
        }
        const fetcher = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
                const datas = await response.json();
                if (datas.length > 0) {
                    localStorage.setItem('tokens', JSON.stringify(datas));
                }
            } catch (error) {
                console.log(`Error fetching tokens:`, error);
            }
        }
        const getMarketPrices = async () => {
            const socketAggTrade = new WebSocket(import.meta.env.VITE_API_AGGTRADE);

            //=======WebSocket AggTrade Section========//

            socketAggTrade.onopen = () => {
                console.log('✅ AggTrade WebSocket connected');
            };

            socketAggTrade.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                const symbol = msg.symbol?.toUpperCase();

                if (!symbol) return;

                setPricesAggTrade((prev) => ({
                    ...prev,
                    [symbol]: {
                        ...prev[symbol],
                        ...msg,
                    },
                }));
            };

            socketAggTrade.onerror = (err) => {
                console.error('❌ AggTrade WebSocket error:', err);
            };

            socketAggTrade.onclose = () => {
                console.warn('🔌 AggTrade WebSocket disconnected');
            };

            return () => socketAggTrade.close();

        }

        fetcher();
        tokenLoader();
        getMarketPrices();
        getNotification();
        setLoading(false);
    }, [])

    const getData = localStorage.getItem('tokens');
    if (!getData) {
        location.href = '/login'
    }
    if (!localStorage.getItem('email')) { location.href = '/login'; }

    //console.log(pricesAggTrade)
    //console.log(priceBackup)
    return (
        <>
            {/* <!-- preloade --> */}
            <div className="preload preload-container">
                <div className="preload-logo" style={{ backgroundImage: `url(${logo144})` }}>
                    <div className="spinner"></div>
                </div>
            </div>
            {/* <!-- /preload -->  */}
            <div className="header-style2 fixed-top bg-menuDark">
                <div className="d-flex justify-content-between align-items-center gap-14">
                    <div className="box-account style-2">
                        <a href="/UserInfo">
                            {!!user && user.picture !== '' ? <img src={!!user && user.picture} alt="img" className="avt" /> : <img src={avt2} alt="img" className="avt" />}
                        </a>
                        <div className="search-box box-input-field style-2">
                            <a href="home-search.html" className="icon-search"></a>
                            <input type="text" placeholder="Looking for crypto" required className="clear-ip" />
                            <i className="icon-close"></i>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-8">
                        <a href="/ListBlog" className="icon-gift"></a>
                        <a href="#notification" className="icon-noti" data-bs-toggle="modal"><span className="box-noti p-2">{!!user && user.NotificationSeen}</span></a>
                    </div>
                </div>
            </div>
            <div className="pt-68 pb-80">
                <div className="bg-menuDark tf-container">
                    <HomeActionMenu />
                </div>
                <div className="bg-menuDark tf-container">
                    <HomeMenuSwiper />
                </div>
                <div className="bg-menuDark tf-container">
                    <div className="pt-12 pb-12 mt-4">
                        <HomeMenuSwiperList />
                        <div className="tab-content mt-8">
                            <div className="tab-pane fade show active" id="favorites" role="tabpanel">
                                <div className="d-flex justify-content-between">
                                    Index/Name
                                    <p className="d-flex gap-8">
                                        <span>Last Price(USD)/</span>
                                        <span>Change(%)</span>
                                    </p>
                                </div>
                                <ul className="mt-16">
                                    <FadeLoader color="#36d7b7" loading={loading} speedMultiplier={3} style={{ textAlign: 'center', position: 'relative', marginLeft: '50%' }} />
                                    <Top />
                                </ul>
                            </div>
                            <div className="tab-pane fade" id="top" role="tabpanel">
                                <div className="d-flex justify-content-between">
                                    Name/Volume*
                                    <p className="d-flex gap-8">
                                        <span>Current Price(USD)/</span>
                                        <span>Change(%)</span>
                                    </p>
                                </div>
                                <ul className="mt-16">
                                    <Favourite />
                                </ul>
                            </div>
                            <div className="tab-pane fade" id="popular" role="tabpanel">
                                <div className="d-flex justify-content-between">
                                    Name/Volume*
                                    <p className="d-flex gap-8">
                                        <span>Current Price(USD)/</span>
                                        <span>Change(%)</span>
                                    </p>
                                </div>
                                <ul className="mt-16">
                                    <Popular />
                                </ul>
                            </div>
                            <div className="tab-pane fade" id="gainers" role="tabpanel">
                                <div className="d-flex justify-content-between">
                                    Name
                                    <p className="d-flex gap-8">
                                        <span>Current Price(USD)/</span>
                                        <span>Change(%)</span>
                                    </p>
                                </div>
                                <ul className="mt-16">
                                    <Gainers />
                                </ul>
                            </div>
                            <div className="tab-pane fade" id="losers" role="tabpanel">
                                <div className="d-flex justify-content-between">
                                    Name
                                    <p className="d-flex gap-8">
                                        <span>Current Price(USD)/</span>
                                        <span>Change(%)</span>
                                    </p>
                                </div>
                                <ul className="mt-16">
                                    <Losers />
                                </ul>
                            </div>
                            <div className="tab-pane fade" id="cap" role="tabpanel">
                                <div className="d-flex justify-content-between">
                                    Name
                                    <p className="d-flex gap-8">
                                        <span>Current Price(USD)/</span>
                                        <span>Market Cap</span>
                                    </p>
                                </div>
                                <ul className="mt-16">
                                   <MarketCap />
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="menubar-footer footer-fixed">
                <ul className="inner-bar">
                    <li className="active">
                        <a href="/Home">
                            <i className="icon icon-home2"></i>
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="/Exchange">
                            <i className="icon icon-exchange"></i>
                            Exchange
                        </a>
                    </li>
                    <li>
                        <a href="/Earn">
                            <i className="icon icon-earn"></i>
                            Earn
                        </a>
                    </li>
                    <li>
                        <a href="/Wallet">
                            <i className="icon icon-wallet"></i>
                            Wallet
                        </a>
                    </li>
                </ul>
            </div>
            {/* <!-- history --> */}
            <div className="modal fade modalRight" id="walletHistory">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
                            <span className="left" data-bs-dismiss="modal" aria-hidden="true"><i className="icon-left-btn"></i></span>
                            <h3>History</h3>
                            <span className="right text-white btn-filter-history"><i className="icon-funnel"></i></span>
                        </div>
                        <div className="overflow-auto pt-45 pb-16">
                            <div className="tf-container">
                                <ul className="mt-4">
                                    {history}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* <!-- filter history --> */}
            <div className="modal fade action-sheet" id="filterHistory">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span>Filters</span>
                            <span className="icon-cancel" data-bs-dismiss="modal" aria-hidden="true"></span>
                        </div>
                        <div className="modal-body">
                            <div className="text-button fw-6 text-white">Time</div>
                            <ul className="grid-2 rcg-12-16 mt-16">
                                <li><a href="javascript:void(0);" className="tf-btn xs line active text-secondary item-time">All</a></li>
                                <li><a href="javascript:void(0);" className="tf-btn xs line text-secondary item-time">24 Hours</a></li>
                                <li><a href="javascript:void(0);" className="tf-btn xs line text-secondary item-time">7 Days</a></li>
                                <li><a href="javascript:void(0);" className="tf-btn xs line text-secondary item-time">12 Days </a></li>
                                <li><a href="javascript:void(0);" className="tf-btn xs line text-secondary item-time">30 Days</a></li>
                                <li><a href="javascript:void(0);" className="tf-btn xs line text-secondary item-time">3 Month</a></li>
                                <li><a href="javascript:void(0);" className="tf-btn xs line text-secondary item-time">6 Month</a></li>
                                <li><a href="javascript:void(0);" className="tf-btn xs line text-secondary item-time">12 Month</a></li>
                            </ul>
                            <div className="text-button fw-6 text-white mt-16">Categories</div>
                            <ul className="grid-2 rcg-12-16 mt-16">
                                <li><a href="javascript:void(0);" className="tf-btn xs line active text-secondary item-category">All</a></li>
                                <li><a href="javascript:void(0);" className="tf-btn xs line text-secondary item-category">Transfer money</a></li>
                                <li><a href="javascript:void(0);" className="tf-btn xs line text-secondary item-category">Receive money</a></li>
                            </ul>
                            <div className="mt-16 pt-16 line-t grid-2 gap-16">
                                <a href="javascript:void(0);" className="tf-btn sm secondary" data-bs-dismiss="modal">Delete</a>
                                <a href="javascript:void(0);" className="tf-btn sm primary" data-bs-dismiss="modal">Apply</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {/* <!-- account --> */}
            <div className="modal fade action-sheet" id="accountWallet">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span>Wallet</span>
                            <span className="icon-cancel" data-bs-dismiss="modal"></span>
                        </div>
                        <ul className="mt-20 pb-16">
                            {accountList !== null && accountList}
                        </ul>
                    </div>

                </div>
            </div>
            {/* <!--chart detail  --> */}
            <div className="modal fade action-sheet" id="detailChart">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="box-detail-chart">
                            <div className="top">
                                <h3 className="d-flex align-items-center gap-8">{details.symbol.toUpperCase()}/USD<i className="icon-clockwise2 fs-16 text-secondary"></i></h3>
                                <h2 className="mt-4">${details.current_price}</h2>
                                {details.pricePercentage > 1 ? <p className="mt-4"><a className="text-primary">{details.pricePercentage}</a>&emsp;Last 24 hours</p> : <p className="mt-4"><a className="text-red">{details.pricePercentage}</a>&emsp;Last 24 hours</p>}
                            </div>
                            <div className="content">
                                <div className="tab-content mt-8 mb-16">
                                    <div className="tab-pane fade" id="1h" role="tabpanel">
                                        <div className="area-chart-1"></div>
                                    </div>
                                    <div className="tab-pane fade show active" id="1d" role="tabpanel">
                                        <div className="area-chart-2"></div>
                                    </div>
                                    <div className="tab-pane fade" id="1w" role="tabpanel">
                                        <div className="area-chart-3"></div>
                                    </div>
                                    <div className="tab-pane fade" id="1m" role="tabpanel">
                                        <div className="area-chart-4"></div>
                                    </div>
                                    <div className="tab-pane fade" id="6m" role="tabpanel">
                                        <div className="area-chart-5"></div>
                                    </div>
                                    <div className="tab-pane fade" id="1y" role="tabpanel">
                                        <div className="area-chart-6"></div>
                                    </div>
                                </div>
                                <ul className="tab-time" role="tablist">
                                    <li className="nav-item">
                                        <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#1h" role="tab" aria-controls="1h" aria-selected="false">1H</a>
                                    </li>
                                    <li className="nav-item active">
                                        <a href="#" className="nav-link active" data-bs-toggle="tab" data-bs-target="#1d" role="tab" aria-controls="1d" aria-selected="true">1D</a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#1w" role="tab" aria-controls="1w" aria-selected="false">1W</a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#1m" role="tab" aria-controls="1m" aria-selected="false">1M</a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#6m" role="tab" aria-controls="6m" aria-selected="false">6M</a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" className="nav-link" data-bs-toggle="tab" data-bs-target="#1y" role="tab" aria-controls="1y" aria-selected="false">1Y</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="bottom">
                                <h6 className="text-button">Token information</h6>
                                <ul className="mt-16 d-flex gap-16">
                                    <li className="flex-1">
                                        <a href="#" className="accent-box-v6 bg-surface d-flex justify-content-between align-items-center">
                                            <div className="content">
                                                <p className="text-small">{details.symbol.toLocaleUpperCase()} <span className="text-extra-small text-secondary">/ USD</span></p>
                                                {details.pricePercentage > 1 ? <span className="d-inline-block mt-8 coin-btn increase">{details.pricePercentage}</span> : <span className="d-inline-block mt-8 coin-btn decrease">{details.pricePercentage}</span>}
                                            </div>
                                            <span className="icon-arr-right fs-12"></span>
                                        </a>
                                    </li>
                                    <li className="flex-1">
                                        <a href="#" className="accent-box-v6 bg-surface d-flex justify-content-between align-items-center">
                                            <div className="content">
                                                <p className="text-small">{details.name}</p>
                                                {details.ath_change_percentage > 1 ? <span className="d-inline-block mt-8 coin-btn increase">{details.ath_change_percentage}</span> : <span className="d-inline-block mt-8 coin-btn decrease">{details.ath_change_percentage}</span>}
                                            </div>
                                            <span className="icon-arr-right fs-12"></span>
                                        </a>
                                    </li>
                                </ul>
                            </div>


                        </div>
                    </div>

                </div>
            </div>
            {/* <!-- notification --> */}
            <div className="modal fade modalRight" id="notification">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
                            <span className="left" data-bs-dismiss="modal" aria-hidden="true"><i className="icon-left-btn"></i></span>
                            <h3>Notification</h3>
                        </div>
                        <div className="overflow-auto pt-45 pb-16">
                            <div className="tf-container">
                                <ul className="mt-12">
                                    {Notification}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {/* <!-- noti popup --> */}
            <div className="modal fade modalCenter" id="modalNoti">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content modal-sm">
                        <div className="p-16 line-bt text-center">
                            <h4>“Bitclub” Would Like To Send You Notifications</h4>
                            <p className="mt-8 text-large">Notifications may include alerts, sounds, and icon badges. These can be configured in Settings.</p>
                        </div>
                        <div className="grid-2">
                            <a href="#" className="line-r text-center text-button fw-6 p-10 text-secondary btn-hide-modal" data-bs-dismiss="modal" >Don’t Allow</a>
                            <a href="#" className="text-center text-button fw-6 p-10 text-primary btn-hide-modal" data-bs-toggle="modal" data-bs-target="#notiPrivacy"> Allow</a>
                        </div>
                    </div>
                </div>
            </div>
            {/* // // <!-- noti popup 2--> */}
            <div className="modal fade modalCenter" id="notiPrivacy">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content p-20">
                        <div className="heading">
                            <h3>Privacy</h3>
                            <div className="mt-4 text-small">
                                <p>A mobile app privacy policy is a legal statement that must be clear, conspicuous, and consented to by all users. It must disclose how a mobile app gathers, stores, and uses the personally identifiable information it collects from its users.</p>
                                <p>A mobile privacy app is developed and presented to users so that mobile app developers stay compliant with state, federal, and international laws. As a result, they fulfill the legal requirement to safeguard user privacy while protecting the company itself from legal challenges.</p>
                            </div>
                            <h3 className="mt-12">Authorized Users</h3>
                            <p className="mt-4 text-small">
                                A mobile app privacy policy is a legal statement that must be clear, conspicuous, and consented to by all users. It must disclose how a mobile app gathers, stores, and uses the personally identifiable information it collects from its users.
                            </p>
                            <div className="cb-noti mt-12">
                                <input type="checkbox" className="tf-checkbox" id="cb-ip" />
                                <label for="cb-ip">I agree to the Term of service and Privacy policy</label>
                            </div>

                        </div>
                        <div className="mt-20">
                            <a href="#" className="tf-btn md primary" data-bs-dismiss="modal">I Accept</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
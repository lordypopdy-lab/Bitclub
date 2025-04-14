import axios from "axios";
import { ethers } from "ethers";
import { useContext } from "react";
import toast from "react-hot-toast";
import { FreeMode } from 'swiper/modules';
import avt2 from "../images/avt/avt2.jpg";
import { timeAgo } from "./utils/timeAgo";
import { useEffect, useState } from "react";
import coin3 from "../images/coin/coin3.jpg";
import logo144 from "../images/logo/logo144.png";
import market1 from "../images/coin/market1.jpg";
import market3 from "../images/coin/market3.jpg";
import { Swiper, SwiperSlide } from 'swiper/react';
import FadeLoader from 'react-spinners/FadeLoader';
import { UserContext } from "../../context/UserContext";

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import tfLineChart from "../js/linechart";

const Home = () => {

const { user } = useContext(UserContext);

const [balance, setBalance] = useState(null);
const [accountList, setAccountList] = useState(null);
const [history, setHistory] = useState('')
const [Notification, setNotification] = useState('');

const [loading, setLoading] = useState(false);
const [list1, setList1] = useState(null);
const [list2, setList2] = useState(null);
const [list3, setList3] = useState(null);
const [list4, setList4] = useState(null);
const [list5, setList5] = useState(null);
const [listMain, setlistMain] = useState({
btc_price: '',
btc_symbol: '',
btc_name: '',
btc_change_percent: '',
eth_name: '',
eth_symbol: '',
eth_price: '',
eth_change_percent: '',
bnb_name: '',
bnb_symbol: '',
bnb_price: '',
bnb_change_percent: '',
usdt_name: '',
usdt_symbol: '',
usdt_price: '',
usdt_change_percent: '',
doge_name: '',
doge_symbol: '',
doge_price: '',
doge_change_percent: '',
});
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
getNotification();

//////////////''''''''//////////TOKEN FETCHER////////////''''''''//////////////
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
fetcher();

/////////'''''''''''////////TOKEN FORMATER AND MAPPER//////////'''''''''//////////
const tokenFormatter = async ()=>{
const getData = localStorage.getItem('tokens');
const datas = JSON.parse(getData);
const tokenList1 = datas.map((data, index) => {
    const updateT = () => {
        setDetails({
            name: data.name,
            images: data.image,
            symbol: data.symbol,
            current_price: data.current_price,
            market_cap: data.market_cap,
            lastTradindVolume24: data.price_change_24h,
            pricePercentage: data.price_change_percentage_24h,
            ath_change_percentage: data.ath_change_percentage
        })
    }

    return (
        <li key={index} style={{ marginTop: '18px' }}>
            <a onClick={updateT} data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item style-2 gap-12">
                <img src={data.image} alt="img" className="img" />
                <div className="content">
                    <div className="title">
                        <p className="mb-4 text-button">{data.symbol.toUpperCase()}</p>
                        <span className="text-secondary">${data.market_cap}M</span>
                    </div>
                    <div className="d-flex align-items-center gap-12">
                        <span className="text-small">${data.current_price}</span>
                        {data.price_change_percentage_24h > 1 ? <span className="coin-btn increase">{data.price_change_percentage_24h}2%</span> : <span className="coin-btn decrease">{data.price_change_percentage_24h}2%</span>}
                    </div>
                </div>
            </a>
        </li>
    )
})

const tokenList2 = datas.map((data, index) => {
    const updateT = () => {
        setDetails({
            name: data.name,
            images: data.image,
            symbol: data.symbol,
            current_price: data.current_price,
            market_cap: data.market_cap,
            lastTradindVolume24: data.price_change_24h,
            pricePercentage: data.price_change_percentage_24h,
            ath_change_percentage: data.ath_change_percentage
        })
    }

    return (
        <li key={index} style={{ marginTop: '18px' }}>
            <a onClick={updateT} data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item style-2 gap-12">
                <img src={data.image} alt="img" className="img" />
                <div className="content">
                    <div className="title">
                        <p className="mb-4 text-button">{data.symbol.toUpperCase()}</p>
                        <span className="text-secondary">${data.market_cap}M</span>
                    </div>
                    <div className="d-flex align-items-center gap-12">
                        <span className="text-small">${data.current_price}</span>
                        {data.price_change_percentage_24h > 1 ? <span className="coin-btn increase">{data.price_change_percentage_24h}2%</span> : <span className="coin-btn decrease">{data.price_change_percentage_24h}2%</span>}
                    </div>
                </div>
            </a>
        </li>
    )
})

const tokenList3 = datas.map((data, index) => {
    const updateT = () => {
        setDetails({
            name: data.name,
            images: data.image,
            symbol: data.symbol,
            current_price: data.current_price,
            market_cap: data.market_cap,
            lastTradindVolume24: data.price_change_24h,
            pricePercentage: data.price_change_percentage_24h,
            ath_change_percentage: data.ath_change_percentage
        })
    }

    return (
        <li key={index} style={{ marginTop: '18px' }}>
            <a onClick={updateT} data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item style-2 gap-12">
                <img src={data.image} alt="img" className="img" />
                <div className="content">
                    <div className="title">
                        <p className="mb-4 text-button">{data.symbol.toUpperCase()}</p>
                        <span className="text-secondary">${data.market_cap}M</span>
                    </div>
                    <div className="d-flex align-items-center gap-12">
                        <span className="text-small">${data.current_price}</span>
                        {data.price_change_percentage_24h > 1 ? <span className="coin-btn increase">{data.price_change_percentage_24h}2%</span> : <span className="coin-btn decrease">{data.price_change_percentage_24h}2%</span>}
                    </div>
                </div>
            </a>
        </li>
    )
})

const tokenList4 = datas.map((data, index) => {
    const updateT = () => {
        setDetails({
            name: data.name,
            images: data.image,
            symbol: data.symbol,
            current_price: data.current_price,
            market_cap: data.market_cap,
            lastTradindVolume24: data.price_change_24h,
            pricePercentage: data.price_change_percentage_24h,
            ath_change_percentage: data.ath_change_percentage
        })
    }
    return (
        <li key={index} style={{ marginTop: '18px' }}>
            <a onClick={updateT} data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item justify-content-between">
                <div className="d-flex align-items-center gap-12 flex-1">
                    <h4 className="text-primary">{index}</h4>
                    <p>
                        <span className="mb-4 text-button fw-6">{data.symbol.toLocaleUpperCase()}</span>
                        <span className="text-secondary">/ USDT</span>
                    </p>
                </div>
                <div className="d-flex justify-content-between align-items-center flex-st2">
                    <span className="text-small">${data.high_24h}</span>
                    <div className="text-end">
                        {data.price_change_percentage_24h > 1 ? <p className="text-button text-primary">{data.price_change_percentage_24h}</p> : <p className="text-button text-red">{data.price_change_percentage_24h}</p>}
                        <p className="mt-4 text-secondary">${data.current_price}</p>
                    </div>
                </div>
            </a>
        </li>
    )
})

const tokenList5 = datas.map((data, index) => {
    const updateT = () => {
        setDetails({
            name: data.name,
            images: data.image,
            symbol: data.symbol,
            current_price: data.current_price,
            market_cap: data.market_cap,
            lastTradindVolume24: data.price_change_24h,
            pricePercentage: data.price_change_percentage_24h,
            ath_change_percentage: data.ath_change_percentage
        })
    }
    return (
        <li key={index} style={{ marginTop: '18px' }}>
            <a onClick={updateT} data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item justify-content-between">
                <div className="d-flex align-items-center gap-12 flex-1">
                    <h4 className="text-primary">{index}</h4>
                    <p>
                        <span className="mb-4 text-button fw-6">{data.symbol.toLocaleUpperCase()}</span>
                        <span className="text-secondary">/ USDT</span>
                    </p>
                </div>
                <div className="d-flex justify-content-between align-items-center flex-st2">
                    <span className="text-small">${data.high_24h}</span>
                    <div className="text-end">
                        {data.price_change_percentage_24h > 1 ? <p className="text-button text-primary">{data.price_change_percentage_24h}</p> : <p className="text-button text-red">{data.price_change_percentage_24h}</p>}
                        <p className="mt-4 text-secondary">${data.current_price}</p>
                    </div>
                </div>
            </a>
        </li>
    )
})

const connectMetaMask = async () => {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const USER_ADDRESS = signer.getAddress();
        const GET_BALANCE = await provider.getBalance(USER_ADDRESS);
        const FORMATED_BALANCE = ethers.utils.formatEther(GET_BALANCE);

        const ACCOUNT_LISTS = await provider.listAccounts();
        const acc_list = ACCOUNT_LISTS.map((ACCOUNT_LIST, index) => {
            const handleCopy = async () => {
                try {
                    await navigator.clipboard.writeText(ACCOUNT_LIST);
                    toast.success('Copied!');
                } catch (error) {
                    toast.error('Fail to Copy!');
                }
            }
            return (
                <>
                    <li key={index} data-bs-dismiss="modal">
                        <div className="d-flex justify-content-between align-items-center gap-8 text-large item-check active dom-value">Account {index}</div>
                        <div className="mb-1">
                            <span className="text-secondary" style={{ fontSize: '14px' }}>{ACCOUNT_LIST.slice(0, 30)}...</span> <i title="Copy" onClick={handleCopy} style={{ fontSize: '22px', cursor: 'pointer' }} className="icon icon-copy text-primary"></i>
                        </div>
                    </li>
                </>
            )
        })
        setAccountList(acc_list);

        const BALANCE_IN_USDC = datas[1].current_price;
        const BALANCE_IN_USDC_CONVERTED = BALANCE_IN_USDC * FORMATED_BALANCE;
        setBalance(BALANCE_IN_USDC_CONVERTED);

    } else {
        toast.error('Non-Ethereum browser detected. Consider trying MetaMask!')
        console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
    }
}
connectMetaMask();

const getHistory = async () => {
    const email = localStorage.getItem('email');
    try {
        const { data } = await axios.post('/getHistory', { email });
        const datas  = data.historyList.reverse();
        if (datas) {
            const historyList = datas.map((history, index) => {
                return (
                    <>
                        <li key={index} className="mt-8">
                            <a href="#" className="line-bt coin-item mb-1 style-1 gap-12 bg-menuDark">
                                <span className="box-round d-flex justify-content-center align-items-center"><i style={{ fontSize: '20px' }} className="icon icon-delete"></i></span>
                                <div className="content">
                                    <div className="title">
                                        <p className="mb-4 text-large">{history.type}</p>
                                        {history.Status == 'Success' ? <span className="text-success">{history.Status}</span> : <span className="text-warning">{history.Status}</span>}
                                    </div>
                                    <div className="box-price">
                                        {history.type == 'Deposite' || history.type == 'Sent' ? <p className="text-small mb-2"><span className="text-danger">-</span> ETH {history.valueEth}</p> : <p className="text-small mb-4"><span className="text-primary">+</span> ETH {history.valueEth}</p>}
                                        {history.type == 'Deposite' || history.type == 'Sent' ? <p className="text-small"><span className="text-danger">-</span> ${history.valueUsd && history.valueUsd.toFixed(2)}</p> : <p className="text-small"><span className="text-primary">+</span> ${history.valueUsd && history.valueUsd.toFixed(2)}</p>}
                                        <span className="mt-2" style={{marginLeft: '60px'}}>{timeAgo(history.timestamp)}</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                    </>
                )
            })
            setHistory(historyList);
        }
    } catch (error) {
        console.log(error);
    }
}
getHistory();

setlistMain({
    btc_price: datas[0].current_price,
    btc_symbol: datas[0].symbol,
    btc_name: datas[0].name,
    btc_change_percent: datas[0].market_cap_change_percentage_24h,
    eth_name: datas[1].name,
    eth_symbol: datas[1].symbol,
    eth_price: datas[1].current_price,
    eth_change_percent: datas[1].market_cap_change_percentage_24h,
    bnb_name: datas[3].name,
    bnb_symbol: datas[3].symbol,
    bnb_price: datas[3].current_price,
    bnb_change_percent: datas[3].market_cap_change_percentage_24h,
    usdt_name: datas[2].name,
    usdt_symbol: datas[2].symbol,
    usdt_price: datas[2].current_price,
    usdt_change_percent: datas[2].market_cap_change_percentage_24h,
    doge_name: datas[8].name,
    doge_symbol: datas[8].symbol,
    doge_price: datas[8].current_price,
    doge_change_percent: datas[8].market_cap_change_percentage_24h,
})
setList1(tokenList1.slice(60, 80));
setList2(tokenList2.slice(0, 9));
setList3(tokenList3.slice(0, 9))
setList4(tokenList4.slice(0, 11))
setList5(tokenList5.slice(50, 60))
setLoading(false);


}
tokenFormatter();

}, [])

const getData = localStorage.getItem('tokens');
if(!getData){
location.href='/login'
}
if (!localStorage.getItem('email')) { location.href = '/login'; }

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
                    <div className="pt-12 pb-12 mt-4">
                        <h5><span className="text-primary">My Wallet</span> - <a href="#" className="choose-account" data-bs-toggle="modal" data-bs-target="#accountWallet"><span className="dom-text">Account 1 </span> &nbsp;<i className="icon-select-down"></i></a> </h5>
                        {balance == null ? <h1 className="mt-16"><a href="#">$0.00</a></h1> : <h1 className="mt-16"><a href="#">${balance !== null && balance.toFixed(2)}</a></h1>}
                        <ul className="mt-16 grid-4 m--16">
                            <li>
                                <a href="/Send" className="tf-list-item d-flex flex-column gap-8 align-items-center">
                                    <span className="box-round bg-surface d-flex justify-content-center align-items-center"><i className="icon icon-way"></i></span>
                                    Send
                                </a>
                            </li>
                            <li>
                                <a href="/AddressScan" className="tf-list-item d-flex flex-column gap-8 align-items-center">
                                    <span className="box-round bg-surface d-flex justify-content-center align-items-center"><i className="icon icon-way2"></i></span>
                                    Receive
                                </a>
                            </li>
                            <li>
                                <a href="/Earn" className="tf-list-item d-flex flex-column gap-8 align-items-center">
                                    <span className="box-round bg-surface d-flex justify-content-center align-items-center"><i className="icon icon-exchange"></i></span>
                                    Earn
                                </a>
                            </li>
                            <li data-bs-toggle="modal" data-bs-target="#walletHistory">
                                <a href="javascript:void(0);" className="tf-list-item d-flex flex-column gap-8 align-items-center">
                                    <span className="box-round bg-surface d-flex justify-content-center align-items-center"><i className="icon icon-history"></i></span>
                                    History
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="bg-menuDark tf-container">
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
                                                <p>{listMain.btc_name}</p>
                                                <span>{listMain.btc_symbol.toLocaleUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div className="mt-8 mb-8 coin-chart">
                                            <div id="line-chart-1"></div>
                                        </div>
                                        <div className="coin-price d-flex justify-content-between">
                                            <span>${listMain.btc_price}</span>
                                            <span className="text-primary d-flex align-items-center gap-2"><i className="icon-select-up"></i>{listMain.btc_change_percent}%</span>
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
                                                <span>{listMain.bnb_symbol.toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div className="mt-8 mb-8 coin-chart">
                                            <div id="line-chart-2"></div>
                                        </div>
                                        <div className="coin-price d-flex justify-content-between">
                                            <span>${listMain.bnb_price}</span>
                                            <span className="text-primary d-flex align-items-center gap-2"><i className="icon-select-up"></i>{listMain.bnb_change_percent}%</span>
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
                                                <p>{listMain.eth_name}</p>
                                                <span>{listMain.eth_symbol.toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div className="mt-8 mb-8 coin-chart">
                                            <div id="line-chart-3"></div>
                                        </div>
                                        <div className="coin-price d-flex justify-content-between">
                                            <span>${listMain.eth_price}</span>
                                            <span className="text-primary d-flex align-items-center gap-2"><i className="icon-select-up"></i>{listMain.eth_change_percent}%</span>
                                        </div>
                                        <div className="blur bg3">
                                        </div>
                                    </a>
                                </SwiperSlide>
                            </div>

                        </div>
                    </Swiper>
                </div>

                <div className="bg-menuDark tf-container">
                    <div className="pt-12 pb-12 mt-4">
                        <div className="wrap-filter-swiper">
                            <h5><a href="/assetsRatings" className="cryptex-rating"><i className="icon-star"></i>Bitclub Rating</a></h5>
                            {/* <!-- <div className="swiper swiper-wrapper-r market-swiper" data-space-between="20" data-preview="auto"> --> */}
                            <div className="swiper-wrapper1 menu-tab-v3 mt-12" role="tablist">
                                <div className="swiper-slide1 nav-link active" data-bs-toggle="tab" data-bs-target="#favorites" role="tab" aria-controls="favorites" aria-selected="true">
                                    Favorites
                                </div>
                                <div className="swiper-slide1 nav-link" data-bs-toggle="tab" data-bs-target="#top" role="tab" aria-controls="top" aria-selected="false">
                                    Top
                                </div>
                                <div className="swiper-slide1 nav-link" data-bs-toggle="tab" data-bs-target="#popular" role="tab" aria-controls="popular" aria-selected="false">
                                    Popular
                                </div>
                                <div className="swiper-slide1 nav-link" data-bs-toggle="tab" data-bs-target="#price" role="tab" aria-controls="price" aria-selected="false">
                                    Token price
                                </div>
                                <div className="swiper-slide1 nav-link" data-bs-toggle="tab" data-bs-target="#new" role="tab" aria-controls="new" aria-selected="false">
                                    New token
                                </div>
                            </div>
                            {/* <!-- </div> --> */}
                        </div>
                        <div className="tab-content mt-8">
                            <div className="tab-pane fade show active" id="favorites" role="tabpanel">
                                <div className="d-flex justify-content-between">
                                    Name
                                    <p className="d-flex gap-8">
                                        <span>Current Price(USD)/</span>
                                        <span>Change(%)</span>
                                    </p>
                                </div>
                                <ul className="mt-16">
                                    <FadeLoader
                                        color="#36d7b7"
                                        loading={loading}
                                        speedMultiplier={3}
                                        style={{ textAlign: 'center', position: 'relative', marginLeft: '50%' }}
                                    />
                                    {list5}
                                </ul>
                            </div>
                            <div className="tab-pane fade" id="top" role="tabpanel">
                                <div className="d-flex justify-content-between">
                                    Name
                                    <p className="d-flex gap-8">
                                        <span>Current Price(USD)/</span>
                                        <span>Change(%)</span>
                                    </p>
                                </div>
                                <ul className="mt-16">
                                    {list2};
                                </ul>
                            </div>
                            <div className="tab-pane fade" id="popular" role="tabpanel">
                                <div className="d-flex justify-content-between">
                                    Name
                                    <p className="d-flex gap-8">
                                        <span>Current Price(USD)/</span>
                                        <span>Change(%)</span>
                                    </p>
                                </div>
                                <ul className="mt-16">
                                    {list3}
                                </ul>
                            </div>
                            <div className="tab-pane fade" id="price" role="tabpanel">
                                <div className="d-flex justify-content-between">
                                    Name
                                    <p className="d-flex gap-8">
                                        <span>Current Price(USD)/</span>
                                        <span>Change(%)</span>
                                    </p>
                                </div>
                                <ul className="mt-16">
                                    {list4}
                                </ul>
                            </div>
                            <div className="tab-pane fade" id="new" role="tabpanel">
                                <div className="d-flex justify-content-between">
                                    Name
                                    <p className="d-flex gap-8">
                                        <span>Current Price(USD)/</span>
                                        <span>Change(%)</span>
                                    </p>
                                </div>
                                <ul className="mt-16">
                                    {list1}
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
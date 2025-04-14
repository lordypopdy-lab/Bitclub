import axios from "axios";
import { ethers } from "ethers";
import { useContext } from "react";
import toast from "react-hot-toast";
import { timeAgo } from "../utils/timeAgo";
import { useEffect, useState } from "react";
import logo144 from "../../images/logo/logo144.png";
import FadeLoader from 'react-spinners/FadeLoader';
import { UserContext } from "../../../context/UserContext";

const Wallet = () => {
    const [loading, setLoading] = useState(false);
    const [list1, setList1] = useState(null);
    const [balance, setBalance] = useState(null);
    const [accountList, setAccountList] = useState(null);
    const [history, setHistory] = useState('')
    const [Notification, setNotification] = useState('');

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
        setLoading(true);
        const getNotification = async () => {
            const email = localStorage.getItem('email');
            try {
                axios.post('/getNotification', { email }).then(({ data }) => {
                    const datas = data.notificationList.reverse();
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

        try {
            const getToken = async () => {
                const tokenGetter = localStorage.getItem('tokens');
                const datas = JSON.parse(tokenGetter);
                const tokenList1 = datas.map((token, index) => {
                    const updateT = () => {
                        setDetails({
                            name: token.name,
                            images: token.image,
                            symbol: token.symbol,
                            current_price: token.current_price,
                            market_cap: token.market_cap,
                            lastTradindVolume24: token.price_change_24h,
                            pricePercentage: token.price_change_percentage_24h,
                            ath_change_percentage: token.ath_change_percentage
                        })
                    }

                    return (
                        <li key={index} style={{ marginTop: '9px' }}>
                            <a onClick={updateT} data-bs-toggle="modal" data-bs-target="#detailChart" className="coin-item style-1 gap-12 bg-surface">
                                <img src={token.image} alt="img" className="img" />
                                <div className="content">
                                    <div className="title">
                                        <p className="mb-4 text-large">{token.name}</p>
                                        <span className="text-secondary">11:34 AM</span>
                                    </div>
                                    <div className="box-price">
                                        <p className="text-small mb-4"><span className="text-primary">+</span> {token.symbol.toUpperCase()} {token.high_24h}</p>
                                        <p className="text-end"><span className="text-red">-</span>{token.low_24h}</p>
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
                        const datas = data.historyList.reverse();
                        if (data) {
                            const historyList = datas.map((history, index) => {
                                return (
                                    <>
                                        <li key={index} className="mt-8">
                                            <a href="#" className="coin-item style-1 gap-12 bg-menuDark">
                                                <span className="box-round d-flex justify-content-center align-items-center"><i style={{ fontSize: '20px' }} className="icon icon-delete"></i></span>
                                                <div className="content">
                                                    <div className="title">
                                                        <p className="mb-4 text-large">{history.type}</p>
                                                        {history.Status == 'Success' ? <span className="text-success">{history.Status}</span> : <span className="text-warning">{history.Status}</span>}
                                                    </div>
                                                    <div className="box-price">
                                                        {history.type == 'Deposite' || history.type == 'Sent' ? <p className="text-small mb-4"><span className="text-danger">-</span> ETH {history.valueEth}</p> : <p className="text-small mb-4"><span className="text-primary">+</span> ETH {history.valueEth}</p>}
                                                        {history.type == 'Deposite' || history.type == 'Sent' ? <p className="text-small"><span className="text-danger">-</span> ${history.valueUsd && history.valueUsd.toFixed(2)}</p> : <p className="text-small"><span className="text-primary">+</span> ${history.valueUsd && history.valueUsd.toFixed(2)}</p>}
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

                setList1(tokenList1.slice(0, 21));
                setLoading(false);

            }

            getToken();
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            setLoading(false);
        }
    }, [])

    const toContractOne = async () => {
        const email = localStorage.getItem('email');
        try {
            const { data } = await axios.post('/getContractOne', { email });
            if (data.success && data.contractOne.status !== 'Paused') {
                setLoading(false);
                location.href = '/ContractOneProfile'
            } else {
                setLoading(false);
                location.href = '/ContractOne'
            }
        } catch (error) {
            setLoading(false);
            console.log(`Contract is yet to Activated!: ${error}`)
        }
    }

    const toContractTwo = async () => {
        const email = localStorage.getItem('email');
        try {
            const { data } = await axios.post('/getContractTwo', { email });
            if (data.success && data.contractOne.status !== 'Paused') {
                setLoading(false);
                location.href = '/ContractTwoProfile'
            } else {
                setLoading(false);
                location.href = '/ContractTwo'
            }
        } catch (error) {
            setLoading(false);
            console.log(`Contract is yet to Activated!: ${error}`)
        }
    }

const { user } = useContext(UserContext);
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
                <div className="d-flex justify-content-between align-items-center">
                    <a className="box-account" href="/UserInfo">
                        {!!user && user.picture !== '' ? <img src={!!user && user.picture} alt="img" className="avt" /> : <img src="/src/images/avt/avt2.jpg" alt="img" className="avt" />}
                        <div className="info">
                            <p className="text-xsmall text-secondary">Welcome back!</p>
                            <h5 className="mt-4">{!!user && user.name}</h5>

                        </div>
                    </a>
                    <div className="d-flex align-items-center gap-8">
                        <a href="/assetsRatings" className="icon-search"></a>
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
                                <a href="/deposite" className="tf-list-item d-flex flex-column gap-8 align-items-center">
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
                    <div className="tf-tab pt-12 mt-4">
                        <div className="tab-slide">
                            <ul className="nav nav-tabs wallet-tabs" role="tablist" >
                                <li className="item-slide-effect"></li>
                                <li className="nav-item active" role="presentation">
                                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#history">Contracts</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#market">Market</button>
                                </li>
                            </ul>
                        </div>
                        <div className="tab-content pt-16 pb-16">
                            <div className="tab-pane fade active show" id="history" role="tabpanel">
                                <ul>
                                    <li>
                                        <div className="accent-box-v5 p-0 bg-menuDark active" style={{ width: '100%' }}>
                                            <a onClick={toContractOne} className="coin-item style-1 gap-12 bg-surface">
                                                <span className="icon-box bg-transparent bg-icon1"><i className="icon-book"></i></span>
                                                <div className="mt-12">
                                                    <a href="#" className="text-small">Contract <span style={{ color: '#25C866' }}>Class One</span></a>
                                                    <p className="mt-4">Click Create and set up your collection.
                                                        Add contract status, a description, price & contract icons, and set a secondary sales fee. <span style={{ color: '#25C866' }}>Contract level one+</span></p>
                                                </div>
                                            </a>
                                        </div>
                                    </li>
                                    <li className="mt-8">
                                        <div className="accent-box-v5 p-0 bg-menuDark" style={{ width: '100%' }}>
                                            <a onClick={toContractTwo} className="coin-item style-1 gap-12 bg-surface">
                                                <span className="icon-box bg-transparent bg-icon1"><i className="icon-book"></i></span>
                                                <div className="mt-12">
                                                    <a href="#" className="text-small">Contract <span style={{ color: '#25C866' }}>Class two</span></a>
                                                    <p className="mt-4">Click Create and set up your collection.
                                                        Add contract status, a description, price & contract icons, and set a secondary sales fee. <span style={{ color: '#25C866' }}>Contract level two+</span></p>
                                                </div>
                                            </a>
                                        </div>
                                    </li>
                                    <li className="mt-8">
                                        <div className="accent-box-v5 p-0 bg-menuDark" style={{ width: '100%' }}>
                                            <a href="/ContractThree" className="coin-item style-1 gap-12 bg-surface">
                                                <span className="icon-box bg-transparent bg-icon2"><i className="icon-wallet-money"></i></span>
                                                <div className="mt-12">
                                                    <a href="#" className="text-small">Contract <span style={{ color: '#25C866' }}>Class three</span></a>
                                                    <p className="mt-4">Click Create and set up your collection.
                                                        Add contract status, a description, price & contract icons, and set a secondary sales fee. <span style={{ color: '#ab00e7' }}>Contract level three+</span></p>
                                                </div>
                                            </a>
                                        </div>
                                    </li>
                                    <li className="mt-8">
                                        <div className="accent-box-v5 p-0 bg-menuDark" style={{ width: '100%' }}>
                                            <a href="/ContractFour" className="coin-item style-1 gap-12 bg-surface">
                                                <span className="icon-box bg-transparent bg-icon2"><i className="icon-wallet-money"></i></span>
                                                <div className="mt-12">
                                                    <a href="#" className="text-small">Contract <span style={{ color: '#25C866' }}>Class four</span></a>
                                                    <p className="mt-4">Click Create and set up your collection.
                                                        Add contract status, a description, price & contract icons, and set a secondary sales fee. <span style={{ color: '#ab00e7' }}>Contract level four+</span></p>
                                                </div>
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="tab-pane fade" id="market" role="tabpanel">
                                <ul>
                                    <FadeLoader
                                        color="#36d7b7"
                                        loading={loading}
                                        speedMultiplier={3}
                                        style={{ textAlign: 'center', position: 'relative', marginLeft: '50%' }}
                                    />
                                    {list1}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="menubar-footer footer-fixed">
                <ul className="inner-bar">
                    <li>
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
                    <li className="active">
                        <a href="/Wallet">
                            <i className="icon icon-wallet2"></i>
                            Wallet
                        </a>
                    </li>
                </ul>
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
                                <button onClick={(() => { location.href = "/Deposite" })} className="mt-20">Buy Assets</button>
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
        </>
    )
}

export default Wallet
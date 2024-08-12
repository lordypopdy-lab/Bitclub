import axios from 'axios';
import { useState, useEffect } from "react";
import FadeLoader from 'react-spinners/FadeLoader';
import toast from 'react-hot-toast';


const ContractTwoProfile = () => {
    const e = localStorage.getItem('email');
    if (!e) {
        location.href = '/login';
    }
  
    const [loading, setLoading] = useState(false);
    const [trx_rate, set_trx_rate] = useState(null);
    const [trx, setTrx] = useState({
      from: '',
      to: '',
      contractPrice: null,
      ContractProfit: null,
      status: '',
      id: null,
      blockNumber: null,
      priceInUsd: null
    })
    const [usd_details, setUsdDetails] = useState({
      eth_price: 0,
      eth_last_change: ''
    })
  
  
    useEffect(() => {
      setLoading(true);
  
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
        if (window.ethereum) {
          const data = JSON.parse(localStorage.getItem('tokens'));
            if (data) {
              setUsdDetails({
                eth_price: data[1].current_price,
                eth_last_change: data[1].price_change_percentage_24h
              })
              const USD_PRICE = data[1].current_price;
              set_trx_rate(USD_PRICE);
              setLoading(false);
            } else {
              console.log('Error fetching Tokens!')
            }
  
          const getCoontractTwo = async () => {
            const email = localStorage.getItem('email');
            try {
              const { data } = await axios.post('/getContractTwo', { email });
              if (data.success) {
                setTrx({
                  to: data.contractOne.to,
                  from: data.contractOne.from,
                  contractPrice: data.contractOne.contractPrice,
                  ContractProfit: data.contractOne.contractProfit,
                  status: data.contractOne.status,
                  id: data.contractOne._id,
                  blockNumber: data.contractOne.blockNumber,
                  priceInUsd: data.contractOne.contractPrice
                })
                setLoading(false)
              } else {
                setLoading(false);
                console.log(`Contract is yet to Activated!: ${error}`)
              }
            } catch (error) {
              setLoading(false);
              toast.error('Contract is yet to be Activated!');
              console.log(`Contract is yet to Activated!: ${error}`)
            }
          }
          getCoontractTwo();
  
        } else {
          toast.error('Non-Ethereum browser detected. Consider trying MetaMask!')
          console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
        }
      } catch (error) {
        toast.error("Error fetching API refresh App");
        console.log(error);
      }
    }, [])
  
    const convertedPrice = trx_rate * trx.contractPrice;
    const convertedProfit = trx_rate * trx.ContractProfit;
    return (
        <>
          <div className="app-wallet">
            <div className="header-style2 fixed-top d-flex align-items-center justify-content-between bg-surface">
              <h3 className="d-flex gap-12">
                <span style={{ color: '#25C866' }}>Profile Two+</span>
              </h3>
              <i className="icon-question text-white"></i>
            </div>
            <div className="pt-40 pb-120">
              <div className="tf-container">
                <div className="tf-tab pt-12 mt-4">
                  <div className="pt-55">
                    <div className="tf-container bg-transparent">
                      <h1 className="mt-8 text-center">${trx.contractPrice !== null && convertedPrice.toFixed(2)}</h1>
                      <ul className="mt-12 accent-box-v4 bg-menuDark">
    
                        <li className="d-flex align-items-center justify-content-between pt-8 pb-8 line-bt">
                          <span className="text-small">Estimated contract changes</span>
                          <h3 className="text-button text-white fw-6 text-end">${convertedProfit !== null && convertedProfit.toFixed(2)}</h3>
                        </li>
                        <li className="d-flex align-items-center justify-content-between pt-8 pb-8 line-bt">
                          <span className="text-small">blockNumber</span>
                          <span className="text-large text-white">#{trx.blockNumber !== null && trx.blockNumber}</span>
                        </li>
                        <li className="d-flex align-items-center justify-content-between pb-8 line-bt">
                          <span className="text-small">_id</span>
                          <span style={{ color: '#25C866' }} className="text-large">{trx.id !== null && trx.id}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="tab-content  pb-16">
                    <div className="tab-pane fade active show" id="link" role="tabpanel">
                      <ul className="mt-10 accent-box line-border">
                        <h3 className='text-primary'>Activation History!</h3><hr />
                        <li className="trade-list-item">
                          <p className="d-flex align-items-center text-small gap-4">Reference <i className="icon-question fs-16 text-secondary"></i> </p>
                          <p className="d-flex gap-8 text-white">{trx.contractPrice !== null && trx.contractPrice} ETH = {trx.contractPrice !== null && convertedPrice.toFixed(2)} USDC <i className="icon-clockwise2 fs-16"></i></p>
                        </li>
                        <li className="trade-list-item mt-16">
                          <p className="d-flex align-items-center text-small gap-4">Estimated contract changes</p>
                          {trx.gas_used !== null ? <p className="d-flex gap-8 text-white">{trx.gas_used !== null && trx.gas_used} (1 Minute)</p> : <p className="d-flex gap-8 text-white">loading... (1 Minute)</p>}
                        </li>
                        <li className="trade-list-item mt-3">
                          {trx.from && trx.to !== '' ? <p className="d-flex gap-4 text-white">_from <span className='text-primarys'>{trx.from !== '' && trx.from.slice(0, 16)} </span> _to <span className='text-primary'>{trx.to !== '' && trx.to.slice(0, 16)}</span><i className="icon-clockwise2 fs-16"></i></p> : <p className="d-flex gap-2 text-white">_from <span className='text-primary'> loading... </span> =_to<span className='text-primary'> loading...</span> <i className="icon-clockwise2 fs-16"></i></p>}
                        </li>
                        <li className="trade-list-item mt-16">
                          <p className="d-flex align-items-center text-small gap-4">X Routing <i className="icon-question fs-16 text-secondary"></i> </p>
                          <a href="#" className="d-flex gap-4 align-items-center">
                            <img src="/src/images/coin/coin-3.jpg" alt="img" className="img" />
                            <i className="icon-select-right"></i>
                            <img src="/src/images/coin/coin-5.jpg" alt="img" className="img" />
                            <i className="icon-arr-right fs-8"></i>
                          </a>
                        </li>
                        <FadeLoader
                          color="#36d7b7"
                          loading={loading}
                          speedMultiplier={3}
                          style={{ textAlign: 'center', position: 'relative', marginLeft: '50%' }}
                        />
                        <li className="trade-list-item mt-16">
                          {trx.status == 'Paused' ? <p className="d-flex align-items-center text-small gap-4">Status<i className="icon-clock fs-16 text-warning"></i> </p> : <p className="d-flex align-items-center text-small gap-4">Status<i className="icon-check fs-16 text-primary"></i> </p>}
                          {trx.status == 'Paused' ? <span className='text-warning'>Paused</span> : <span className='text-success'>Contract {trx.status}!</span>}
                        </li>
                        <a className="tf-btn lg mt-20 primary" data-bs-toggle="modal" data-bs-target="#pause">Pause & Withdraw</a>
                      </ul>
                    </div>
                    <div className="tab-pane fade" id="order" role="tabpanel">
                      <div className="trade-box">
                        <div className="accent-box bg-menuDark">
                          <p className="text-small text-white">Pay</p>
                          <div className="coin-item style-1 gap-8 mt-20">
                            <img src="/src/images/coin/coin-6.jpg" alt="img" className="img" />
                            <div className="content">
                              <div className="title">
                                <h3 className="mb-4"><a href="#" className="d-flex align-items-center">ETH&nbsp;<i className="icon-select-down"></i></a></h3>
                                <span>Ethereum</span>
                              </div>
                              <div className="box-price text-end">
                                <h3 className="mb-4">{trx.contractPrice !== null && trx.contractPrice}</h3>
                                <span>${trx_rate * trx.contractPrice !== null && trx_rate * trx.contractPrice}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
    
                </div>
                <div className="mt-16 footer-fixed-v2" data-bs-toggle="modal" data-bs-target="#detailChart">
                  <a href="#" className="trade-money-box">
                    <p>ETH/USDC</p>
                    <p className="d-flex align-items-center gap-8">
                      <span>{usd_details.eth_price !== '' && usd_details.eth_price}</span>
                      {usd_details.eth_last_change !== '' && usd_details.eth_last_change ? <span className="text-red">{usd_details.eth_last_change}</span> : <span className="text-red">loading...</span>}
                      <i className="icon-arr-right fs-12"></i>
                    </p>
                  </a>
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
                <li className="active">
                  <a href="/Exchange">
                    <i className="icon icon-exchange"></i>
                    Exchange
                  </a>
                </li>
                <li>
                  <a href="/Earn">
                    <i className="icon icon-earn2"></i>
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
    
            {/* <!-- modal pause Contract --> */}
            <div className="modal fade modalCenter" id="pause">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content modal-sm">
                  <div className="p-16 line-bt">
                    <h4 className="text-center">Pause Contract.</h4>
                    <p className="mt-12 text-center text-large">Are you sure you want to pause this contract?</p>
                  </div>
                  <div className="grid-2">
                    <a href="#" className="line-r text-center text-button fw-6 p-10" data-bs-dismiss="modal">Cancel</a>
                    <a href='/withdarawContractTwo' className="text-center text-button fw-6 p-10 text-red">Pause</a>
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
                      <h3 className="d-flex align-items-center gap-8">ETH/USDC <i className="icon-clockwise2 fs-16 text-secondary"></i></h3>
                      <h2 className="mt-4">${usd_details.eth_price !== null && usd_details.eth_price.toFixed(2)}</h2>
                      {usd_details.eth_last_change !== null && usd_details.eth_last_change > 1 ? <p className="mt-4"><a className="text-primary">{usd_details.eth_last_change}</a>&emsp;Last 24 hours</p> : <p className="mt-4"><a className="text-red">{usd_details.eth_last_change}</a>&emsp;Last 24 hours</p>}
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
                              <p className="text-small">ETH <span className="text-extra-small text-secondary">/ Ethereum</span></p>
                              <span className="d-inline-block mt-8 coin-btn decrease">+1,62%</span>
                            </div>
                            <span className="icon-arr-right fs-12"></span>
                          </a>
                        </li>
                        <li className="flex-1">
                          <a href="#" className="accent-box-v6 bg-surface d-flex justify-content-between align-items-center">
                            <div className="content">
                              <p className="text-small">USDC </p>
                              <span className="d-inline-block mt-8 coin-btn increase">+1,62%</span>
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
          </div>
        </>
      )
}

export default ContractTwoProfile
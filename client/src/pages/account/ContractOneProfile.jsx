import axios from 'axios';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { useState, useEffect } from "react";
import FadeLoader from 'react-spinners/FadeLoader';

import coin3 from "../../images/coin/coin3.jpg";
import coin5 from "../../images/coin/coin5.jpg";
import coin6 from "../../images/coin/coin6.jpg";

const ContractOneProfile = () => {

const [signer, setSigner] = useState(null);
const [pinError, setPinError] = useState('');
const [Address, setAddress] = useState(null);
const [loading, setLoading] = useState(false);
const [showModal, setShowModal] = useState('');
const [trx_rate, set_trx_rate] = useState(null);
const [checkPin, setCheckPin] = useState(false);
const [pinInput, setPinInput] = useState({ pin1: '', pin2: '', pin3: '', pin4: '' });
const [usd_details, setUsdDetails] = useState({ eth_price: 0, eth_last_change: '' });
const [trx, setTrx] = useState({ from: '', to: '', contractPrice: null, ContractProfit: null, status: '', id: null, blockNumber: null, priceInUsd: null });
if (!localStorage.getItem('email')) { location.href = '/login'; }

const priceEth = trx.contractPrice;
const CONTRACT_PROFIT = trx.ContractProfit;
const convertedPrice = trx_rate * trx.contractPrice;
const convertedProfit = trx_rate * trx.ContractProfit;

useEffect(() => {
setLoading(true);
//////////////''''''''//////////METAMASK CONNECTOR/////////
const connect = async () => {
if (typeof (window.ethereum !== "Undefined")) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  setSigner(signer);
} else {
  toast.error("METAMASK IS NOT DETECTED")
  console.log("METAMASK IS NOT DETECTED")
}
}
connect();


//////////////''''''''//////////TOKEN FETCHER////////////
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

const pinCheck = async () => {
const email = localStorage.getItem('email');
const { data } = await axios.post('/pinCheck', { email });
if (data.exists == true) {
  setCheckPin(true);
}
}
pinCheck();

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

  const getCoontractOne = async () => {
    const email = localStorage.getItem('email');
    try {
      const { data } = await axios.post('/getContractOne', { email });
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
  getCoontractOne();

} else {
  setLoading(false);
  toast.error('Non-Ethereum browser detected. Consider trying MetaMask!')
  console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
}
} catch (error) {
toast.error("Error fetching API refresh App");
console.log(error);
}
}, [])

//CREATE PIN
const createPin = async (e) => {
e.preventDefault();
const email = localStorage.getItem('email');
const { pin1, pin2, pin3, pin4 } = pinInput;

const { data } = await axios.post('/createPin', {
pin1, pin2, pin3, pin4, email
})

if (data.error) {
setPinError('All PIN field is required')
} else {
setPinError('')
setCheckPin(true);
toast.success(data.success);
setPinInput({ ...pinInput, pin1: '', pin2: '', pin3: '', pin4: '' });
}

}

//TRX
const withdrawFunction = async (e) => {
e.preventDefault();
setLoading(true);
const email = localStorage.getItem('email');
if (convertedProfit < 3) {
toast.error("Isuficient Profit Balance");
setLoading(false);
} else {
if (Address !== '') {
  if (trx.status == 'Paused') {
    toast.error('Transaction Failed contract De-activated');
    setAddress('');
    setShowModal('modal');
    setLoading(false);
    setPinInput({ ...pinInput, pin1: '', pin2: '', pin3: '', pin4: '' });
  } else {
    const { pin1, pin2, pin3, pin4 } = pinInput;
    const { data } = await axios.post('/pinVerify', {
      pin1, pin2, pin3, pin4, email
    });
    if (data.success) {
      const DEPLOYED_ADDRESS = '0xEeD4d31F9b81d550A370f2cddAef7763698ef32a';
      const CONTRACT_ABI = [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "string",
              "name": "messages",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "gas",
              "type": "uint256"
            }
          ],
          "name": "Log",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "Received",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "recieveEther",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address payable",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "sendEther",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "stateMutability": "payable",
          "type": "fallback"
        },
        {
          "stateMutability": "payable",
          "type": "receive"
        },
        {
          "inputs": [],
          "name": "Address",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getBalance",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
      const connectContract = new ethers.Contract(DEPLOYED_ADDRESS, CONTRACT_ABI, signer);
      const tx_response = await connectContract.sendEther(
        Address,
        ethers.utils.parseEther(CONTRACT_PROFIT.toString())
      )
      const receipt = await tx_response.wait();
      if (receipt) {
        setLoading(false);
        const to = receipt.to
        const from = receipt.from;
        const name = 'Contract Profit'
        const status = 'Success'
        const amount = CONTRACT_PROFIT;
        const contractProfit = convertedPrice
        const contractPrice = convertedPrice
        const gasFee = trx_rate * ethers.utils.formatEther(receipt.effectiveGasPrice);
        const blockNumber = receipt.blockNumber;
        const blockHash = receipt.blockHash;
        const transactionHash = receipt.transactionHash;

        const { data } = await axios.post('/getProfitOne', { email, amount });
        if (data.success) {
          const { data } = await axios.post('/setContractOneLogs', {
            name,
            email,
            amount,
            to,
            from,
            blockNumber,
            transactionHash,
            status,
            blockHash,
            gasFee,
            contractProfit,
            contractPrice,
            priceEth
          })
          const logsData = data;
          if (logsData.success) {
            const For = "ForContractProfitWithdraw";
            const { data } = await axios.post('/notification', {
              For,
              email,
            })
            if (data.success) {
              setPinInput({ ...pinInput, pin1: '', pin2: '', pin3: '', pin4: '' });
              toast.success('Ethers Sent successfuly');
              setAddress('');
              setLoading(false);
              setShowModal('modal')
            } else {
              console.log('Error Pause and Withdrawing Contract');
            }

          } else {
            console.log(`Upadating Contract One Error: ${data.error}`)
          }
        } else {
          toast.error('Transaction Error');
        }
      } else {
        setLoading(false);
        toast.error('Transaction Fail!');
        setLoading(false);
      }
    } else if (data.error) {
      toast.error(data.error);
      setLoading(false);
      console.log(data)
    }
  }
} else {
  toast.error("Please Insert a valid ERC20 address");
  setLoading(false)
}
}
}
const Reload = async ()=>{
window.location.reload(false);
}

  return (
<>
<div className="app-wallet">
  <div className="header-style2 fixed-top d-flex align-items-center justify-content-between bg-surface">
    <h3 className="d-flex gap-12">
      <span style={{ color: '#25C866' }}>Profile One+</span>
    </h3>
    <i onClick={Reload} style={{fontSize:"20px", cursor: "pointer"}} className="icon-clockwise2 text-white"></i>
  </div>
  <div className="pt-40 pb-120">
    <div className="tf-container">
      <div className="tf-tab pt-12 mt-4">
        <div className="pt-55">
          <div className="tf-container bg-transparent">
            <h1 className="mt-8 text-center">${trx.contractPrice !== null && convertedPrice.toFixed(2)}</h1>
            <ul className="mt-12 accent-box-v4 bg-menuDark">

              <li className="d-flex align-items-center justify-content-between pt-8">
                <span className="text-small">Estimated contract changes</span>
                <h3 className="text-button text-white fw-6 text-end">${convertedProfit !== null && convertedProfit.toFixed(2)}</h3>
              </li>
              <span data-bs-toggle="modal" data-bs-target="#getProfit" style={{ marginTop: "-200px", borderRadius: "0", cursor: "pointer", borderBottomRightRadius: "6px", borderBottomLeftRadius: "6px" }} className="text-small text-light coin-btn increase">Get Profit</span>
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
        <FadeLoader
                color="#36d7b7"
                loading={loading}
                speedMultiplier={3}
                style={{ textAlign: 'center', position: 'relative', marginLeft: '50%' }}
              />
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
                  <img src={coin3} alt="img" className="img" />
                  <i className="icon-select-right"></i>
                  <img src={coin5} alt="img" className="img" />
                  <i className="icon-arr-right fs-8"></i>
                </a>
              </li>
              <li className="trade-list-item mt-16">
                {trx.status == 'Paused' ? <p className="d-flex align-items-center text-small gap-4">Status<i className="icon-clock fs-16 text-warning"></i> </p> : <p className="d-flex align-items-center text-small gap-4">Status<i className="icon-check fs-16 text-primary"></i> </p>}
                {trx.status == 'Paused' ? <span className='text-warning'>Paused</span> : <span className='text-success'>Contract {trx.status}!</span>}
              </li>
              <a className="tf-btn lg mt-20 primary" data-bs-toggle="modal" data-bs-target="#pause">Pause Contract</a>
            </ul>
          </div>
          <div className="tab-pane fade" id="order" role="tabpanel">
            <div className="trade-box">
              <div className="accent-box bg-menuDark">
                <p className="text-small text-white">Pay</p>
                <div className="coin-item style-1 gap-8 mt-20">
                  <img src={coin6} alt="img" className="img" />
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

  {/* <!-- filter otp --> */}
  <div className="modal fade action-sheet sheet-down" data-bs-dismiss={showModal} id="otpPin">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="header d-flex justify-content-center align-items-center">
          <span className="left icon-cancel" data-bs-dismiss="modal"></span>
          {checkPin == true ? <h3>Enter your pin</h3> : <h3>Create your PIN</h3>}
        </div>
        <div className="modal-body">
          <form>
            <div className="digit-group">
              <input value={pinInput.pin1} onChange={(e) => setPinInput({ ...pinInput, pin1: e.target.value })} required type="text" id="digit-2" data-next="digit-3" data-previous="digit-1" />
              <input value={pinInput.pin2} onChange={(e) => setPinInput({ ...pinInput, pin2: e.target.value })} required type="text" id="digit-3" data-next="digit-4" data-previous="digit-2" />
              <input value={pinInput.pin3} onChange={(e) => setPinInput({ ...pinInput, pin3: e.target.value })} required type="text" id="digit-4" data-next="digit-5" data-previous="digit-3" />
              <input value={pinInput.pin4} onChange={(e) => setPinInput({ ...pinInput, pin4: e.target.value })} required type="text" id="digit-5" data-next="digit-6" data-previous="digit-4" />
            </div>
            <p className='text-danger text-center text-small mt-1'>{pinError !== '' && pinError}</p>
            {checkPin == true ? <p className="text-center text-small text-white mt-16">Enter  your PIN to proceed</p> : <p className="text-center text-small text-white mt-16">This PIN will be used In every transaction</p>}
            {checkPin == true ? <button type='submit' onClick={withdrawFunction} className="mt-40 tf-btn lg primary" >Confirm</button> : <button type='submit' onClick={createPin} className="mt-40 tf-btn lg primary" >Create PIN</button>}
          </form>
        </div>
      </div>

    </div>
  </div>

  {/* <!-- getProfit Modal --> */}
  <div className="modal fade action-sheet sheet-down" id="getProfit">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="header d-flex justify-content-center align-items-center">
          <span className="left icon-cancel" data-bs-dismiss="modal"></span>
        </div>
        <div className="modal-body">
          <h5>Withdraw ETH(ERC20)</h5>
          <div className="mt-16 d-flex justify-content-between">
            <span>I want to Withdraw <span className='text-success'>Profit</span></span>
            <h5>${convertedProfit !== null && convertedProfit.toFixed(2)}</h5>
          </div>
          <input
            type="text"
            value={Address}
            required
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Please an ERC20 Address" />
          <ul className="mt-8 d-flex gap-8">
            <li>
              <a href="#" className="tag-sm dark">25%</a>
            </li>
            <li>
              <a href="#" className="tag-sm dark">50%</a>
            </li>
            <li>
              <a href="#" className="tag-sm dark">75%</a>
            </li>
            <li>
              <a href="#" className="tag-sm dark">100%</a>
            </li>
          </ul>
          <button type='submit' data-bs-toggle="modal" data-bs-target="#otpPin" className="mt-40 tf-btn lg primary" >Confirm</button>
        </div>
      </div>

    </div>
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
          <a href='/withdarawContractOne' className="text-center text-button fw-6 p-10 text-red">Pause</a>
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

export default ContractOneProfile
import axios from 'axios';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { useState, useEffect } from "react";
import FadeLoader from 'react-spinners/FadeLoader';

import coin3 from "../../images/coin/coin3.jpg";
import coin5 from "../../images/coin/coin5.jpg";

const Send = () => {
const [errMessage, setErrMessage] = useState('')
const [showModal, setShowModal] = useState('')
const [provider, setProvider] = useState(null);
const [signer, setSigner] = useState(null);
const [loading, setLoading] = useState(false);
const [trx_rate, set_trx_rate] = useState(null);
const [pinError, setPinError] = useState('')
const [checkPin, setCheckPin] = useState(false);
const [userAddress, setUserAddress] = useState('');
const [valueSend, setValueSend] = useState('');
const [balanceEth, setBalanceEth] = useState(null);
const [balanceUsd, setBalanceUsd] = useState(null);
const [usd_details, setUsdDetails] = useState({ eth_price: 0, eth_last_change: '' });
const [pinInput, setPinInput] = useState({ pin1: '', pin2: '', pin3: '', pin4: '' });
if (!localStorage.getItem('email')) { location.href = '/login'; }
const [trxH, setTrxH] = useState({
to: '',
from: '',
status: '',
value: null,
blockNumber: '',
transactionHash: ''
})

useEffect(() => {
setLoading(true);

//''''''''//////////TOKEN FETCHER////////////''''''''//
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

if (typeof(window.ethereum)) {
    const data = JSON.parse(localStorage.getItem('tokens'));
    setUsdDetails({
        eth_price: data[1].current_price,
        eth_last_change: data[1].price_change_percentage_24h
    })
    const USD_PRICE = data[1].current_price;
    set_trx_rate(USD_PRICE);
    setLoading(false);

    const Connect = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const USER_ADDRESS = signer.getAddress();
        const GET_BALANCE = await provider.getBalance(USER_ADDRESS);
        const FORMATED_BALANCE = ethers.utils.formatEther(GET_BALANCE);

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

        const contractAddr = await connectContract.Address();
        const CONTRACT_BALANCE = await connectContract.getBalance();
        const Balance = ethers.utils.formatEther(CONTRACT_BALANCE)
        setSigner(signer);
        setBalanceEth(FORMATED_BALANCE);
        setLoading(false)
    }
    Connect();

} else {
    toast.error('Non-Ethereum browser detected. Consider trying MetaMask!')
    console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
}

}, [])

//COPY FROM FUNCTION
const copyFrom = async () => {
try {
    await navigator.clipboard.writeText(trxH.from);
    toast.success('Address Copied!');
} catch (error) {
    console.log(error);
    toast.error('Fail to Copy!');
}
}

//COPY TO FUNCTION
const copyTo = async () => {
    try {
        await navigator.clipboard.writeText(trxH.to);
        toast.success('Address Copied!');
    } catch (error) {
        console.log(error);
        toast.error("Failed to copy!")
    }
}

const copyTrxHash = async () => {
    try {
        await navigator.clipboard.writeText(trxH.transactionHash);
        toast.success('Copied!');
    } catch (error) {
        console.log(error);
        toast.error("Failed to copy!")
    }
}

//TRX
const SendEther = async (e) => {
    const email = localStorage.getItem('email');
    setLoading(true);
    e.preventDefault();
    if (userAddress !== '') {
        if (valueSend == '') {
            toast.error('Enter Value to Send')
        } else {
            const { pin1, pin2, pin3, pin4 } = pinInput;
            const { data } = await axios.post('/pinVerify', {
                pin1, pin2, pin3, pin4, email
            });
            if (data.success) {
                if (typeof window.ethereum !== 'undefined') {
                    const amountInWei = ethers.utils.parseEther(valueSend);
                    const transactionResponse = await signer.sendTransaction({
                        to: userAddress,
                        value: amountInWei,
                    });
                    const receipt = await transactionResponse.wait();
                    if (receipt) {
                        console.log(receipt);
                        setLoading(false);
                        const to = receipt.to
                        const from = receipt.from;
                        const status = 'Success'
                        const amount = trx_rate * valueSend;
                        const blockNumber = receipt.blockNumber;
                        const transactionHash = receipt.transactionHash;

                        const For = 'sendSuccess';
                        const { data } = await axios.post('/notification', { email, For, valueSend, amount });
                        if (data.success) {
                            setTrxH({
                                to: to,
                                from: from,
                                status: status,
                                value: amount,
                                blockNumber: blockNumber,
                                transactionHash: transactionHash
                            })
                            toast.success('Ethers Sent successfuly');
                            setLoading(false);
                            setShowModal('modal')
                            setUserAddress('');
                            setValueSend('');
                            setPinInput({ ...pinInput, pin1: '', pin2: '', pin3: '', pin4: '' });
                        } else {
                            console.log(data.error)
                        }

                    } else {
                        setLoading(false);
                        toast.error('Transaction Fail!');
                        setLoading(false);
                    }
                } else {
                    toast.error('Non-Ethereum browser detected. Consider trying MetaMask!')
                    console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
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

//MAX Balance Formating
const Max = async () => {
    if (balanceEth !== '') {
        const usdBalance = trx_rate * balanceEth;
        setValueSend(balanceEth);
        setBalanceUsd(usdBalance.toFixed(2));
        toast.success('Balance Added Successfuly!')
    } else {
        toast.error('Balance not Available')
    }
}

const sendFunction = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setValueSend(value)
    if (balanceEth >= value) {
        setErrMessage('');
        const usdBalance = trx_rate * value;
        setValueSend(balanceEth);
        setBalanceUsd(usdBalance.toFixed(2));
        setValueSend(value);

    } else {
        setErrMessage('Value Enterd is Greater than Main Balance');
        setValueSend(value)
    }
}

    return (
<>
<div class="header fixed-top bg-surface d-flex justify-content-between align-items-center">
    <a href="javascript:void(0);" class="left back-btn"><i class="icon-left-btn"></i></a>
    <a href="/home" class="right"><i class="icon-home2 fs-20"></i></a>
</div>
<div class="pt-45 pb-16">
    <div class="tf-container">
        <div class="mt-4 coin-item style-2 gap-8">
            <img src={coin3} alt="img" class="img" />
            <h5>Send ETH(ERC20)</h5>
        </div>
        <div class="mt-16 d-flex justify-content-between">
            <span>My Balance</span>
            <h5>ETH {balanceEth}</h5>
        </div>
        <p className='text-red'>{errMessage !== '' && errMessage}</p>
        <div class="mt-8 group-ip-select">
            <input
                type="text"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                placeholder="Please an ERC20 Address" />
            <div class="select-wrapper">
                <select class="tf-select">
                    <option value="">ETH</option>
                    <option value="">BTC</option>
                </select>
            </div>
        </div>
        <div class="mt-8 group-ip-select">
            <input
                type="number"
                value={valueSend}
                onChange={sendFunction}
                placeholder="Enter Value to Send" />
            <div style={{ marginTop: '4%', marginLeft: '3%' }} class="wrapper">
                <span onClick={Max} className='text-primary ' style={{ fontSize: '17px', cursor: 'pointer' }}>MAX</span>
            </div>
        </div>
        <ul class="mt-8 d-flex gap-8">
            <li>
                {balanceUsd !== null ? <a href="#" class="tag-sm dark p-2" style={{ fontSize: '17px' }}>${balanceUsd}</a> : <a href="#" class="tag-sm dark p-2" style={{ fontSize: '17px' }}>$0.00</a>}
            </li>
        </ul>
        <i><a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#otpPin" class="tf-btn lg primary mt-10">Send</a></i>
        <div className="tab-pane fade active show" id="link" role="tabpanel">
            <ul className="mt-10 accent-box line-border">
                <h5 className='text-primary'>Reference!</h5><hr />
                <li className="d-flex align-items-center justify-content-between">
                    <span className="text-small">ValueUSD</span>
                    {trxH.value !== null ? <span className="text-large text-white increase text-end">${trxH.value && trxH.value.toFixed(2)}</span> : <span className="text-large text-white increase text-end">loading...</span>}
                </li><hr />
                <FadeLoader
                    color="#36d7b7"
                    loading={loading}
                    speedMultiplier={3}
                    style={{ textAlign: 'center', position: 'relative', marginLeft: '50%' }}
                />
                <li className="trade-list-item ">
                    {trxH.from !== '' ? <p className="d-flex gap-4 text-white">_from <span className='text-primarys'>{trxH.from.slice(0, 30)}...</span> <i onClick={copyFrom} style={{ cursor: 'pointer' }} className="icon-copy active fs-3"></i></p> : <p className="d-flex gap-2 text-white">_from <span className='text-primary'> loading... </span> <i className="icon-clockwise2 fs-16"></i></p>}
                </li><hr />
                <li className="trade-list-item mt-2">
                    {trxH.to !== '' ? <p className="d-flex gap-4 text-white"> _to <span className='text-primary'>{trxH.to.slice(0, 30)}...</span><i onClick={copyTo} style={{ cursor: 'pointer' }} className="icon-copy fs-3"></i></p> : <p className="d-flex gap-2 text-white">_to <span className='text-primary'> loading... </span> <i className="icon-clockwise2 fs-16"></i></p>}
                </li><hr />
                <li className="trade-list-item mt-16">
                    <p className="d-flex align-items-center text-small gap-4">X Routing <i className="icon-question fs-16 text-secondary"></i> </p>
                    <a href="#" className="d-flex gap-4 align-items-center">
                        <img src={coin3} alt="img" className="img" />
                        <i className="icon-select-right"></i>
                        <img src={coin5} alt="img" className="img" />
                        <i className="icon-arr-right fs-8"></i>
                    </a>
                </li><hr />
                <li className="trade-list-item mt-16">
                    {trxH.status == '' ? <p className="d-flex align-items-center text-small gap-4">Status<i className="icon-clock fs-16 text-warning"></i> </p> : <p className="d-flex align-items-center text-small gap-4">Status<i className="icon-check fs-16 text-primary"></i> </p>}
                    {trxH.status == '' ? <span className='text-warning'>Loading..</span> : <span className='text-success'>{trxH.status}</span>}
                </li><hr />
                <li className="d-flex align-items-center justify-content-between">
                    <span className="text-small">BlockNumber</span>
                    {trxH.blockNumber !== '' ? <span className="text-large text-white increase text-end">{trxH.blockNumber}</span> : <span className="text-large text-white increase text-end">loading...</span>}
                </li><hr />
                <li className="trade-list-item mt-2">
                    {trxH.transactionHash !== '' ? <p className="d-flex gap-4 text-white">transactionHash <span className='text-primary'>{trxH.transactionHash.slice(0, 25)}...</span><i onClick={copyTrxHash} style={{ cursor: 'pointer' }} className="icon-copy fs-3"></i></p> : <p className="d-flex gap-2 text-white">transactionHash <span className='text-primary'> loading... </span> <i className="icon-clockwise2 fs-16"></i></p>}
                </li><hr />
            </ul>
        </div>
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
                        {checkPin == true ? <button type='submit' onClick={SendEther} className="mt-40 tf-btn lg primary" >Confirm</button> : <button type='submit' onClick={createPin} className="mt-40 tf-btn lg primary" >Create PIN</button>}
                    </form>
                </div>
            </div>

        </div>
    </div>

</div>
</>
    )
}

export default Send
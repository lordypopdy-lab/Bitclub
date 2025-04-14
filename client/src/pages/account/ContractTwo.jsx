import axios from 'axios';
import { ethers } from 'ethers';
import { useContext } from 'react';
import toast from 'react-hot-toast';
import { useState, useEffect } from "react";
import FadeLoader from 'react-spinners/FadeLoader';
import { UserContext } from '../../../context/UserContext';

import coin3 from "../../images/coin/coin3.jpg";
import coin5 from "../../images/coin/coin5.jpg";
import coin6 from "../../images/coin/coin6.jpg";

const ContractTwo = () => {
if (!localStorage.getItem('email')) { location.href = '/login'; }
    
const { user } = useContext(UserContext);
const [status, setStatus] = useState('');
const [signer, setSigner] = useState(null);
const [pinError, setPinError] = useState('');
const [loading, setLoading] = useState(false);
const [connect, setConnect] = useState(false);
const [showModal, setShowModal] = useState('');
const [checkPin, setCheckPin] = useState(false);
const [trx_rate, set_trx_rate] = useState(null);
const [current_bal, setCurrent_bal] = useState(null);
const [priceInUsdc, setPriceInUsdc] = useState(null);
const [walletBalance, setWalletBalance] = useState(null);
const [contractPrice, setContractPrice] = useState(null);
const [pinInput, setPinInput] = useState({
pin1: '',
pin2: '',
pin3: '',
pin4: ''
})
const [trx, setTrx] = useState({
from: '',
to: '',
gas_used: null,
cumulative_gas_used: null,
cumulative_gas_price: null,
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
    const data = JSON.parse(localStorage.getItem('tokens'));
    //////////////''''''''//////////USE_EFFECT WALLET CONNECTION////////////''''''''//////////////
    if (window.ethereum) {
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

            setWalletBalance(FORMATED_BALANCE);

            //CONTRACT PRICE
            const CONTRACT_PRICE = 0.01485869899;
            setContractPrice(CONTRACT_PRICE);
        }
        Connect();

        const getCoontractOne = async () => {
            const email = localStorage.getItem('email');
            try {
                const { data } = await axios.post('/api/getContractTwo', { email });
                if (data.success) {
                    setTrx({
                        to: data.contractOne.to,
                        from: data.contractOne.from,
                        gas_used: data.contractOne.gasFee
                    })
                    setStatus(data.contractOne.status);
                } else {
                    setStatus(false);
                    setLoading(false);
                    console.log(`Contract is yet to Activated!: ${error}`)
                }
            } catch (error) {
                setLoading(false);
                console.log(`Contract is yet to Activated!: ${error}`)
            }
        }
        getCoontractOne();

        const pinCheck = async () => {
            const email = localStorage.getItem('email');
            const { data } = await axios.post('pinCheck', { email });
            if (data.exists == true) {
                setCheckPin(true);
            }
        }
        pinCheck();
    } else {
        setLoading(false)
        toast.error('Non-Ethereum browser detected. Consider trying MetaMask!')
        console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
    }
} catch (error) {
    toast.error("Error fetching API refresh App");
    console.log(error);
}
}, [])
//////////////''''''''//////////MANUAL METAMASK CONNECTION////////////''''''''//////////////
const connectMetaMask = async () => {
setLoading(true);
try {
if (window.ethereum) {
const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send('eth_requestAccounts', []);
const signer = provider.getSigner();
const USER_ADDRESS = signer.getAddress();
const GET_BALANCE = await provider.getBalance(USER_ADDRESS);
const FORMATED_BALANCE = ethers.utils.formatEther(GET_BALANCE);

axios.get('/api/tokens').then(({ data }) => {
    if (data) {
        setUsdDetails({
            eth_price: data.tokens[1].current_price,
            eth_last_change: data.tokens[1].price_change_percentage_24h
        })
        setLoading(false);
        console.log(data);
    }
})

//CONTRACT PRICE
const CONTRACT_PRICE = 0.01485869899;

if (FORMATED_BALANCE >= CONTRACT_PRICE) {
    const rate = trx_rate * CONTRACT_PRICE;
    toast.success('Wallet Connected!')
    set_trx_rate(trx_rate);
    setPriceInUsdc(rate)
    setContractPrice(CONTRACT_PRICE);
    setConnect(true);
    setSigner(signer);
    setWalletBalance(FORMATED_BALANCE);
    setCurrent_bal(FORMATED_BALANCE - CONTRACT_PRICE);
    setLoading(false);
    console.log(rate);
    console.log(FORMATED_BALANCE);
} else {
    setContractPrice(-1);
    setLoading(false);
}
} else {
setLoading(false)
toast.error('Non-Ethereum browser detected. Consider trying MetaMask!')
console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
}
} catch (error) {
setLoading(false)
toast.error('User denied account access or error');
console.error('User denied account access or error', error);
}

}
//////////////''''''''//////////ONE CLICK METAMASK CONNECTION////////////''''''''//////////////
const maxBalance = async () => {
if (!connect) {
connectMetaMask();
setLoading(false);
}
}
const startContractTwo = async (e) => {
e.preventDefault();
const verificationStatus = !!user && user.verification;
if(verificationStatus == 'Unverified'){
toast.error('Unverified Account, Actication Failed!');
}else if(verificationStatus == 'Inreview'){
toast.error('Failed Activation, Account Verification request in review')
}else{
const email = localStorage.getItem('email');
const { pin1, pin2, pin3, pin4 } = pinInput;
const { data } = await axios.post('/api/pinVerify', {
pin1, pin2, pin3, pin4, email
});
if (data.success) {
setLoading(true);
const email = localStorage.getItem('email');
const { data } = await axios.post('/api/contractTwoCheck', { email });
if (data.status == false) {
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
    const tx_response = await connectContract.recieveEther({
        value: ethers.utils.parseEther(contractPrice.toString())
    })

    const receipt = await tx_response.wait();
    if (receipt) {
        const to = receipt.to
        const from = receipt.from;
        const name = 'ContractTwo'
        const status = 'Activated'
        const contractProfit = 0;
        const priceUsd = priceInUsdc;
        const gasFee = trx_rate * ethers.utils.formatEther(receipt.effectiveGasPrice);
        const cumulativeGasUsed = ethers.utils.formatEther(receipt.cumulativeGasUsed);
        const blockNumber = receipt.blockNumber;
        const blockHash = receipt.blockHash;
        const transactionHash = receipt.transactionHash;
        console.log(gasFee);
        const { data } = await axios.post('/api/contractTwo', {
            to,
            from,
            email,
            name,
            gasFee,
            status,
            contractPrice,
            contractProfit,
            cumulativeGasUsed,
            blockNumber,
            blockHash,
            transactionHash,
            priceUsd
        });

        if (data.success) {
            const For = "ForcontractActivation";
            const { data } = await axios.post('/api/notification', {
                For,
                email,
            })
            if(data.success){
                console.log(data);
                setTrx({
                    to: to,
                    from: from,
                    gas_used: gasFee,
                    cumulative_gas_used: cumulativeGasUsed,
                    cumulative_gas_price: gasFee
                })

                setStatus(status);
                toast.success('Ethers Sent successfuly');
                setLoading(false);
                setShowModal('modal')
                setPinInput({ ...pinInput, pin1: '', pin2: '', pin3: '', pin4: '' });   
            }else{
                console.log('Error sending notification');
            }
        } else if (data.error) {
            setShowModal('modal')
            toast.error(data.error);
            setLoading(false);
            console.log(data)
        }
    } else {
        toast.error('Transaction Fail!');
        setLoading(false);
    }


} else if (status == 'Paused') {
    const { pin1, pin2, pin3, pin4 } = pinInput;
    const { data } = await axios.post('/api/pinVerify', {
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
        const contractAddr = await connectContract.Address();
        const tx_response = await connectContract.recieveEther({
            value: ethers.utils.parseEther(contractPrice.toString())
        })

        const receipt = await tx_response.wait();

        if (receipt) {
            console.log(receipt)
            const to = receipt.to
            const from = receipt.from;
            const name = 'ContractTwo'
            const status = 'Activated'
            const contractProfit = 0;
            const priceUsd = priceInUsdc;
            const gasFee = trx_rate * ethers.utils.formatEther(receipt.effectiveGasPrice);
            const cumulativeGasUsed = ethers.utils.formatEther(receipt.cumulativeGasUsed);
            const blockNumber = receipt.blockNumber;
            const blockHash = receipt.blockHash;
            const transactionHash = receipt.transactionHash;

            const { data } = await axios.post('/api/reActivateContractTwo', {
                to,
                from,
                email,
                name,
                gasFee,
                status,
                contractPrice,
                contractProfit,
                cumulativeGasUsed,
                blockNumber,
                blockHash,
                transactionHash,
                priceUsd
            });
            if (data.success) {
                const For = "ForcontractActivation";
                const { data } = await axios.post('/api/notification', {
                    For,
                    email,
                })
                if(data.success){
                setStatus(status);
                toast.success('Ethers Sent successfuly');
                setLoading(false);
                setShowModal('modal')
                setPinInput({ ...pinInput, pin1: '', pin2: '', pin3: '', pin4: '' });
                }else{
                console.log("Error Sending Notification For Re-Activation")
                }
            } else {
                toast.error("An error has occured!")
            }
        }
    } else {
        toast.error(data.error);
        console.log(data.error);
    }
} else {
    setShowModal('modal')
    setLoading(false);
    toast.error('Contract has been activated already!')
    setPinInput({ ...pinInput, pin1: '', pin2: '', pin3: '', pin4: '' });
}
} else {
toast.error(data.error);
console.log(data.error);
}
}
}
const createPin = async (e) => {
e.preventDefault();
const email = localStorage.getItem('email');
const { pin1, pin2, pin3, pin4 } = pinInput;

const { data } = await axios.post('/api/createPin', {
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

    return (
<>
<div className="app-wallet">
<div className="header-style2 fixed-top d-flex align-items-center justify-content-between bg-surface">
<h3 className="d-flex gap-12">
    <span style={{ color: '#25C866' }}>Contract level Two+</span>
</h3>
<i className="icon-question text-white"></i>
</div>
<div className="pt-40 pb-120">
<div className="tf-container">
    <div className="tf-tab pt-12 mt-4">
        <div className="tab-slide trade-tab">
            <ul className="nav nav-tabs wallet-tabs" role="tablist" >
                <li className="item-slide-effect"></li>
                <li className="nav-item active" role="presentation">
                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#link">Connect & Start Contract</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#order">Limit order</button>
                </li>
            </ul>
        </div>
        <div className="tab-content pt-16 pb-16">
            <div className="tab-pane fade active show" id="link" role="tabpanel">
                <div className="trade-box">
                    <div className="accent-box bg-menuDark">
                        <div className="text-small d-flex justify-content-between">
                            <p className="text-white">Pay</p>
                            <p className="d-flex align-items-center gap-20">
                                <span className="d-flex align-items-center gap-4">
                                    <i className="icon-wallet fs-24"></i>
                                    {walletBalance == null ? 0.00 : walletBalance}
                                </span>
                                <span onClick={maxBalance} style={{ cursor: 'pointer' }} className="text-primary">Max</span>
                            </p>
                        </div>
                        <div className="coin-item style-1 gap-8 mt-20">
                            <img src={coin3} alt="img" className="img" />
                            <div className="content">
                                <div className="title">
                                    <h3 className="mb-4"><a href="#" className="d-flex align-items-center">ETH&nbsp;<i className="icon-select-down"></i></a></h3>
                                    <span>Ethereum</span>
                                </div>
                                <div className="box-price text-end">
                                    {walletBalance == 0 || contractPrice < 0 ? <span className=" mb-50 d-flex text-danger">Not enough ETH balance in wallet</span> : <h3 className="mb-4">{contractPrice}</h3>}
                                    <br />{priceInUsdc == null ? 0 : <span >${priceInUsdc.toFixed(2)}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="round-swap"><i className="icon icon-clockwise"></i></div>
                    <div className="accent-box bg-menuDark mt-8">
                        <div className="text-small d-flex justify-content-between">
                            <p className="text-white">Receive</p>
                            <span className="d-flex align-items-center gap-4">
                                <i className="icon-wallet fs-24"></i>
                                {current_bal}
                            </span>
                        </div>
                        <FadeLoader
                            color="#36d7b7"
                            loading={loading}
                            speedMultiplier={3}
                            style={{ textAlign: 'center', position: 'relative', marginLeft: '50%' }}
                        />
                        <div className="coin-item style-1 gap-8 mt-20">
                            <img src={coin5} alt="img" className="img" />
                            <div className="content">
                                <div className="title">
                                    <h3 className="mb-4"><a href="#" className="d-flex align-items-center">USDC&nbsp;<i className="icon-select-down"></i></a></h3>
                                    <span>Ethereum</span>
                                </div>
                                <div className="box-price text-end">
                                    <h3 className="mb-4">{priceInUsdc == null ? 0 : <span >${priceInUsdc.toFixed(2)}</span>}</h3>
                                    <p>${usd_details.eth_price} <span className="text-primary">({usd_details.eth_last_change})</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {connect == false ? <a href="javascript:void(0);" className="tf-btn lg mt-20 secondary" data-bs-toggle="modal" data-bs-target="#connectWallet">Connect Wallet</a> : <a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#otpPin" className="tf-btn lg mt-20 primary">Pay</a>}
                <ul className="mt-10 accent-box line-border">
                    <h3 className='text-primary'>Contract report</h3><hr />
                    <li className="trade-list-item">
                        <p className="d-flex align-items-center text-small gap-4">Reference <i className="icon-question fs-16 text-secondary"></i> </p>
                        <p className="d-flex gap-8 text-white">{contractPrice !== null && contractPrice.toFixed(5)} ETH = {priceInUsdc !== null && priceInUsdc.toFixed(2)} USDC <i className="icon-clockwise2 fs-16"></i></p>
                    </li>
                    <li className="trade-list-item mt-16">
                        <p className="d-flex align-items-center text-small gap-4">Estimated network charges</p>
                        {trx.gas_used !== null ? <p className="d-flex gap-8 text-white">${trx.gas_used !== null && trx.gas_used} (1 Minute)</p> : <p className="d-flex gap-8 text-white">loading... (1 Minute)</p>}
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
                        {status == 'Paused' ? <p className="d-flex align-items-center text-small gap-4">Status<i className="icon-clock fs-16 text-warning"></i> </p> : <p className="d-flex align-items-center text-small gap-4">Status{status == 'Activated' ? <i className="icon-check fs-16 text-primary"></i> : <i className="icon-clock fs-16 text-warning"></i>}</p>}
                        {status == 'Paused' ? <span className='text-warning'>{status !== '' && status}</span> : status == 'Activated' ? <span className='text-success'>Contract {status !== '' && status}!</span> : <span className='text-warning'>Pending...!</span>}
                    </li>
                    {trx.to !== '' ? <a href='/ContractTwoProfile' className="tf-btn lg mt-20 primary">Go to Contract</a> : ''}
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
                                    <h3 className="mb-4">{contractPrice !== null && contractPrice}</h3>
                                    <span>${priceInUsdc !== null && priceInUsdc.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="round-swap"><i className="icon icon-clockwise"></i></div>
                    <div className="accent-box bg-menuDark mt-8">
                        <p className="text-small text-white">Receive</p>
                        <div className="coin-item style-1 gap-8 mt-20">
                            <img src={coin5} alt="img" className="img" />
                            <div className="content">
                                <div className="title">
                                    <h3 className="mb-4"><a href="#" className="d-flex align-items-center">USDC&nbsp;<i className="icon-select-down"></i></a></h3>
                                    <span>Ethereum</span>
                                </div>
                                <div className="box-price text-end">
                                    <h3 className="mb-4">{priceInUsdc == null ? 0 : <span >${priceInUsdc.toFixed(2)}</span>}</h3>
                                    <p>${usd_details.eth_price} <span className="text-primary">({usd_details.eth_last_change})</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ul className="mt-4 accent-box bg-menuDark">
                    <li className="trade-list-item">
                        {usd_details.eth_last_change > 1 ? <p className="text-xsmall">ETH at exchange rate (<span className='text-primary'>{usd_details.eth_last_change}</span>)</p> : <p className="text-xsmall">ETH at exchange rate (<span className='text-danger'>{usd_details.eth_last_change}</span>)</p>}
                        <p className="text-xsmall text-primary">Use market price</p>
                    </li>
                    <li className="mt-16">
                        <div className="pb-4 line-bt d-flex justify-content-between">
                            <p className="text-button text-white">${trx_rate}</p>
                            <p className="d-flex align-items-center gap-8 text-white text-small">USDC <i className="icon-clockwise2 fs-12 text-secondary"></i></p>
                        </div>
                        <p className="mt-4 text-xsmall">Market: 1 ETH = {trx_rate} USDC</p>

                    </li>
                    <li className="mt-16">
                        <a href="#" className="trade-list-item" data-bs-toggle="modal" data-bs-target="#filterDay">
                            <span className="text-secondary">Due later</span>
                            <span className="text-white">1 Day <i className="icon-arr-right fs-8 text-secondary"></i></span>
                        </a>
                    </li>

                </ul>
                {walletBalance == 0 || contractPrice < 0 ? <a href="#" className="mt-20 tf-btn lg dark text-secondary">Not enough ETH balance in wallet</a> : <a href="#" className="mt-20 tf-btn lg dark text-secondary">ETH: {walletBalance !== null && walletBalance}</a>}
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
                {checkPin == true ? <button type='submit' onClick={startContractTwo} className="mt-40 tf-btn lg primary" >Confirm</button> : <button type='submit' onClick={createPin} className="mt-40 tf-btn lg primary" >Create PIN</button>}
            </form>
        </div>
    </div>

</div>
</div>


{/* <!-- connect wallet --> */}
<div className="modal fade action-sheet" id="connectWallet">
<div className="modal-dialog" role="document">
    <div className="modal-content">
        <div className="modal-header">
            <span className="icon-cancel" data-bs-dismiss="modal" aria-hidden="true"></span>
        </div>
        <div className="modal-body text-center">
            <span className="logo icon-wallet"></span>
            <h3 className="mt-4">Connect Wallet</h3>
            <p className="mt-12 text-white text-large">Please connect by entering an existing wallet or create a new one.</p>
            <div className="mt-32">
                <a href="javascript:void(0);" className="tf-btn sm secondary d-inline-flex" data-bs-toggle="modal" data-bs-target="#keyWallet">Select wallet</a>
                <a href="javascript:void(0);" className="mt-12 tf-btn sm dark d-inline-flex" data-bs-toggle="modal" data-bs-target="#keyWallet">Enter a wallet</a>
            </div>
        </div>
    </div>

</div>
</div>

{/* <!-- key wallet --> */}
<div className="modal fade action-sheet" id="keyWallet">
<div className="modal-dialog" role="document">
    <div className="modal-content">
        <div className="modal-header">
            <span>Select input method</span>
            <span className="icon-cancel" data-bs-dismiss="modal" aria-hidden="true"></span>
        </div>
        <div className="modal-body">
            <ul>
                <li className="accent-box-v3 bg-surface tf-list-item-v3" data-bs-toggle="modal" data-bs-target="#inflation">
                    <div className="content">
                        <h5><a href="#">MetaMask wallet</a></h5>
                        <p className="mt-8 text-small text">Connect with an existing wallet with your platform account.</p>
                    </div>
                    <img style={{ height: '50px', width: '50px', borderRadius: '10%' }} src="data:image/png;base64,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" alt="logo" srcset="" />

                </li>
                <li className="mt-8 accent-box-v3 bg-surface tf-list-item-v3" data-bs-toggle="modal" data-bs-target="#inflation">
                    <div className="content">
                        <h5><a href="#">Seed phrase</a></h5>
                        <p className="mt-8 text-small text">Create wallet using seed phrase</p>
                    </div>
                    <span className="icon icon-phrase"></span>
                </li>
                <li className="mt-8 accent-box-v3 bg-surface tf-list-item-v3" data-bs-toggle="modal" data-bs-target="#inflation">
                    <div className="content">
                        <h5><a href="#">Hardware wallet connection</a></h5>
                        <p className="mt-8 text-small text">Connect hardware wallet via bluetooth</p>
                    </div>
                    <span className="icon icon-bluetooth"></span>
                </li>
                <li className="mt-8 accent-box-v3 bg-surface tf-list-item-v3" data-bs-toggle="modal" data-bs-target="#inflation">
                    <div className="content">
                        <h5><a href="#">Private key</a></h5>
                        <p className="mt-8 text-small text">Paste or enter private key</p>
                    </div>
                    <span className="icon-key"></span>
                </li>
            </ul>
        </div>
    </div>

</div>
</div>

{/* <!-- custom --> */}
<div className="modal fade action-sheet" id="inflation">
<div className="modal-dialog" role="document">
    <div className="modal-content">
        <div className="modal-header">
            <span>inflation</span>
            <span className="icon-cancel" data-bs-dismiss="modal" aria-hidden="true"></span>
        </div>
        <div className="modal-body">
            <ul>
                <li className="accent-box-v3 bg-surface">
                    <h5><a href="#">Automatic (1%)</a></h5>
                    <p className="mt-8 text-small text">automatically set slippage for successful trading. The value set automatically changes in real time depending on the price.</p>
                </li>
                <li className="mt-8 accent-box-v3 bg-surface">
                    <h5><a href="#">Custom (Single String)</a></h5>
                    <p className="mt-8 text-small text">slippage rate affects the chances of a successful trade and the final price</p>
                </li>
            </ul>
            <a onClick={connectMetaMask} data-bs-dismiss="modal" className="mt-32 tf-btn sm primary">Confirm</a>
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

{/* <!-- modal filter day--> */}
<div className="modal fade action-sheet" id="filterDay">
<div className="modal-dialog" role="document">
    <div className="modal-content">
        <div className="modal-header">
            <span>Set a custom due date</span>
            <span className="icon-cancel" data-bs-dismiss="modal"></span>
        </div>
        <ul className="pb-12 line-bt">
            <li><div className="d-flex justify-content-between align-items-center gap-8 text-large item-check">10 minutes <i className="icon icon-check-circle"></i> </div></li>
            <li className="mt-4"><div className="d-flex  justify-content-between gap-8 text-large item-check">30 minutes <i className="icon icon-check-circle"></i></div></li>
            <li className="mt-4"><div className="d-flex  justify-content-between gap-8 text-large item-check">1 hour <i className="icon icon-check-circle"></i></div></li>
            <li className="mt-4"><div className="d-flex  justify-content-between gap-8 text-large item-check  active">1 day <i className="icon icon-check-circle"></i></div></li>
            <li className="mt-4"><div className="d-flex  justify-content-between gap-8 text-large item-check">3 day <i className="icon icon-check-circle"></i></div></li>
            <li className="mt-4"><div className="d-flex  justify-content-between gap-8 text-large item-check">7 day <i className="icon icon-check-circle"></i></div></li>
            <li className="mt-4"><div className="d-flex  justify-content-between gap-8 text-large item-check">1 month <i className="icon icon-check-circle"></i></div></li>
            <li className="mt-4"><div className="d-flex  justify-content-between gap-8 text-large item-check">3 month <i className="icon icon-check-circle"></i></div></li>
            <li className="mt-4"><div className="d-flex  justify-content-between gap-8 text-large item-check">Custom <i className="icon icon-check-circle"></i></div></li>
        </ul>
        <a href="javascript:void(0);" className="item-check text-center text-button fw-6" data-bs-dismiss="modal">Cancel</a>
    </div>
</div>
</div>
</div>
</>
    )
}

export default ContractTwo
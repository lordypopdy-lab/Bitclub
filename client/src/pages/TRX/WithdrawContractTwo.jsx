import axios from 'axios';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { useState, useEffect } from "react";
import coin3 from "../../images/coin/coin3.jpg";
import coin5 from "../../images/coin/coin5.jpg";
import FadeLoader from 'react-spinners/FadeLoader';

const WithdrawContractTwo = () => {
  
const [signer, setSigner] = useState(null);
const [pinError, setPinError] = useState('');
const [loading, setLoading] = useState(false);
const [showModal, setShowModal] = useState('');
const [trx_rate, set_trx_rate] = useState(null);
const [checkPin, setCheckPin] = useState(false);
const [userAddress, setUserAddress] = useState('');
const [usd_details, setUsdDetails] = useState({ eth_price: 0, eth_last_change: '' });
const [pinInput, setPinInput] = useState({ pin1: '', pin2: '', pin3: '', pin4: '' });
const [trx, setTrx] = useState({ from: '', to: '', contractPrice: null, ContractProfit: null, status: null, id: null, blockNumber: null, priceInUsd: null });
if (!localStorage.getItem('email')) { location.href = '/login'; }
useEffect(() => {
  setLoading(true);
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

      const getContractTwo = async () => {
        const email = localStorage.getItem('email');
        try {
          const { data } = await axios.post('/api/getContractTwo', { email });
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
      getContractTwo();

      const pinCheck = async () => {
        const email = localStorage.getItem('email');
        const { data } = await axios.post('pinCheck', { email });
        if (data.exists == true) {
          setCheckPin(true);
        }
      }
      pinCheck();

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
        const test = ethers.utils.formatEther(CONTRACT_BALANCE)
        console.log(`Contract Balance: $${trx_rate * test}`);
        console.log(`Contract Address: ${contractAddr}`);

        setSigner(signer);
      }
      Connect();

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
  
//COPY FROM FUNCTION
const copyFrom = async () => {
try {
  await navigator.clipboard.writeText(trx.from);
  toast.success('Address Copied!');
} catch (error) {
  console.log(error);
  toast.error('Fail to Copy!');
}
}
  
//COPY TO FUNCTION
const copyTo = async () => {
try {
  await navigator.clipboard.writeText(trx.to);
  toast.success('Address Copied!');
} catch (error) {
  console.log(error);
  toast.error("Failed to copy!")
}
}
  
//GET TOTAL WITHDRAWAL
const convertedPrice = trx_rate * trx.contractPrice;
const convertedProfit = trx_rate * trx.ContractProfit;
const addedBalance = convertedPrice + convertedProfit;
const priceEth = trx.contractPrice + trx.ContractProfit;
const CONTRACT_PRICE = trx.contractPrice + trx.ContractProfit;
  
//TRX
const withdrawlFunction = async (e) => {
const email = localStorage.getItem('email');
setLoading(true);
e.preventDefault();
if (userAddress !== '') {
  if (trx.status == 'Paused') {
    toast.error('Transaction Failed contract De-activated');
    setUserAddress('');
    setShowModal('modal');
    setLoading(false);
    setPinInput({ ...pinInput, pin1: '', pin2: '', pin3: '', pin4: '' });
  } else {
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
      const tx_response = await connectContract.sendEther(
        userAddress,
        ethers.utils.parseEther(CONTRACT_PRICE.toString())
      )
      const receipt = await tx_response.wait();
      if (receipt) {
        setLoading(false);
        const to = receipt.to
        const from = receipt.from;
        const name = 'ContractTwo'
        const status = 'Success'
        const amount = addedBalance;
        const contractProfit = convertedPrice
        const contractPrice = convertedPrice
        const gasFee = trx_rate * ethers.utils.formatEther(receipt.effectiveGasPrice);
        const blockNumber = receipt.blockNumber;
        const blockHash = receipt.blockHash;
        const transactionHash = receipt.transactionHash;

        const { data } = await axios.post('/api/pauseContractTwo', { email });
        if (data.success) {
          const { data } = await axios.post('/api/setContractTwoLogs', {
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
            const For = "ForContractPauseAndWithdraw";
            const { data } = await axios.post('/api/notification', {
              For,
              email,
            })
            if(data.success){
              setPinInput({ ...pinInput, pin1: '', pin2: '', pin3: '', pin4: '' });
              toast.success('Ethers Sent successfuly');
              setUserAddress('');
              setLoading(false);
              setShowModal('modal')
            }else{
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

//CREATE PIN
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
          <div class="header fixed-top bg-surface d-flex justify-content-between align-items-center">
            <a href="javascript:void(0);" class="left back-btn"><i class="icon-left-btn"></i></a>
            <a href="/home" class="right"><i class="icon-home2 fs-20"></i></a>
          </div>
          <div class="pt-45 pb-16">
            <div class="tf-container">
              <div class="mt-4 coin-item style-2 gap-8">
                <img src={coin3} alt="img" class="img" />
                <h5>Withdraw ETH(ERC20)</h5>
              </div>
              <div class="mt-16 d-flex justify-content-between">
                <span>I want to pay</span>
                <h5>${addedBalance !== null && addedBalance.toFixed(2)}</h5>
              </div>
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
              <ul class="mt-8 d-flex gap-8">
                <li>
                  <a href="#" class="tag-sm dark">25%</a>
                </li>
                <li>
                  <a href="#" class="tag-sm dark">50%</a>
                </li>
                <li>
                  <a href="#" class="tag-sm dark">75%</a>
                </li>
                <li>
                  <a href="#" class="tag-sm dark">100%</a>
                </li>
              </ul>
              <p class="mt-8 text-primary">${convertedPrice !== null && convertedPrice.toFixed(2)}+{convertedProfit !== null && convertedProfit.toFixed(2)} USD</p>
              <i><a href="javascript:void(0);" data-bs-toggle="modal" data-bs-target="#otpPin" class="tf-btn lg primary mt-10">Send</a></i>
              <div className="tab-pane fade active show" id="link" role="tabpanel">
                <ul className="mt-10 accent-box line-border">
                  <h5 className='text-primary'>Activation History!</h5><hr />
                  <li className="d-flex align-items-center justify-content-between">
                    <span className="text-small">Profit So Far</span>
                    <span className="text-large text-white increase text-end">${convertedProfit !== null && convertedProfit.toFixed(2)}</span>
                  </li><hr />
                  <FadeLoader
                    color="#36d7b7"
                    loading={loading}
                    speedMultiplier={3}
                    style={{ textAlign: 'center', position: 'relative', marginLeft: '50%' }}
                  />
                  <li className="d-flex align-items-center justify-content-between">
                    <span className="text-small">Activation Price</span>
                    <span className="text-large text-white increase text-end">${convertedPrice !== null && convertedPrice.toFixed(2)}</span>
                  </li><hr />
                  <li className="trade-list-item">
                    <p className="d-flex align-items-center text-small gap-4">Reference <i className="icon-question fs-16 text-secondary"></i> </p>
                    <p className="d-flex gap-8 text-white">{trx.contractPrice !== null && trx.contractPrice.toFixed(4)} ETH = {trx.contractPrice !== null && convertedPrice.toFixed(2)} USDC <i className="icon-clockwise2 fs-16"></i></p>
                  </li><hr />
                  <li className="trade-list-item mt-3">
                    {trx.from && trx.to !== '' ? <p className="d-flex gap-4 text-white">_from <span className='text-primarys'>{trx.from !== '' && trx.from.slice(0, 32)}...</span> <i onClick={copyFrom} style={{ cursor: 'pointer' }} className="icon-copy active fs-3"></i></p> : <p className="d-flex gap-2 text-white">_from <span className='text-primary'> loading... </span> =_to<span className='text-primary'> loading...</span> <i className="icon-clockwise2 fs-16"></i></p>}
                  </li><hr />
                  <li className="trade-list-item mt-2">
                    {trx.from && trx.to !== '' ? <p className="d-flex gap-4 text-white"> _to <span className='text-primary'>{trx.to !== '' && trx.to.slice(0, 32)}...</span><i onClick={copyTo} style={{ cursor: 'pointer' }} className="icon-copy fs-3"></i></p> : <p className="d-flex gap-2 text-white">_from <span className='text-primary'> loading... </span> =_to<span className='text-primary'> loading...</span> <i className="icon-clockwise2 fs-16"></i></p>}
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
                    {trx.status == 'Paused' ? <p className="d-flex align-items-center text-small gap-4">Status<i className="icon-clock fs-16 text-warning"></i> </p> : <p className="d-flex align-items-center text-small gap-4">Status<i className="icon-check fs-16 text-primary"></i> </p>}
                    {trx.status !== 'Paused' ? <span className='text-primary' style={{fontSize: "16px"}}>Live</span> : <span className='text-warning'>Pending...</span>}
                  </li>
                  {/* <a className="tf-btn lg mt-20 primary" data-bs-toggle="modal" data-bs-target="#pause">Pause & Withdraw</a> */}
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
                      {checkPin == true ? <button type='submit' onClick={withdrawlFunction} className="mt-40 tf-btn lg primary" >Confirm</button> : <button type='submit' onClick={createPin} className="mt-40 tf-btn lg primary" >Create PIN</button>}
                    </form>
                  </div>
                </div>
    
              </div>
            </div>
    
          </div>
        </>
      )
}

export default WithdrawContractTwo
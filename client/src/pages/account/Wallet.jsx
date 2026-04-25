import axios from "axios";
import { ethers } from "ethers";
import { useContext } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { timeAgo } from "../utils/timeAgo";
import { useEffect, useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import logo144 from "../../images/logo/logo144.png";
import { UserContext } from "../../../context/UserContext";
import Contract from "../components/WalletComp/Contract";

import WalletView from "../components/homeData/WalletView";

const Wallet = () => {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(null);
  const [accountList, setAccountList] = useState(null);
  const [history, setHistory] = useState("");
  const [Notification, setNotification] = useState("");

  useEffect(() => {
    const getNotification = async () => {
      const email = localStorage.getItem("email");
      try {
        axios.post("/getNotification", { email }).then(({ data }) => {
          const datas = data.notificationList.reverse();
          const NotificationList = datas.map((data, index) => {
            const time = data.timestamp;
            return (
              <>
                <li key={index} className="mt-12">
                  <Link to="#" className="noti-item bg-menuDark">
                    <div className="pb-8 line-bt d-flex">
                      <p className="text-button fw-6">
                        {data.header} {data.message}
                      </p>
                      <i className="dot-lg bg-primary"></i>
                    </div>
                    <span className="d-block mt-8">{timeAgo(time)}</span>
                  </Link>
                </li>
              </>
            );
          });
          setNotification(NotificationList);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getNotification();

    try {
      const getHistory = async () => {
        const email = localStorage.getItem("email");
        try {
          const { data } = await axios.post("/getHistory", { email });
          const datas = data.historyList.reverse();
          if (data) {
            const historyList = datas.map((history, index) => {
              return (
                <>
                  <li key={index} className="mt-8">
                    <Link
                      to="#"
                      className="coin-item style-1 gap-12 bg-menuDark"
                    >
                      <span className="box-round d-flex justify-content-center align-items-center">
                        <i
                          style={{ fontSize: "20px" }}
                          className="icon icon-delete"
                        ></i>
                      </span>
                      <div className="content">
                        <div className="title">
                          <p className="mb-4 text-large">{history.type}</p>
                          {history.Status == "Success" ? (
                            <span className="text-success">
                              {history.Status}
                            </span>
                          ) : (
                            <span className="text-warning">
                              {history.Status}
                            </span>
                          )}
                        </div>
                        <div className="box-price">
                          {history.type == "Deposite" ||
                          history.type == "Sent" ? (
                            <p className="text-small mb-4">
                              <span className="text-danger">-</span> ETH{" "}
                              {history.valueEth}
                            </p>
                          ) : (
                            <p className="text-small mb-4">
                              <span className="text-primary">+</span> ETH{" "}
                              {history.valueEth}
                            </p>
                          )}
                          {history.type == "Deposite" ||
                          history.type == "Sent" ? (
                            <p className="text-small">
                              <span className="text-danger">-</span> $
                              {history.valueUsd && history.valueUsd.toFixed(2)}
                            </p>
                          ) : (
                            <p className="text-small">
                              <span className="text-primary">+</span> $
                              {history.valueUsd && history.valueUsd.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                </>
              );
            });
            setHistory(historyList);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getHistory();

      const connectMetaMask = async () => {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const USER_ADDRESS = signer.getAddress();
          const GET_BALANCE = await provider.getBalance(USER_ADDRESS);
          const FORMATED_BALANCE = ethers.utils.formatEther(GET_BALANCE);

          const ACCOUNT_LISTS = await provider.listAccounts();
          const acc_list = ACCOUNT_LISTS.map((ACCOUNT_LIST, index) => {
            const handleCopy = async () => {
              try {
                await navigator.clipboard.writeText(ACCOUNT_LIST);
                toast.success("Copied!");
              } catch (error) {
                toast.error("Fail to Copy!");
              }
            };
            return (
              <>
                <li key={index} data-bs-dismiss="modal">
                  <div className="d-flex justify-content-between align-items-center gap-8 text-large item-check active dom-value">
                    Account {index}
                  </div>
                  <div className="mb-1">
                    <span
                      className="text-secondary"
                      style={{ fontSize: "14px" }}
                    >
                      {ACCOUNT_LIST.slice(0, 30)}...
                    </span>{" "}
                    <i
                      title="Copy"
                      onClick={handleCopy}
                      style={{ fontSize: "22px", cursor: "pointer" }}
                      className="icon icon-copy text-primary"
                    ></i>
                  </div>
                </li>
              </>
            );
          });
          setAccountList(acc_list);

          const BALANCE_IN_USDC = datas[1].current_price;
          const BALANCE_IN_USDC_CONVERTED = BALANCE_IN_USDC * FORMATED_BALANCE;
          setBalance(BALANCE_IN_USDC_CONVERTED);
        } else {
          console.log(
            "Non-Ethereum browser detected. Consider trying MetaMask!",
          );
        }
      };
      connectMetaMask();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  }, []);

  const { user } = useContext(UserContext);

  return (
    <>
      {/* <!-- preloade --> */}
      <div className="preload preload-container">
        <div
          className="preload-logo"
          style={{ backgroundImage: `url(${logo144})` }}
        >
          <div className="spinner"></div>
        </div>
      </div>
      {/* <!-- /preload -->  */}
      <div className="header-style2 fixed-top bg-menuDark">
        <div className="d-flex justify-content-between align-items-center">
          <Link className="box-account" to="/UserInfo">
            {!!user && user.picture !== "" ? (
              <img src={!!user && user.picture} alt="img" className="avt" />
            ) : (
              <img src="/src/images/avt/avt2.jpg" alt="img" className="avt" />
            )}
            <div className="info">
              <p className="text-xsmall text-secondary">Welcome back!</p>
              <h5 className="mt-4">{!!user && user.name}</h5>
            </div>
          </Link>
          <div className="d-flex align-items-center gap-8">
            <Link to="/assetsRatings" className="icon-search"></Link>
            <Link
              to="#notification"
              className="icon-noti"
              data-bs-toggle="modal"
            >
              <span className="box-noti p-2">
                {!!user && user.NotificationSeen}
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="pt-68 pb-80">
        <div className="bg-menuDark tf-container">
          <div className="pt-12 pb-12 mt-4">
            <h5>
              <span className="text-primary">My Wallet</span> -{" "}
              <Link
                to="#"
                className="choose-account"
                data-bs-toggle="modal"
                data-bs-target="#accountWallet"
              >
                <span className="dom-text">Account 1 </span> &nbsp;
                <i className="icon-select-down"></i>
              </Link>{" "}
            </h5>
            {balance == null ? (
              <h1 className="mt-16">
                <Link to="#">$0.00</Link>
              </h1>
            ) : (
              <h1 className="mt-16">
                <Link to="#">${balance !== null && balance.toFixed(2)}</Link>
              </h1>
            )}
            <ul className="mt-16 grid-4 m--16">
              <li>
                <Link
                  to="/Send"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center"
                >
                  <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                    <i className="icon icon-way"></i>
                  </span>
                  Send
                </Link>
              </li>
              <li>
                <Link
                  to="/deposite"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center"
                >
                  <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                    <i className="icon icon-way2"></i>
                  </span>
                  Receive
                </Link>
              </li>
              <li>
                <Link
                  to="/Earn"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center"
                >
                  <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                    <i className="icon icon-exchange"></i>
                  </span>
                  Earn
                </Link>
              </li>
              <li data-bs-toggle="modal" data-bs-target="#walletHistory">
                <Link
                  to="javascript:void(0);"
                  className="tf-list-item d-flex flex-column gap-8 align-items-center"
                >
                  <span className="box-round bg-surface d-flex justify-content-center align-items-center">
                    <i className="icon icon-history"></i>
                  </span>
                  History
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-menuDark tf-container">
          <div className="tf-tab pt-12 mt-4">
            <div className="tab-slide">
              <ul className="nav nav-tabs wallet-tabs" role="tablist">
                <li className="item-slide-effect"></li>
                <li className="nav-item active" role="presentation">
                  <button
                    className="nav-link active"
                    data-bs-toggle="tab"
                    data-bs-target="#history"
                  >
                    Market
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#market"
                  >
                    Contracts
                  </button>
                </li>
              </ul>
            </div>
            <div className="tab-content pt-16 pb-16">
              <h5
                style={{marginBottom: "-27px"}}
              >
                <Link to="/assetsRatings" className="cryptex-rating text-primary">
                  <i className="icon-star text-warning m-1"></i>Bitclub Rating
                </Link>
              </h5>
              <div
                className="tab-pane p-3 rounded fade active show"
                id="history"
                role="tabpanel"
              >
                <ul>
                  <FadeLoader
                    color="#36d7b7"
                    loading={loading}
                    speedMultiplier={3}
                    style={{
                      textAlign: "center",
                      position: "relative",
                      marginLeft: "50%",
                    }}
                  />
                  <WalletView />
                </ul>
              </div>
              <div className="tab-pane fade" id="market" role="tabpanel">
                <Contract />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="menubar-footer footer-fixed">
        <ul className="inner-bar">
          <li>
            <Link to="/Home">
              <i className="icon icon-home2"></i>
              Home
            </Link>
          </li>
          <li>
            <Link to="/Exchange">
              <i className="icon icon-exchange"></i>
              Exchange
            </Link>
          </li>
          <li>
            <Link to="/Earn">
              <i className="icon icon-earn"></i>
              Earn
            </Link>
          </li>
          <li className="active">
            <Link to="/Wallet">
              <i className="icon icon-wallet2"></i>
              Wallet
            </Link>
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
              <span className="left" data-bs-dismiss="modal" aria-hidden="true">
                <i className="icon-left-btn"></i>
              </span>
              <h3>History</h3>
              <span className="right text-white btn-filter-history">
                <i className="icon-funnel"></i>
              </span>
            </div>
            <div className="overflow-auto pt-45 pb-16">
              <div className="tf-container">
                <ul className="mt-4">{history}</ul>
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
              <span
                className="icon-cancel"
                data-bs-dismiss="modal"
                aria-hidden="true"
              ></span>
            </div>
            <div className="modal-body">
              <div className="text-button fw-6 text-white">Time</div>
              <ul className="grid-2 rcg-12-16 mt-16">
                <li>
                  <Link
                    to="javascript:void(0);"
                    className="tf-btn xs line active text-secondary item-time"
                  >
                    All
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0);"
                    className="tf-btn xs line text-secondary item-time"
                  >
                    24 Hours
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0);"
                    className="tf-btn xs line text-secondary item-time"
                  >
                    7 Days
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0);"
                    className="tf-btn xs line text-secondary item-time"
                  >
                    12 Days{" "}
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0);"
                    className="tf-btn xs line text-secondary item-time"
                  >
                    30 Days
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0);"
                    className="tf-btn xs line text-secondary item-time"
                  >
                    3 Month
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0);"
                    className="tf-btn xs line text-secondary item-time"
                  >
                    6 Month
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0);"
                    className="tf-btn xs line text-secondary item-time"
                  >
                    12 Month
                  </Link>
                </li>
              </ul>
              <div className="text-button fw-6 text-white mt-16">
                Categories
              </div>
              <ul className="grid-2 rcg-12-16 mt-16">
                <li>
                  <Link
                    to="javascript:void(0);"
                    className="tf-btn xs line active text-secondary item-category"
                  >
                    All
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0);"
                    className="tf-btn xs line text-secondary item-category"
                  >
                    Transfer money
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0);"
                    className="tf-btn xs line text-secondary item-category"
                  >
                    Receive money
                  </Link>
                </li>
              </ul>
              <div className="mt-16 pt-16 line-t grid-2 gap-16">
                <Link
                  to="javascript:void(0);"
                  className="tf-btn sm secondary"
                  data-bs-dismiss="modal"
                >
                  Delete
                </Link>
                <Link
                  to="javascript:void(0);"
                  className="tf-btn sm primary"
                  data-bs-dismiss="modal"
                >
                  Apply
                </Link>
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
              <span className="left" data-bs-dismiss="modal" aria-hidden="true">
                <i className="icon-left-btn"></i>
              </span>
              <h3>Notification</h3>
            </div>
            <div className="overflow-auto pt-45 pb-16">
              <div className="tf-container">
                <ul className="mt-12">{Notification}</ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;

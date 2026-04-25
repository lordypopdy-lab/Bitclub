import { Link } from "react-router-dom";
import coin1 from "../../images/coin/coin1.jpg";
import logo144 from "../../images/logo/logo144.png";

const BuyQuantity = () => {
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
      <div className="header fixed-top bg-surface d-flex justify-content-between align-items-center">
        <Link to="javascript:void(0);" className="left back-btn">
          <i className="icon-left-btn"></i>
        </Link>
        <Link to="/SellQuantity" className="right">
          Sell
        </Link>
      </div>
      <div className="pt-45 pb-16">
        <div className="tf-container">
          <div className="mt-4 coin-item style-2 gap-8">
            <img src={coin1} alt="img" className="img" />
            <h5>Buy BTC</h5>
          </div>
          <div className="mt-16 d-flex justify-content-between">
            <span>I want to pay</span>
            <span className="text-primary d-flex align-items-center gap-4">
              By quantity <i className="icon-leftRight"></i>
            </span>
          </div>
          <div className="mt-8 group-ip-select">
            <input type="text" placeholder="Please enter quantity" />
            <div className="select-wrapper">
              <select className="tf-select">
                <option value="">VND</option>
                <option value="">BTC</option>
              </select>
            </div>
          </div>
          <p className="mt-8">188.308-300.000,000 USD</p>
          <Link to="/ChoosePayment" className="tf-btn lg primary mt-40">
            Buy
          </Link>
        </div>
      </div>
    </>
  );
};

export default BuyQuantity;

import { Link } from "react-router-dom";
import coin1 from "../../images/coin/coin1.jpg";

const SellQuantity = () => {
  return (
   <>
   <div class="header fixed-top bg-surface d-flex justify-content-between align-items-center">
        <Link to="javascript:void(0);" class="left back-btn">
          <i class="icon-left-btn"></i>
        </Link>
        <Link to="/home" class="right">
          <i class="icon-home2 fs-20"></i>
        </Link>
    </div>
    <div class="pt-45 pb-16">
        <div class="tf-container">
          <div class="mt-4 coin-item style-2 gap-8">
            <img src={coin1} alt="img" class="img" />
            <h5>Sell BTC</h5>
          </div>
          <div class="mt-16 d-flex justify-content-between">
            <span>I want to pay</span>
            <span class="text-primary d-flex align-items-center gap-4">By quantity <i class="icon-leftRight"></i></span>
          </div>
          <div class="mt-8 group-ip-select">
                <input type="text" placeholder="Please enter quantity" />
                <div class="select-wrapper">
                    <select class="tf-select">
                        <option value="">VND</option>
                        <option value="">BTC</option>
                    </select>
                </div>  
          </div>
          <ul class="mt-8 d-flex gap-8">
            <li>
              <Link to="#" class="tag-sm dark">25%</Link>
            </li>
            <li>
              <Link to="#" class="tag-sm dark">50%</Link>
            </li>
            <li>
              <Link to="#" class="tag-sm dark">75%</Link>
            </li>
            <li>
              <Link to="#" class="tag-sm dark">100%</Link>
            </li>
          </ul>
          <p class="mt-8">188.308-300.000,000 USD</p>
          <Link to="/ChoosePayment" class="tf-btn lg primary mt-40">Sell</Link>
        </div>
    </div>

   </>
  )
}

export default SellQuantity
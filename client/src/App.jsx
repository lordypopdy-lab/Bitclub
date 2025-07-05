import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

import { UserContextProvider } from '../context/UserContext';

// Pages
import Send from './pages/account/Send';
import Earn from './pages/account/Earn';
import Wallet from './pages/account/Wallet';
import Opt02 from './pages/settings/Opt02';
import Terms from './pages/Policy/Terms';
import Policy from './pages/Policy/Policy';
import Profile from './pages/profile/Profile';
import Welcome from './pages/account/Welcome';
import UserInfo from './pages/profile/UserInfo';
import Boarding from './pages/account/Boarding';
import Boarding2 from './pages/account/Boarding2';
import Login from './pages/settings/Login';
import Home from './pages/Home';
import FaceID from './pages/profile/FaceID';
import Option from './pages/settings/Option';
import VerifyID from './pages/profile/VerifyID';
import Deposite from './pages/account/Deposite';
import BlogDetail from './pages/account/BlogDetail';
import Recharge from './pages/account/Recharge';
import Register from './pages/settings/Register';
import Exchange from './pages/account/Exchange';
import ListBlog from './pages/account/ListBlog';
import BuyQuantity from './pages/account/BuyQuantity';
import FaceIdDone from './pages/profile/FaceIdDone';
import RessetPassword from './pages/settings/RessetPassword';
import AddresScan from './pages/account/AddresScan';
import Verification from './pages/profile/Verification';
import NewPassword from './pages/settings/NewPassword';
import CameraScan from './pages/profile/CameraScan';
import ChooseIdentity from './pages/profile/ChooseIdentity';
import ChoosePayment from './pages/account/ChoosePayment';
import CameraSuccess from './pages/profile/CameraSuccess';
import PaymentComfirm from './pages/account/PaymentComfirm';
import TradeExchange from './pages/account/TradeExchange';
import CameraDone from './pages/account/CameraDone';
import VerifyIDScan from './pages/profile/VerifyIDScan';
import TokenFetcher from './pages/TRX/TokenFetcher';
import ChangeName from './pages/settings/ChangeName';
import ContractOne from './pages/account/ContractOne';
import ContractTwo from './pages/account/ContractTwo';
import ContractFour from './pages/account/ContractFour';
import ContractThree from './pages/account/ContractThree';
import TellUsMore from './pages/settings/TellUsMore';
import SellQuantity from './pages/account/SellQuantity';
import AccountFreez from './pages/settings/AccountFreez';
import SecurityCenter from './pages/settings/SecurityCenter';
import AssetsRatings from './pages/account/AssetsRatings';
import ChangePassword from './pages/settings/ChangePassword';
import VerificationDone from './pages/profile/VerificationDone';
import ContractOneProfile from './pages/account/ContractOneProfile';
import AddressVerification from './pages/account/AddressVerification';
import VerificationComfirm from './pages/profile/VerificationComfirm';
import VerificationAdvance from './pages/profile/VerificationAdvance';
import IdentityVerification from './pages/profile/IdentityVerification';
import ChooseVerification from './pages/profile/ChooseVerification';
import NewPasswordSucces from './pages/settings/NewPasswordSucces';
import ExchangeTradeApprove from './pages/account/ExchangeTradeApprove';
import WithdrawContractTwo from './pages/TRX/WithdrawContractTwo';
import WithdrawContractOne from './pages/TRX/WithdrawContractOne';
import ContractTwoProfile from './pages/account/ContractTwoProfile';

// Styles & Scripts
import '../src/fonts/fonts.css';
import '../src/fonts/font-icons.css';
import '../src/css/bootstrap.min.css';
import '../src/css/styles.css';
import '../src/css/swiper-bundle.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { initializeSwiper } from "../src/js/carousel";
import { Preloader } from "../src/pages/utils/Properties";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
// axios.defaults.withCredentials = true;
// axios.defaults.withCredentials = true;


function App() {
  useEffect(() => {
    initializeSwiper();
    Preloader();
  }, []);

  return (
    <BrowserRouter>
      <UserContextProvider>
        <Routes>
          <Route index element={<Welcome />} />
          <Route path='/Home' element={<Home />} />
          <Route path='/Send' element={<Send />} />
          <Route path='/Profile' element={<Profile />} />
          <Route path='/UserInfo' element={<UserInfo />} />
          <Route path='/Earn' element={<Earn />} />
          <Route path='/Otp02' element={<Opt02 />} />
          <Route path='/wallet' element={<Wallet />} />
          <Route path='/Option' element={<Option />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/policy' element={<Policy />} />
          <Route path='/FaceID' element={<FaceID />} />
          <Route path='/FaceIdDone' element={<FaceIdDone />} />
          <Route path='/ListBlog' element={<ListBlog />} />
          <Route path='/Recharge' element={<Recharge />} />
          <Route path='/Exchange' element={<Exchange />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Deposite' element={<Deposite />} />
          <Route path='/VerifyID' element={<VerifyID />} />
          <Route path='/Boarding2' element={<Boarding2 />} />
          <Route path='/BlogDetail' element={<BlogDetail />} />
          <Route path='/Boarding' element={<Boarding />} />
          <Route path='/AddressScan' element={<AddresScan />} />
          <Route path='/BuyQuantity' element={<BuyQuantity />} />
          <Route path='/NewPassword' element={<NewPassword />} />
          <Route path='/CameraScan' element={<CameraScan />} />
          <Route path='/CameraDone' element={<CameraDone />} />
          <Route path='/TellUsMore' element={<TellUsMore />} />
          <Route path='/ContractTwo' element={<ContractTwo />} />
          <Route path='/ContractFour' element={<ContractFour />} />
          <Route path='/ContractThree' element={<ContractThree />} />
          <Route path='/ContractOne' element={<ContractOne />} />
          <Route path='/AssetsRatings' element={<AssetsRatings />} />
          <Route path='/Verification' element={<Verification />} />
          <Route path='/CameraSuccess' element={<CameraSuccess />} />
          <Route path='/TradeExchange' element={<TradeExchange />} />
          <Route path='/RessetPassword' element={<RessetPassword />} />
          <Route path='/ChoosePayment' element={<ChoosePayment />} />
          <Route path='/PaymentComfirm' element={<PaymentComfirm />} />
          <Route path='/ChooseIdentity' element={<ChooseIdentity />} />
          <Route path='/VerifyIDScan' element={<VerifyIDScan />} />
          <Route path='/ChangeName' element={<ChangeName />} />
          <Route path='/AccountFreez' element={<AccountFreez />} />
          <Route path='/fetchTokens' element={<TokenFetcher />} />
          <Route path='/SecurityCenter' element={<SecurityCenter />} />
          <Route path='/ChangePassword' element={<ChangePassword />} />
          <Route path='/VerificationDone' element={<VerificationDone />} />
          <Route path='/withdarawContractOne' element={<WithdrawContractOne />} />
          <Route path='/withdarawContractTwo' element={<WithdrawContractTwo />} />
          <Route path="/ContractTwoProfile" element={<ContractTwoProfile />} />
          <Route path='/ContractOneProfile' element={<ContractOneProfile />} />
          <Route path='/AddressVerification' element={<AddressVerification />} />
          <Route path='/VerificationComfirm' element={<VerificationComfirm />} />
          <Route path='/VerificationAdvance' element={<VerificationAdvance />} />
          <Route path='/ChooseVerification' element={<ChooseVerification />} />
          <Route path='/NewPasswordSuccess' element={<NewPasswordSucces />} />
          <Route path='/SellQuantity' element={<SellQuantity />} />
          <Route path='/IdentityVerification' element={<IdentityVerification />} />
          <Route path='/ExchangeTradeApprove' element={<ExchangeTradeApprove />} />
        </Routes>
        <Toaster position='top-right' toastOptions={{ duration: 4000 }} />
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;

const express = require("express");

const router = express.Router();

const {
  getOTP,
  registerUser,
  userInfo,
  pinCheck,
  citizenId,
  loginUser,
  createPin,
  tokenViews,
  getProfile,
  getAccounts,
  getHistory,
  contractOne,
  getContractOne,
  updateUserName,
  changePassword,
  contractOneCheck,
  pinVerify,
  verifyOtp,
  fetchOTP,
  fetchKyc,
  googleLogin,
  createNotification,
  pauseContractOne,
  contractOneTrxLogs,
  reActivateContractOne,
  getNotification,
  reActivateContractTwo,
  contractTwo,
  getContractTwo,
  contractTwoTrxLogs,
  contractTwoCheck,
  pauseContractTwo,
  getProfitOne,
  getProfitTwo,
  tester,
  ApproveKyc,
  DeclineKyc,
  DeleteKyc,
  fetchAllKyc,
  Erc20WalletAuth,
  BtcWalletAuth,
  BNBWalletAuth,
} = require("../controllers/authController");

// =========================
// AUTH ROUTES
// =========================
router.post("/login", loginUser);

router.post("/loginGoogle", googleLogin);

router.post("/register", registerUser);

router.post("/getOTP", getOTP);

router.post("/verifyOtp", verifyOtp);

router.post("/fetchOTP", fetchOTP);

router.post("/pinCheck", pinCheck);

router.post("/createPin", createPin);

router.post("/pinVerify", pinVerify);

router.post("/changePassword", changePassword);

// =========================
// USER ROUTES
// =========================
router.post("/userInfo", userInfo);

router.post("/profile", getProfile);

router.post("/nameUpdate", updateUserName);

router.post("/getAccounts", getAccounts);

router.post("/getHistory", getHistory);

// =========================
// TOKEN ROUTES
// =========================
router.get("/tokens", tokenViews);

// =========================
// KYC ROUTES
// =========================
router.post("/citizenId", citizenId);

router.post("/fetchKyc", fetchKyc);

router.get("/fetchAllKyc", fetchAllKyc);

router.post("/approveKyc", ApproveKyc);

router.post("/declineKyc", DeclineKyc);

router.post("/deleteKyc", DeleteKyc);

// =========================
// CONTRACT ONE
// =========================
router.post("/contractOne", contractOne);

router.post("/getContractOne", getContractOne);

router.post("/contractOneCheck", contractOneCheck);

router.post("/pauseContractOne", pauseContractOne);

router.post("/reActivateContractOne", reActivateContractOne);

router.post("/setContractOneLogs", contractOneTrxLogs);

router.post("/getProfitOne", getProfitOne);

// =========================
// CONTRACT TWO
// =========================
router.post("/contractTwo", contractTwo);

router.post("/getContractTwo", getContractTwo);

router.post("/contractTwoCheck", contractTwoCheck);

router.post("/pauseContractTwo", pauseContractTwo);

router.post("/reActivateContractTwo", reActivateContractTwo);

router.post("/setContractTwoLogs", contractTwoTrxLogs);

router.post("/getProfitTwo", getProfitTwo);

// =========================
// WALLET AUTH
// =========================
router.post("/BNBWalletAuth", BNBWalletAuth);

router.post("/BtcWalletAuth", BtcWalletAuth);

router.post("/Erc20WalletAuth", Erc20WalletAuth);

// =========================
// NOTIFICATIONS
// =========================
router.post("/notification", createNotification);

router.post("/getNotification", getNotification);

// =========================
// TEST ROUTE
// =========================
router.get("/tester", tester);

// =========================
// EXPORT
// =========================
module.exports = router;
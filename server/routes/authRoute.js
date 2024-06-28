const express = require('express');
const cors = require('cors');

const router = express.Router();

const {
    registerUser,
    pinCheck,
    loginUser,
    createPin,
    tokenViews,
    getProfile,
    getHistory,
    contractOne,
    getContractOne,
    updateUserName,
    changePassword,
    contractOneCheck,
    pinVerify,
    createNotification,
    pauseContractOne,
    contractOneTrxLogs,
    reActivateContractOne
} = require('../controllers/authController');

router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
)

router.post('/login', loginUser);
router.post('/pinCheck', pinCheck);
router.post('/register', registerUser);
router.get('/tokens', tokenViews)
router.post('/createPin', createPin);
router.post('/pinVerify', pinVerify)
router.post('/profile', getProfile);
router.post('/getHistory', getHistory);
router.post('/contractOne', contractOne);
router.post('/nameUpdate', updateUserName);
router.post('/getContractOne', getContractOne);
router.post('/changePassword', changePassword);
router.post('/notification', createNotification )
router.post('/pauseContractOne', pauseContractOne);
router.post('/contractOneCheck', contractOneCheck);
router.post('/setContractOneLogs', contractOneTrxLogs);
router.post('/reActivateContractOne', reActivateContractOne);


module.exports = router
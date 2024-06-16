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
    contractOne,
    getContractOne,
    updateUserName,
    changePassword,
    contractOneCheck,
    pinVerify,
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
router.post('/contractOne', contractOne);
router.post('/nameUpdate', updateUserName);
router.post('/getContractOne', getContractOne);
router.post('/changePassword', changePassword);
router.post('/contractOneCheck', contractOneCheck);

module.exports = router
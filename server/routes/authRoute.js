const express = require('express');
const cors = require('cors');

const router = express.Router();

const {
    registerUser,
    loginUser,
    tokenViews,
    getProfile,
    contractOne,
    getContractOne,
    updateUserName,
    changePassword,
    contractOneCheck,
} = require('../controllers/authController');

router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
)

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/tokens', tokenViews)
router.post('/profile', getProfile);
router.post('/contractOne', contractOne);
router.post('/nameUpdate', updateUserName);
router.post('/getContractOne', getContractOne);
router.post('/changePassword', changePassword);
router.post('/contractOneCheck', contractOneCheck);

module.exports = router
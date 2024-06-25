const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const { WebSocket } = require('ws');
const axios = require('axios');
const UserContractOne = require('../models/contractOne');
const UserSecurity = require('../models/checkPin');
const PauseLogs = require('../models/trxHistory');


const reActivateContractOne = async (req, res) => {
    try {
        const {
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
            transactionHash
        } = req.body;
        const update = await UserContractOne.updateOne({ email: email }, { $set: { 
            to: `${to}`,
            from: `${from}`,
            name: `${name}`,
            gasFee: `${gasFee}`,
            status: `${status}` ,
            contractPrice: `${contractPrice}`,
            contractProfit: `${contractProfit}`,
            cumulativeGasUsed: `${cumulativeGasUsed}`,
            blockNumber:`${blockNumber}`,
            blockHash: `${blockHash}`,
            transactionHash: `${transactionHash}`,
        } })

        const user = await User.findOne({email});
        const updateUserNotification = await User.updateOne({email: email}, {$set: {NotificationSeen: `${ user.NotificationSeen + 1}`}});
        if(update && updateUserNotification){
            return res.json({
                success: 'Contract reActivated Successfuly!'
            })
        }
        return({
            error: 'Error re-activating ContractS'
        })
    } catch (error) {
        return res.json({
            error
        })
    }

}


const contractOneTrxLogs = async (req, res) => {
    try {
        const {
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
            contractPrice
        } = req.body;

        const createLogs = await PauseLogs.create({
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
            contractPrice
        })

        const user = await User.findOne({email});
        const updateUserNotification = await User.updateOne({email: email}, {$set: {NotificationSeen: `${user.NotificationSeen + 1}`}});

        if (createLogs && updateUserNotification) {
            return res.json({
                success: 'Transaction successfuly'
            })
        }
        console.log("Error");
    } catch (error) {
        return res.json({
            error: error
        })
    }
}

const pauseContractOne = async (req, res) => {
    const { email } = req.body;
    const update = await UserContractOne.updateOne({ email: email }, { $set: { status: `Paused`, contractPrice: `${0}`, contractProfit: `${0}` } });
    if (update) {
        return res.json({
            success: 'Contract paused Successfuly!'
        })
    }
    return res.json({
        error: 'Error Pausing Contract'
    })
}

const pinVerify = async (req, res) => {
    const { pin1, pin2, pin3, pin4, email } = req.body;
    if (!pin1) {
        return res.json({
            error: 'All PIN fields is required!'
        })
    }

    if (!pin2) {
        return res.json({
            error: 'All PIN fields is required!'
        })
    }

    if (!pin3) {
        return res.json({
            error: 'All PIN fields is required!'
        })
    }

    if (!pin4) {
        return res.json({
            error: 'All PIN fields is required!'
        })
    }

    const userPin = await UserSecurity.findOne({ email });
    const PIN = pin1 + pin2 + pin3 + pin4;
    const matchCorrect = await comparePassword(PIN, userPin.pin);
    if (matchCorrect) {
        return res.json({
            success: 'PIN match Successfuly'
        })
    } else {
        return res.json({
            error: 'Wrong PIN Provided'
        })
    }
}

const createPin = async (req, res) => {
    const { pin1, pin2, pin3, pin4, email } = req.body;
    if (!pin1) {
        return res.json({
            error: 'All PIN fields is required!'
        })
    }

    if (!pin2) {
        return res.json({
            error: 'All PIN fields is required!'
        })
    }

    if (!pin3) {
        return res.json({
            error: 'All PIN fields is required!'
        })
    }

    if (!pin4) {
        return res.json({
            error: 'All PIN fields is required!'
        })
    }
    const PIN = pin1 + pin2 + pin3 + pin4;
    const pin = await hashPassword(PIN)
    if (pin) {
        const createPIN = await UserSecurity.create({ email, pin })
        if (createPIN) {
            return res.json({
                success: 'PIN Created successfuly!'
            })
        } else {
            return res.json({
                error: "Error Creating PIN"
            })
        }
    }
}

const pinCheck = async (req, res) => {
    const { email } = req.body;
    const exist = await UserSecurity.findOne({ email });
    if (exist) {
        return res.json({
            exists: true
        })
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password, comfirmPassword } = req.body;
        //Check if name was taken
        if (!name) {
            return res.json({
                error: 'name is required'
            })
        }

        //Check if password is goood
        if (!password || password.length < 6) {
            return res.json({
                error: 'password is required and should be atleast six(6) characters'
            })
        }

        //Check comfirmPassword
        if (password !== comfirmPassword) {
            return res.json({
                error: 'Comfirm password must match password'
            })
        }
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: 'email is taken'
            })
        }

        const hashedPassword = await hashPassword(password)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            NotificationSeen: 0
        })
        return res.json(user)
    } catch (error) {
        console.log(error)
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        //Check if user exist
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                error: "No user found"
            })
        }
        //Check if password match
        const match = await comparePassword(password, user.password);
        if (match) {
            jwt.sign({ name: user.name, email: user.email, id: user._id }, process.env.JWT_SECRET, {}, (error, token) => {
                if (error) throw error;
                res.cookie('token', token).json(user)
            })
        }
        if (!match) {
            return res.json({
                error: 'password not match our database, password should be atleast six(6) character',
            })
        }

    } catch (error) {
        console.log(error)
    }
}

const getProfile = async (req, res) => {
    const { email, pin } = req.body;

    const user = await User.findOne({ email });
    const pin_match = user._id;
    if (user && pin == pin_match) {
        res.json(user);
    } else {
        res.json({
            error: "Error access"
        })
    }
}

const updateUserName = async (req, res) => {
    try {
        const { name, email } = req.body;
        console.log(name)
        const user = await User.findOne({ email });
        if (user) {
            const update = await User.updateOne({ email: email }, { $set: { name: `${name}` } });
            if (update) {
                res.json({
                    message: "name update was successfuly!"
                })
            } else {
                res.json({
                    error: "unable to update username"
                })
            }
        } else {
            res.json({
                error: 'user not found'
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const changePassword = async (req, res) => {
    try {
        const { email, current, newPassword, comfirmNewPassword } = req.body;
        const user = await User.findOne({ email });

        if (!email) {
            return res.json({
                error: "unidentify user"
            })
        }

        if (!current) {
            return res.json({
                error: "current password is required to complete the proccess"
            })
        }

        if (!newPassword) {
            return res.json({
                error: "new password field is required"
            })
        }

        if (newPassword.length < 8) {
            return res.json({
                error: "password is required and should be atleast six(8) chars"
            })
        }

        if (!comfirmNewPassword) {
            return res.json({
                error: "comfirm password is required and should be atleast six(8) chars"
            })
        }

        if (newPassword !== comfirmNewPassword) {
            return res.json({
                error: "new password must match comfirm password"
            })
        }

        const comfirmPassword = await comparePassword(current, user.password);

        if (comfirmPassword) {
            hashNew = await hashPassword(newPassword);
            const updatePassword = await User.updateOne({ email: email }, { $set: { password: `${hashNew}` } });
            if (updatePassword) {
                return res.json({
                    success: "password update was successfuly"
                })
            } else {
                return res.json({
                    error: "password update error"
                })
            }
        } else {
            return res.json({
                error: "current password did not match our database"
            })
        }

    } catch (error) {
        throw error;
    }

}

const tokenViews = async (req, res) => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
        // const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/btc.min.json');
        if (!response.ok) {
            return res.json({
                error: 'Network response was not ok'
            });
        }
        const data = await response.json();
        res.json({
            tokens: data
        })
        // const tokenId = 'bitcoin'
        // const url = https://api.coingecko.com/api/v3/coins/${tokenId};
        // const response = await axios.get(url);
        // const data = response.data;

        // console.log(`Name: ${data.name}`);
        // console.log(`Symbol: ${data.symbol}`);
        // console.log(`Current Price (USD): $${data.market_data.current_price.usd}`);
        // console.log(`Market Cap (USD): $${data.market_data.market_cap.usd}`);
        // console.log(`24h Trading Volume (USD): $${data.market_data.total_volume.usd}`);
        // console.log(`Price Change 24h (%): ${data.market_data.price_change_percentage_24h}%`);

    } catch (error) {
        return res.json({
            error: error.message
        })
    }
}

const contractOne = async (req, res) => {
    try {
        const {
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
            transactionHash } = req.body;

        const user_contract_check_one = await UserContractOne.findOne({ email });

        if (user_contract_check_one) {
            return res.json({
                activated: true,
                success: 'Contract has been Activated Already!'
            })
        }

        if (!user_contract_check_one) {
            const createContractOne = await UserContractOne.create({
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
                transactionHash
            })

            if (createContractOne) {
                return res.json({
                    success: 'contract created successfuly!',
                    data: {
                        contract: createContractOne
                    }
                })
            }

            res.json({
                error: 'Error creating Contract'
            })
        }
    } catch (error) {
        console.log(error);
        res.json({
            error: 'Error creating ContractOne'
        })
    }
}

const contractOneCheck = async (req, res) => {
    const { email } = req.body;
    const exist = await UserContractOne.findOne({ email });
    if (exist) {
        return res.json({
            status: true
        });
    }
    return res.json({
        status: false
    });
}

const getContractOne = async (req, res) => {
    const { email } = req.body;
    const exist = await UserContractOne.findOne({ email });
    if (exist) {
        return res.json({
            success: 'Data Fetch Successfuly!',
            contractOne: exist
        })
    }
    return res.json({
        message: false
    })
}

module.exports = {
    pinCheck,
    loginUser,
    createPin,
    pinVerify,
    tokenViews,
    registerUser,
    getProfile,
    contractOne,
    updateUserName,
    changePassword,
    getContractOne,
    pauseContractOne,
    contractOneCheck,
    contractOneTrxLogs,
    reActivateContractOne,
}
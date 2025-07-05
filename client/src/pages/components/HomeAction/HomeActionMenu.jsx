import React from 'react'
import { useState } from 'react';

const HomeActionMenu = () => {
    const [balance, setBalance] = useState(null);
    return (
        <div>
            <div className="pt-12 pb-12 mt-4">
                <h5><span className="text-primary">My Wallet</span> - <a href="#" className="choose-account" data-bs-toggle="modal" data-bs-target="#accountWallet"><span className="dom-text">Account 1 </span> &nbsp;<i className="icon-select-down"></i></a> </h5>
                {balance == null ? <h1 className="mt-16"><a href="#">$0.00</a></h1> : <h1 className="mt-16"><a href="#">${balance !== null && balance.toFixed(2)}</a></h1>}
                <ul className="mt-16 grid-4 m--16">
                    <li>
                        <a href="/Send" className="tf-list-item d-flex flex-column gap-8 align-items-center">
                            <span className="box-round bg-surface d-flex justify-content-center align-items-center"><i className="icon icon-way"></i></span>
                            Send
                        </a>
                    </li>
                    <li>
                        <a href="/AddressScan" className="tf-list-item d-flex flex-column gap-8 align-items-center">
                            <span className="box-round bg-surface d-flex justify-content-center align-items-center"><i className="icon icon-way2"></i></span>
                            Receive
                        </a>
                    </li>
                    <li>
                        <a href="/Earn" className="tf-list-item d-flex flex-column gap-8 align-items-center">
                            <span className="box-round bg-surface d-flex justify-content-center align-items-center"><i className="icon icon-exchange"></i></span>
                            Earn
                        </a>
                    </li>
                    <li data-bs-toggle="modal" data-bs-target="#walletHistory">
                        <a href="javascript:void(0);" className="tf-list-item d-flex flex-column gap-8 align-items-center">
                            <span className="box-round bg-surface d-flex justify-content-center align-items-center"><i className="icon icon-history"></i></span>
                            History
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default HomeActionMenu

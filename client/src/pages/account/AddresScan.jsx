import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from "react";
import InputGroup from 'react-bootstrap/InputGroup';
import bannerqrcode from "../../images/banner/bannerqrcode.png"
import {
EmailShareButton,
FacebookMessengerShareButton,
FacebookShareButton,
GabShareButton,
HatenaShareButton,
InstapaperShareButton,
LineShareButton,
LinkedinShareButton,
LivejournalShareButton,
MailruShareButton,
OKShareButton,
PinterestShareButton,
PocketShareButton,
RedditShareButton,
TelegramShareButton,
TumblrShareButton,
TwitterShareButton,
ViberShareButton,
VKShareButton,
WhatsappShareButton,
WorkplaceShareButton,
} from "react-share";

import {
EmailIcon,
FacebookIcon,
FacebookMessengerIcon,
GabIcon,
HatenaIcon,
InstapaperIcon,
LineIcon,
LinkedinIcon,
LivejournalIcon,
MailruIcon,
OKIcon,
PinterestIcon,
PocketIcon,
RedditIcon,
TelegramIcon,
TumblrIcon,
TwitterIcon,
ViberIcon,
WhatsappIcon,
WorkplaceIcon,
} from "react-share";
const AddresScan = () => {
const [userAddress, setUserAddress] = useState('');

useEffect(()=>{
try {
    const connectMetaMask = async()=>{
        if(typeof window.ethereum !=='undefined'){
            const accounts = await window.ethereum.send('eth_requestAccounts',[]);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const signerAddress = await signer.getAddress();
            setUserAddress(signerAddress);
        }else{
            toast.error('Non-Ethereum browser detected. Consider trying MetaMask!');
            console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
        }
    }
    connectMetaMask();
} catch (error) {
    console.log(error);
}
},[])

const copyAddrress = async()=>{
if(userAddress !== ''){
try {
    await navigator.clipboard.writeText(userAddress);
    toast.success('Address Copied!');
} catch (error) {
    toast.error('Fail to Copy!');
}
}else{
toast.error('Failed to Copy, No Address Detected')
}
}

if (!localStorage.getItem('email')) { location.href = '/login'; }
    return (
<>
<div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
<a href="javascript:void(0);" className="left back-btn"><i className="icon-left-btn"></i></a>
<h3>QR code</h3>
<a href="javascript:void(0);" className="right"><i style={{ fontSize: '27px' }} className="icon-exchange p-1"></i> Receive</a>
</div>
<div className="pt-45 pb-16">
<div className="tf-container">
    <div className="mt-40 banner-qr">
        <img src={bannerqrcode} alt="img" />
    </div>
</div>
<ul className="mt-10 accent-box line-border">
    <li>
        <p className="d-flex align-items-center text-small gap-4">Deposite Address <i className="icon-question fs-16 text-secondary"></i> </p>
        <InputGroup className="mb-2 mt-3">
            <Form.Control
                type="text"
                value= {userAddress !== '' && userAddress}
                aria-describedby="basic-addon1"
            />
            <InputGroup.Text onClick={copyAddrress} style={{ border: 'none', cursor: 'pointer' }} className='bg-transparent line-border' id="basic-addon1"><i style={{ fontSize: '22px' }} className="icon-copy text-light"></i></InputGroup.Text>
        </InputGroup>
    </li>
    <a href="javascript:void(0);" className="tf-btn lg mt-20 primary" data-bs-toggle="modal" data-bs-target="#share">Share Address</a>
</ul>
</div>


{/* <!-- Share Links --> */}
<div className="modal fade modalRight" id="share">
<div className="modal-dialog" role="document">
    <div className="modal-content">
        <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
            <span className="left" data-bs-dismiss="modal" aria-hidden="true"><i className="icon-left-btn"></i></span>
            <h3>Share Address</h3>
        </div>
        <div className="overflow-auto pt-45 pb-16">
            <div className="tf-container">
                <ul className="mt-12 grid-4 rg-16 cg-25">
                    <li>
                        <TwitterShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <TwitterIcon size={32} round={true} />
                            <p className="text-center text-light">Twiter</p>
                        </TwitterShareButton>
                    </li>
                    <li>
                        <EmailShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <EmailIcon size={32} round={true} />
                            <p className="text-center text-light">E-mail</p>
                        </EmailShareButton>
                    </li>
                    <li>
                        <WhatsappShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <WhatsappIcon size={32} round={true} />
                            <p className="text-center text-light">Whatsapp</p>
                        </WhatsappShareButton>
                    </li>
                    <li>
                        <FacebookMessengerShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <FacebookMessengerIcon size={32} round={true} />
                            <p className="text-center text-light">facebook messanger</p>
                        </FacebookMessengerShareButton>
                    </li>
                    <li>
                        <FacebookShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <FacebookIcon size={32} round={true} />
                            <p className="text-center text-light">facebook</p>
                        </FacebookShareButton>
                    </li>
                    <li>
                        <TelegramShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <TelegramIcon size={32} round={true} />
                            <p className="text-center text-light">Telegram</p>
                        </TelegramShareButton>
                    </li>
                    <li>
                        <MailruShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <MailruIcon size={32} round={true} />
                            <p className="text-center text-light">Mail</p>
                        </MailruShareButton>
                    </li>
                    <li>
                        <InstapaperShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <InstapaperIcon size={32} round={true} />
                            <p className="text-center text-light">Instapaper</p>
                        </InstapaperShareButton>
                    </li>
                    <li>
                        <GabShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <GabIcon size={32} round={true} />
                            <p className="text-center text-light">Gab</p>
                        </GabShareButton>
                    </li>
                    <li>
                        <HatenaShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <HatenaIcon size={32} round={true} />
                            <p className="text-center text-light">Hatena</p>
                        </HatenaShareButton>
                    </li>
                    <li>
                        <LinkedinShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <LinkedinIcon size={32} round={true} />
                            <p className="text-center text-light">LinkedIn</p>
                        </LinkedinShareButton>
                    </li>
                    <li>
                        <LineShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <LineIcon size={32} round={true} />
                            <p className="text-center text-light">Line</p>
                        </LineShareButton>
                    </li>
                    <li>
                        <LivejournalShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <LivejournalIcon size={32} round={true} />
                            <p className="text-center text-light">live jornal</p>
                        </LivejournalShareButton>
                    </li>
                    <li>
                        <OKShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <OKIcon size={32} round={true} />
                            <p className="text-center text-light">Ok</p>
                        </OKShareButton>
                    </li>
                    <li>
                        <PinterestShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <PinterestIcon size={32} round={true} />
                            <p className="text-center text-light">Pinterest</p>
                        </PinterestShareButton>
                    </li>
                    <li>
                        <PocketShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <PocketIcon size={32} round={true} />
                            <p className="text-center text-light">Pocket</p>
                        </PocketShareButton>
                    </li>
                    <li>
                        <RedditShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <RedditIcon size={32} round={true} />
                            <p className="text-center text-light">Redit</p>
                        </RedditShareButton>
                    </li>
                    <li>
                        <TumblrShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <TumblrIcon size={32} round={true} />
                            <p className="text-center text-light">Tumb</p>
                        </TumblrShareButton>
                    </li>
                    <li>
                        <ViberShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <ViberIcon size={32} round={true} />
                            <p className="text-center text-light">Viber</p>
                        </ViberShareButton>
                    </li>
                    <li>
                        <VKShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <TwitterIcon size={32} round={true} />
                            <p className="text-center text-light">VK</p>
                        </VKShareButton>
                    </li>
                    <li>
                        <WorkplaceShareButton className="tf-list-item d-flex flex-column gap-4 align-items-center">
                            <WorkplaceIcon size={32} round={true} />
                            <p className="text-center text-light">Workplace</p>
                        </WorkplaceShareButton>
                    </li>
                </ul>
            </div>
        </div>

    </div>
</div>
</div>
</>
    )
}

export default AddresScan
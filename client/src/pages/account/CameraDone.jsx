import React from 'react';
import lineqr from "../../images/banner/lineqr.png";

const CameraDone = () => {
if(!localStorage.getItem('email')){ location.href = '/login'; }
    $(document).ready(function () {
        window.setTimeout(function () {
            location.href = "/CameraSuccess";
        }, 4000)
    });

    return (
<>
    <div className="bg-camera">
        <div className="tf-container">
            <div className="pt-30 pb-30 position-relative">
                <div className="line-qr">
                    <img src={lineqr} alt="img" />
                </div>
                <div className="scan-done">
                    <a href="/CameraSuccess" className="circle-box xl bg-circle check-icon bg-primary"></a>
                </div>
            </div>


        </div>
    </div>
</>
    )
}

export default CameraDone
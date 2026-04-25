import { useNavigate } from "react-router-dom";
import lineqr from "../../images/banner/lineqr.png";

const FaceID = () => {
  const navigate = useNavigate();
  $(document).ready(function () {
    window.setTimeout(function () {
      navigate("/FaceIdDone");
    }, 4000);
  });
  return (
    <>
      <div className="bg-face">
        <div className="tf-container">
          <h5 className="mt-12 text-center text-secondary">
            Please look into the camera and hold still
          </h5>
          <div
            className="mt-8 pt-45 banner-scan-profile m--16 pb-16"
            style={{
              backgroundImage: `url('/src/images/banner/banner-faceId.png')`,
            }}
          >
            <div className="line-qr">
              <img src={lineqr} alt="img" />
            </div>
            <div className="box-noti-camera">
              <span className="icon-think icon"></span>
              <p className="text-large text-surface">
                Adjust your camera orientation to show your face clearly to
                finish.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FaceID;

import lineqr from "../../images/banner/lineqr.png";
import { useNavigate, Link } from "react-router-dom";

const FaceIdDone = () => {
  const navigate = useNavigate();
  $(document).ready(function () {
    window.setTimeout(function () {
      navigate("/VerificationDone");
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
            className="mt-8 pt-45 banner-scan-profile style-2 m--16 pb-16"
            style={{
              backgroundImage: `url('/src/images/banner/banner-faceId.png')`,
            }}
          >
            <div className="line-qr">
              <img src={lineqr} alt="img" />
            </div>
            <div className="overlay"></div>
            <div className="scan-done">
              <Link
                to="/VerificationDone"
                className="circle-box xl bg-circle check-icon bg-primary"
              ></Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FaceIdDone;

import { Link } from "react-router-dom";
import { useNavigate } from "react"
import lineqr from "../../images/banner/lineqr.png";

const CameraDone = () => {
  const navigate = useNavigate();

  if (!localStorage.getItem("email")) {
    navigate("/login");
  }
  $(document).ready(function () {
    window.setTimeout(function () {
      navigate("/CameraSuccess");
    }, 4000);
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
              <Link
                to="/CameraSuccess"
                className="circle-box xl bg-circle check-icon bg-primary"
              ></Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CameraDone;

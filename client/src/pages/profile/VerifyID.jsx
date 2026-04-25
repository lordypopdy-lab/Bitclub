import { Link } from "react-router-dom";

const VerifyID = () => {
  return (
    <>
      <div className="header fixed-top bg-surface d-flex justify-content-center align-items-center">
        <Link to="javascript:void(0);" className="left back-btn">
          <i className="icon-left-btn"></i>
        </Link>
        <h3>Verification</h3>
      </div>
      <div className="pt-45 pb-16">
        <div className="tf-container">
          <ul className="mt-4">
            <li>
              <h3>Verify your ID and selfie.</h3>
              <p className="text-small">
                To verify your identity and prevent fraud, you need to complete
                the following steps
              </p>
            </li>
            <li className="mt-20">
              <h3>Upload your ID</h3>
              <p className="text-small">
                Please make sure the issue and expiration dates on your ID, your
                name and date of birth are clear.
              </p>
            </li>
            <li className="mt-20">
              <h3>Take a selfie</h3>
              <p className="text-small">
                Please make sure the photo is taken in a well-lit space and
                shows your full face.
              </p>
            </li>
          </ul>
          <Link to="/VerifyIDScan" className="tf-btn lg secondary mt-40">
            Next
          </Link>
        </div>
      </div>
    </>
  );
};

export default VerifyID;

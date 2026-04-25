import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Contract = () => {
  const navigate = useNavigate();
  const toContractOne = async () => {
    const email = localStorage.getItem("email");
    try {
      const { data } = await axios.post("/getContractOne", { email });
      if (data.success && data.contractOne.status !== "Paused") {
        navigate("/ContractOneProfile");
      } else {
        navigate("/ContractOne");
      }
    } catch (error) {
      console.log(`Contract is yet to Activated!: ${error}`);
    }
  };

  const toContractTwo = async () => {
    const email = localStorage.getItem("email");
    try {
      const { data } = await axios.post("/getContractTwo", { email });
      if (data.success && data.contractOne.status !== "Paused") {
        navigate("/ContractTwoProfile");
      } else {
        navigate("/ContractTwo");
      }
    } catch (error) {
      console.log(`Contract is yet to Activated!: ${error}`);
    }
  };

  return (
    <ul>
      <li>
        <div
          className="accent-box-v5 p-0 bg-menuDark active"
          style={{ width: "100%" }}
        >
          <Link
            onClick={toContractOne}
            className="coin-item style-1 gap-12 bg-surface"
          >
            <span className="icon-box bg-transparent bg-icon1">
              <i className="icon-book"></i>
            </span>
            <div className="mt-12">
              <Link to="#" className="text-small">
                Contract <span style={{ color: "#25C866" }}>Class One</span>
              </Link>
              <p className="mt-4">
                Click Create and set up your collection. Add contract status, a
                description, price & contract icons, and set a secondary sales
                fee.{" "}
                <span style={{ color: "#25C866" }}>Contract level one+</span>
              </p>
            </div>
          </Link>
        </div>
      </li>
      <li className="mt-8">
        <div
          className="accent-box-v5 p-0 bg-menuDark"
          style={{ width: "100%" }}
        >
          <Link
            onClick={toContractTwo}
            className="coin-item style-1 gap-12 bg-surface"
          >
            <span className="icon-box bg-transparent bg-icon1">
              <i className="icon-book"></i>
            </span>
            <div className="mt-12">
              <Link to="#" className="text-small">
                Contract <span style={{ color: "#25C866" }}>Class two</span>
              </Link>
              <p className="mt-4">
                Click Create and set up your collection. Add contract status, a
                description, price & contract icons, and set a secondary sales
                fee.{" "}
                <span style={{ color: "#25C866" }}>Contract level two+</span>
              </p>
            </div>
          </Link>
        </div>
      </li>
      <li className="mt-8">
        <div
          className="accent-box-v5 p-0 bg-menuDark"
          style={{ width: "100%" }}
        >
          <Link
            onClick={() => navigate("/ContractThree")}
            className="coin-item style-1 gap-12 bg-surface"
          >
            <span className="icon-box bg-transparent bg-icon2">
              <i className="icon-wallet-money"></i>
            </span>
            <div className="mt-12">
              <Link to="#" className="text-small">
                Contract <span style={{ color: "#25C866" }}>Class three</span>
              </Link>
              <p className="mt-4">
                Click Create and set up your collection. Add contract status, a
                description, price & contract icons, and set a secondary sales
                fee.{" "}
                <span style={{ color: "#ab00e7" }}>Contract level three+</span>
              </p>
            </div>
          </Link>
        </div>
      </li>
      <li className="mt-8">
        <div
          className="accent-box-v5 p-0 bg-menuDark"
          style={{ width: "100%" }}
        >
          <Link
            onClick={() => navigate("/ContractFour")}
            className="coin-item style-1 gap-12 bg-surface"
          >
            <span className="icon-box bg-transparent bg-icon2">
              <i className="icon-wallet-money"></i>
            </span>
            <div className="mt-12">
              <Link to="#" className="text-small">
                Contract <span style={{ color: "#25C866" }}>Class four</span>
              </Link>
              <p className="mt-4">
                Click Create and set up your collection. Add contract status, a
                description, price & contract icons, and set a secondary sales
                fee.{" "}
                <span style={{ color: "#ab00e7" }}>Contract level four+</span>
              </p>
            </div>
          </Link>
        </div>
      </li>
    </ul>
  );
};

export default Contract;

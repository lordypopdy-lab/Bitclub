import React from 'react'
import axios from 'axios';

const Contract = () => {

    const toContractOne = async () => {
        const email = localStorage.getItem("email");
        try {
          const { data } = await axios.post("/getContractOne", { email });
          if (data.success && data.contractOne.status !== "Paused") {
            location.href = "/ContractOneProfile";
          } else {
            location.href = "/ContractOne";
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
            location.href = "/ContractTwoProfile";
          } else {
            location.href = "/ContractTwo";
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
        <a
          onClick={toContractOne}
          className="coin-item style-1 gap-12 bg-surface"
        >
          <span className="icon-box bg-transparent bg-icon1">
            <i className="icon-book"></i>
          </span>
          <div className="mt-12">
            <a href="#" className="text-small">
              Contract{" "}
              <span style={{ color: "#25C866" }}>Class One</span>
            </a>
            <p className="mt-4">
              Click Create and set up your collection. Add
              contract status, a description, price & contract
              icons, and set a secondary sales fee.{" "}
              <span style={{ color: "#25C866" }}>
                Contract level one+
              </span>
            </p>
          </div>
        </a>
      </div>
    </li>
    <li className="mt-8">
      <div
        className="accent-box-v5 p-0 bg-menuDark"
        style={{ width: "100%" }}
      >
        <a
          onClick={toContractTwo}
          className="coin-item style-1 gap-12 bg-surface"
        >
          <span className="icon-box bg-transparent bg-icon1">
            <i className="icon-book"></i>
          </span>
          <div className="mt-12">
            <a href="#" className="text-small">
              Contract{" "}
              <span style={{ color: "#25C866" }}>Class two</span>
            </a>
            <p className="mt-4">
              Click Create and set up your collection. Add
              contract status, a description, price & contract
              icons, and set a secondary sales fee.{" "}
              <span style={{ color: "#25C866" }}>
                Contract level two+
              </span>
            </p>
          </div>
        </a>
      </div>
    </li>
    <li className="mt-8">
      <div
        className="accent-box-v5 p-0 bg-menuDark"
        style={{ width: "100%" }}
      >
        <a
          href="/ContractThree"
          className="coin-item style-1 gap-12 bg-surface"
        >
          <span className="icon-box bg-transparent bg-icon2">
            <i className="icon-wallet-money"></i>
          </span>
          <div className="mt-12">
            <a href="#" className="text-small">
              Contract{" "}
              <span style={{ color: "#25C866" }}>
                Class three
              </span>
            </a>
            <p className="mt-4">
              Click Create and set up your collection. Add
              contract status, a description, price & contract
              icons, and set a secondary sales fee.{" "}
              <span style={{ color: "#ab00e7" }}>
                Contract level three+
              </span>
            </p>
          </div>
        </a>
      </div>
    </li>
    <li className="mt-8">
      <div
        className="accent-box-v5 p-0 bg-menuDark"
        style={{ width: "100%" }}
      >
        <a
          href="/ContractFour"
          className="coin-item style-1 gap-12 bg-surface"
        >
          <span className="icon-box bg-transparent bg-icon2">
            <i className="icon-wallet-money"></i>
          </span>
          <div className="mt-12">
            <a href="#" className="text-small">
              Contract{" "}
              <span style={{ color: "#25C866" }}>Class four</span>
            </a>
            <p className="mt-4">
              Click Create and set up your collection. Add
              contract status, a description, price & contract
              icons, and set a secondary sales fee.{" "}
              <span style={{ color: "#ab00e7" }}>
                Contract level four+
              </span>
            </p>
          </div>
        </a>
      </div>
    </li>
  </ul>
  )
}

export default Contract
import { Sparkline } from "../components/Sparkline";

export const DetailChartModal = ({ details, isOpen, onClose }) => {
  if (!details) return null;

  const price = !isNaN(Number(details.current_price))
    ? Number(details.current_price)
    : 0;

  const change = !isNaN(Number(details.pricePercentage))
    ? Number(details.pricePercentage)
    : 0;

  const isUp = change >= 0;

  return (
    <div
      className={`modal fade action-sheet ${isOpen ? "show" : ""}`}
      style={{ display: isOpen ? "block" : "none" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="box-detail-chart">
            {/* TOP */}
            <div className="top">
              <h3 className="d-flex align-items-center gap-8">
                {details.symbol?.toUpperCase()}/USD
                <i className="icon-clockwise2 fs-16 text-secondary"></i>
              </h3>

              <h2 className="mt-4">${price.toLocaleString()}</h2>

              <p className="mt-4">
                <a className={isUp ? "text-primary" : "text-red"}>
                  {change.toFixed(3)}%
                </a>
                &emsp;Last 24 hours
              </p>
            </div>

            {/* SPARKLINE */}
            <div
              style={{
                width: "100%",
                height: "80px",
                padding: "0 10px",
              }}
            >
              <Sparkline
                width={349}
                height={80}
                priceChangePercent={change}
                data={details.sparkline_in_7d || []} // live array from WalletView
              />
            </div>

            {/* CONTENT */}
            <div className="content mt-3">
              <div className="tab-content mt-8 mb-16">
                <div className="tab-pane fade show active" id="1d">
                  <div className="area-chart-2"></div>
                </div>
              </div>

              <ul className="tab-time">
                <li className="nav-item active">
                  <a
                    className="nav-link active"
                    data-bs-toggle="tab"
                    data-bs-target="#1d"
                  >
                    1D
                  </a>
                </li>
              </ul>
            </div>

            {/* BOTTOM */}
            <div className="bottom">
              <h6 className="text-button">Token information</h6>

              <ul className="mt-16 d-flex gap-16">
                <li className="flex-1">
                  <div className="accent-box-v6 bg-surface d-flex justify-content-between align-items-center">
                    <div className="content">
                      <p className="text-small">
                        {details.symbol?.toUpperCase()}{" "}
                        <span className="text-extra-small text-secondary">
                          / USD
                        </span>
                      </p>

                      <span
                        className={`d-inline-block text-light mt-8 coin-btn ${
                          isUp ? "increase" : "decrease"
                        }`}
                      >
                        {change.toFixed(3)}%
                      </span>
                    </div>
                  </div>
                </li>

                <li className="flex-1">
                  <div className="accent-box-v6 bg-surface d-flex justify-content-between align-items-center">
                    <div className="content">
                      <p className="text-small">{details.name}</p>

                      <span
                        className={`d-inline-block text-light mt-8 coin-btn ${
                          Number(details.ath_change_percentage) >= 0
                            ? "increase"
                            : "decrease"
                        }`}
                      >
                        {Number(details.ath_change_percentage).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </li>
              </ul>

              <button
                onClick={() => (location.href = "/Deposite")}
                className="mt-20"
              >
                Buy Assets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
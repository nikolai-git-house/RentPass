import React, { Component } from "react";
import "./index.css";
import { TerritoryOptions, CurrencyOptions } from "../../Utils/Constants";
class Package extends Component {
  render() {
    const {
      data,
      territory = TerritoryOptions[0],
      purchased,
      onSubscribe,
    } = this.props;
    const { caption, description, image, contents, type, price } = data;

    return (
      <div className="package_container">
        <div className="img_container">
          <div
            style={{
              width: "100%",
              height: 100,
              marginBottom: 10,
              backgroundImage: `url(${image})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <p className="caption">{caption}</p>
        </div>
        <p className="description">{description}</p>
        {contents && (
          <div className="package_content">
            {contents &&
              contents.split("\n").map((item, key) => {
                return <p key={key}>{item !== "-" ? item : ""}</p>;
              })}
          </div>
        )}

        <div
          style={{
            width: "100%",
          }}
        >
          <div className="d-flex flex-wrap justify-content-between">
            <div className="footer">
              <p
                style={{ fontWeight: "500", fontSize: 14, textAlign: "center" }}
              >
                {CurrencyOptions[territory]}
                {price} cost {type === 0 && "pcm"}
              </p>
            </div>
            <button
              className="btn"
              type="button"
              // data-toggle="modal"
              // data-target="#subscribe_modal"
              style={{
                marginTop: 10,
                backgroundColor: "#d5fec6",
              }}
              onClick={onSubscribe}
              disabled={purchased}
            >
              {type === 0 ? "Subscribe" : "Purchase"}
              {purchased && "d"}
            </button>
          </div>
          {/* <div className="footer">
            <p style={{ fontWeight: "500", fontSize: 14, textAlign: "center" }}>
              {footer_2}
            </p>
          </div> */}
        </div>
      </div>
    );
  }
}

export default Package;

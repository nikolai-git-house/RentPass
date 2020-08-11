import React, { Component } from "react";
import "./index.css";
class Package extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    this.setState({ data });
  }
  render() {
    const { data } = this.state;
    const {
      caption,
      description,
      image,
      contents,
      type,
      active,
      saleType,
      price,
    } = data;
    const { profile } = this.props;
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
                £{price} cost {type === 0 && "pcm"}
              </p>
            </div>
            <button
              className="btn"
              type="button"
              data-toggle="modal"
              data-target="#subscribe_modal"
              style={{
                marginTop: 10,
                backgroundColor: saleType === 0 ? "#bbffa8" : "#FFE366",
              }}
            >
              {saleType === 0 ? "Subscribe" : "Pre register"}
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

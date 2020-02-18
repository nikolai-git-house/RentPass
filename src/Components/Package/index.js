import React, { Component } from "react";
import "./index.css";
class Package extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
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
      footer_1,
      footer_2,
      image,
      contents,
      type,
      active
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
              backgroundPosition: "center"
            }}
          ></div>
          <p className="caption">{caption}</p>
        </div>
        <p className="description">{description}</p>
        {contents && (
          <div className="package_content">
            {contents &&
              contents.split("\n").map((item, key) => {
                return <p key={key}>{item}</p>;
              })}
          </div>
        )}

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around"
          }}
        >
          <div className="footer">
            <p style={{ fontWeight: "500", fontSize: 14, textAlign: "center" }}>
              {footer_1}
            </p>
          </div>
          <div className="footer">
            <p style={{ fontWeight: "500", fontSize: 14, textAlign: "center" }}>
              {footer_2}
            </p>
          </div>
        </div>
        {!profile && (
          <button
            className="btn"
            type="button"
            data-toggle="modal"
            data-target="#subscribe_modal"
            style={{
              marginTop: 10,
              backgroundColor: !active
                ? "#FFE366"
                : type
                ? "#bbffa8"
                : "#bbffa8"
            }}
          >
            {!active ? "Pre register" : type ? "Buy It" : "Subscribe"}
          </button>
        )}
        {profile && (
          <button
            className="btn"
            type="button"
            style={{
              marginTop: 10,
              backgroundColor: !active
                ? "#FFE366"
                : type
                ? "#bbffa8"
                : "#bbffa8"
            }}
          >
            {!active ? "Pre register" : type ? "Buy It" : "Subscribe"}
          </button>
        )}
      </div>
    );
  }
}

export default Package;

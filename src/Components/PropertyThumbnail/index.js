import React, { Component } from "react";
import Firebase from "../../firebasehelper";
import "./index.css";

const activeIcon = require("../../assets/media/property_status/active.png");
const pendingIcon = require("../../assets/media/property_status/pending.png");

class PropertyThumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {}
  render() {
    const { property, onRequestPropertyTest, isActive } = this.props;
    const { url, property_address } = property;
    const { first_address_line, second_address_line } = property_address;
    return (
      <div className="property-thumb">
        <div style={{ marginBottom: 10, width: "100%", height: "100%" }}>
          <img
            className="img-fluid options-item"
            src={url}
            alt=""
            width="100%"
          />
          <div className="options-overlay bg-black-75">
            <h6 className="text-white mb-2">{first_address_line}</h6>
            <h6 className="text-white mb-2">{second_address_line}</h6>
          </div>
        </div>
        <img
          src={isActive ? activeIcon : pendingIcon}
          className="property-status"
          alt="status"
        />
        <button
          className={`btn btn-warning`}
          style={{ width: "100%" }}
          onClick={onRequestPropertyTest}
        >
          Take A Profile Test
        </button>
      </div>
    );
  }
}
export default PropertyThumbnail;

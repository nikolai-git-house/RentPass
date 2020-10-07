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
  
  render() {
    const { property,Activate,Deactivate } = this.props;
    const { url, property_address,status,id } = property;
    const { line_1 ,county} = property_address;
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
            <h6 className="text-white mb-2">{county}</h6>
            <h6 className="text-white mb-2">{line_1}</h6>
          </div>
        </div>
        <img
          src={status==="active" ? activeIcon : pendingIcon}
          className="property-status"
          alt="status"
        />
        <button
          className={`btn ${status==="active"?"btn-warning":"btn-primary"}`}
          style={{ width: "100%" }}
          onClick={status==="active"?()=>Deactivate(id):()=>Activate(id)}
        >
          {status==="active"?"Deactivate":"Activate"}
        </button>
      </div>
    );
  }
}
export default PropertyThumbnail;

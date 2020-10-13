import React, { Component } from "react";
import "./index.css";
const standard_image=[require("../../assets/media/standard_property/1.png"),require("../../assets/media/standard_property/2.png"),
require("../../assets/media/standard_property/3.png"),require("../../assets/media/standard_property/4.png")];
const activeIcon = require("../../assets/media/property_status/active.png");
const pendingIcon = require("../../assets/media/property_status/pending.png");

class PropertyThumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    const { property,Activate,Deactivate,order } = this.props;
    const {property_address,status,id } = property;
    const { line_1 ,county} = property_address;
    return (
      <div className="property-thumb">
        <div style={{ marginBottom: 10, width: "100%", height: "100%" }}>
          <img
            className="img-fluid options-item"
            src={standard_image[order]}
            alt=""
            width="100%"
          />
          <div className="options-overlay bg-black-75">
            <h6 className="text-white mb-2">{county}</h6>
            <h6 className="text-white mb-2">{line_1}</h6>
            <p style={{marginBottom:0,color:status==="active"?"#00ff00":"#ff9900"}}>{status==="active"?"My active property":"Pending property"}</p>
          </div>
        </div>
        <img
          src={status==="active" ? activeIcon : pendingIcon}
          className="property-status"
          alt="status"
        />
        <button
          className={`btn ${status==="active"?"btn-activated":"btn-deactivated"}`}
          style={{ width: "100%" }}
          onClick={status==="active"?()=>Deactivate(id):()=>Activate(id)}
        >
          {status==="active"?"Deactivate as current residence":"Activate"}
        </button>
      </div>
    );
  }
}
export default PropertyThumbnail;

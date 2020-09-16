import React, { Component } from "react";
import Firebase from "../../firebasehelper";
import "./index.css";
const avatar_complete_img = require("../../assets/media/logo/avatar_complete.png");
const avatar_pending_img = require("../../assets/media/logo/avatar_pending.png");

class TenantThumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar_url: ""
    };
  }
  componentDidMount() {
    const { tenant, brand } = this.props;
    console.log("tenant in TenantThumbnail", tenant);
  }
  componentWillReceiveProps(nextProps) {}
  render() {
    const { tenant, brand, onClick } = this.props;
    const { avatar_url, accepted } = tenant;
    return (
      <div className="tenant-thumb" onClick={onClick}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundImage: `url(${
              avatar_url
                ? avatar_url
                : accepted
                ? avatar_complete_img
                : avatar_pending_img
            })`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="caption-bar">
            <p className="name">{tenant.firstname}</p>
            <p className="address">{tenant.property_name}</p>
            {/* {!accepted && <p className="pending">Pending</p>}
            {accepted && <p className="active">Active</p>} */}
            {/* <p className="address">{tenant.property_address}</p> */}
          </div>
        </div>
      </div>
    );
  }
}
export default TenantThumbnail;

import React, { Component } from "react";
import Firebase from "../../firebasehelper";
import "./index.css";
const standard_image=[require("../../assets/media/standard_property/1.png"),require("../../assets/media/standard_property/2.png"),
require("../../assets/media/standard_property/3.png"),require("../../assets/media/standard_property/4.png")];
const activeIcon = require("../../assets/media/property_status/active.png");
const pendingIcon = require("../../assets/media/property_status/pending.png");
const avatar_complete_img = require("../../assets/media/logo/avatar_complete.png");
const avatar_pending_img = require("../../assets/media/logo/avatar_pending.png");
class PropertyThumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      property:this.props.property,
      property_address:{line_1:""},
      image_url:""
    };
  }
  componentDidMount(){
    const {brand,id} = this.state.property;
    if(brand){
      Firebase.getPropertyById(id,brand).then(res=>{
        console.log("property profile",res);
        const {property_address,url} = res;
        this.setState({property_address,image_url:url});
      })
    }
    else{
      const {property_address} = this.state.property;
      this.setState({property_address});
    }
  }
  render() {
    
    const {order,showHousemates } = this.props;
    const {property_address,property,image_url } = this.state;
    let line_1= property_address.line_1 || "";
    return (
      <div className="property-thumb">
        <div className="property-pad" onClick={showHousemates} >
          <img
            className="img-fluid options-item"
            src={image_url?image_url:standard_image[order]}
            alt=""
            width="100%"
          />
          <div className="options-overlay bg-black-75">
            <h6 className="text-white mb-2">{line_1}</h6>
            <p style={{marginBottom:0,color:property.status==="active"?"#00ff00":"#ff9900"}}>{property.status==="active"?"My active property":"Wishlisted property"}</p>
          </div>
        </div>
        <img
          src={property.status==="active" ? activeIcon : pendingIcon}
          className="property-status"
          alt="status"
        />
      </div>
    );
  }
}
export default PropertyThumbnail;

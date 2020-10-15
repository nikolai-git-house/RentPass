import React, { Component } from "react";
import Firebase from "../../../firebasehelper";
import "./index.css";
const avatar_complete_img = require("../../../assets/media/logo/avatar_complete.png");
const avatar_pending_img = require("../../../assets/media/logo/avatar_pending.png");
const employment_img = require("../../../assets/media/icons/rent_profile/employment.png");
const right_img = require("../../../assets/media/icons/rent_profile/right_to_rent.png");
const credit_img = require("../../../assets/media/icons/rent_profile/credit_affordability.png");
const rental_img = require("../../../assets/media/icons/rent_profile/rental_history.png");
const pets_img = require("../../../assets/media/icons/rent_profile/pets.png");
const pending_img = require("../../../assets/media/icons/pending.png");
const error_img = require("../../../assets/media/icons/rent_profile/error.png");

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

class Housemate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar_url: ""
    };
  }
  componentDidMount() {
    const { profile } = this.props;
    this.setState({ profile });
  }
  componentWillReceiveProps(nextProps) {
    const { profile } = nextProps;
    this.setState({ profile });
  }
  render() {
    const { profile ,self,active,showProfile} = this.props;
    const { firstname } = profile;
    return (
      
        <div className="housemate-view" onClick={showProfile}>
          <img
            src={active?avatar_complete_img:avatar_pending_img}
            width="200"
            alt="avatar"
          />
          <div className="info">
            <p>{self?"Me":`${firstname}`}</p>
          </div>
        </div>
      
    );
  }
}
export default Housemate;

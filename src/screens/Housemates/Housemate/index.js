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
    console.log("profile in componentDidMount", profile);
    this.setState({ profile });
  }
  componentWillReceiveProps(nextProps) {
    const { profile } = nextProps;
    this.setState({ profile });
  }
  showStatuses = () => {
    const { profile } = this.props;
    const { status } = profile;
    if (status) {
      let array = Object.values(status);
      let key_array = Object.keys(status);
      return array.map((item, index) => {
        return (
          <div className="housemate_row">
            <p>{key_array[index].toUpperCase().replaceAll("_", " ")}</p>
            <p>
              {item === "none" ? (
                <img src={pending_img} width="30" alt="status" />
              ) : (
                <img src={pending_img} width="30" alt="status" />
              )}
            </p>
          </div>
        );
      });
    }

    console.log("status", status);
  };
  render() {
    const { profile } = this.props;
    const { avatar_url, phonenumber, firstname, accepted } = profile;
    let active = accepted ? "(active)" : "(pending)";
    return (
      <div className="housemate-view">
        <div className="privateinfo_row">
          <img
            src={avatar_url ? avatar_url : avatar_pending_img}
            width="50"
            alt="avatar"
          />
          <div className="info">
            <p>{phonenumber}</p>
            <p>{`${firstname} ${active}`}</p>
          </div>
        </div>
        {this.showStatuses()}
        {/* <div className="housemate_row">
          <div className="description">
            <img src={employment_img} width="30" alt="Employment"></img>
            <p>Employment</p>
          </div>
          <img src={error_img} width="30" alt="cross"></img>
        </div>
        <div className="housemate_row">
          <div className="description">
            <img src={right_img} width="30" alt="RightToRent"></img>
            <p>Right to Rent</p>
          </div>
          <img src={error_img} width="30" alt="cross"></img>
        </div>
        <div className="housemate_row">
          <div className="description">
            <img src={credit_img} width="30" alt="Credit"></img>
            <p>Credit & Affordability</p>
          </div>
          <img src={error_img} width="30" alt="cross"></img>
        </div>
        <div className="housemate_row">
          <div className="description">
            <img src={rental_img} width="30" alt="Rental History"></img>
            <p>Rental History</p>
          </div>
          <img src={error_img} width="30" alt="cross"></img>
        </div> */}
      </div>
    );
  }
}
export default Housemate;

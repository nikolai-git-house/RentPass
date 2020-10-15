import React from "react";
import Modal from "react-modal";
import moment from "moment";
import { connect } from "react-redux";
import Firebase from "../../firebasehelper";
import "./index.css";
const user_img = require("../../assets/media/logo/avatar_pending.png");
const phone_img = require("../../images/profile/phone.png");
const heart_img = require("../../images/profile/heart.png");
const profession_img = require("../../images/profile/profession.png");
const firstname_img = require("../../images/profile/firstname.png");
const lastname_img = require("../../images/profile/secondname.png");
const salary_img = require("../../images/profile/growth.png");
const UKIcon = require("../../images/profile/uk.png");
const USAIcon = require("../../images/profile/usa.png");
const IrelandIcon = require("../../images/profile/ireland.png");
const CanadaIcon = require("../../images/profile/canada.png");
const ApproveIcon = require("../../images/profile/done.png");

const identity_img = require("../../images/profile/identity.png");
const credit_img = require("../../images/profile/credit.png");
const final_img = require("../../images/profile/final_decision.png");
const rental_img = require("../../images/profile/rental.png");
const employment_img = require("../../images/profile/employment.png");
const pause_img = require("../../images/profile/pause.png");

const TerritoryIcon = {
  UK: UKIcon,
  Ireland: IrelandIcon,
  USA: USAIcon,
  Canada: CanadaIcon,
};
const Styles = {
  control: (styles) => ({ ...styles, width:"90%" }),
};
function _calculateAge(birthday) {
  // birthday is a date
  if (!birthday) return null;
  const age = birthday
    ? moment().diff(
        isNaN(new Date(birthday).getTime())
          ? moment(birthday, "DD/MM/YYYY")
          : new Date(birthday),
        "years"
      )
    : "";

  return age;
}
class TenantStatus extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      profile: {}
    };
  }
  async componentDidUpdate(prevProps,prevState){
    if(prevProps.housemate!==this.props.housemate){
      const { housemate,active } = this.props;
      let renter_id = housemate.renter_id;
      let renter = await Firebase.getRenterById(renter_id);
      let profile = await Firebase.getEcoUserbyId(renter.eco_id);
      console.log("profile",profile);
      this.setState({ profile,active });
    }
  }
  showStatuses = () => {
    const { profile,active } = this.state;
    return (
      <div id="profile-container" className="row no-gutters">
          <div
            className={`row no-gutters mobile-show`}
            style={{ background: "#fff", overflowY: "auto" }}
          >
            <div
              className="col-md-5 col-lg-5 col-xl-5"
              style={{ padding: 15, overflow: "visible" }}
            >
              <div className="content">
                <div className="personal_profile">
                  <div
                    className="personal_profile__avatar"
                    style={{
                      backgroundImage: `url(${profile.avatar_url?profile.avatar_url:user_img})`,
                    }}
                  ></div>
                  <div className="icons-container">
                    <img src={ApproveIcon} alt="active" />
                    <img src={TerritoryIcon["UK"]} alt="flag" />
                  </div>
                </div>

                <div className="personal-view">
                  <div className="row_item">
                    <img src={firstname_img} width="30" alt="firstname"></img>
                    <p>{profile.firstname}</p>
                  </div>
                  <div className="row_item">
                    <img src={lastname_img} width="30" alt="secondname"></img>
                    <p className="row_item_value">
                      {profile.secondname?profile.secondname:"SecondName"}
                    </p>
                  </div>
                  <div className="row_item">
                    <img src={phone_img} width="30" alt="phonenumber"></img>
                    <p>{profile.phonenumber}</p>
                  </div>
                  <div className="row_item">
                    <img src={heart_img} width="30" alt="age"></img>
                    <p className="row_item_value">
                      {`Age: ${_calculateAge(profile.dob) || ""}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {!active&&<div className="col-md-7 col-lg-7 col-xl-7" style={{ padding: 15 }}>
              <div className="content">
                <div className="block-fx-pop">
                  <div className="renting-view">
                    <div className="row_editable_item">
                      <img src={profession_img} width="30" alt="profession"></img>
                      <p className="row_item_value">
                          Profession
                      </p>
                    </div>
                    <div className="row_editable_item">
                      <img src={salary_img} width="30" alt="monthly_wages"></img>
                      <p className="row_item_value">
                          Montly Salary
                      </p>
                    </div>
                    <div className="row_editable_item">
                      <img src={identity_img} width="30" alt="identity"></img>
                      <p className="row_item_value">Identity & right to rent</p>
                      <div className="edit">
                        <img src={pause_img} alt="pause" />
                      </div>
                    </div>
                    <div className="row_editable_item">
                      <img src={credit_img} width="30" alt="credit"></img>
                      <p className="row_item_value">Credit</p>
                      <div className="edit">
                        <img src={pause_img} alt="pause" />
                      </div>
                    </div>
                    <div className="row_editable_item">
                      <img src={employment_img} width="30" alt="employment"></img>
                      <p className="row_item_value">
                        Employment & affordability
                      </p>
                      <div className="edit">
                        <img src={pause_img} alt="pause" />
                      </div>
                    </div>
                    <div className="row_editable_item">
                      <img src={rental_img} width="30" alt="rental_history"></img>
                      <p className="row_item_value">Rental history</p>
                      <div className="edit">
                        <img src={pause_img} alt="pause" />
                      </div>
                    </div>
                    <div className="row_editable_item">
                      <img src={final_img} width="30" alt="overall_discussion"></img>
                      <p className="row_item_value">Overall decision</p>
                      <div className="edit">
                        <img src={pause_img} alt="pause" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          </div>
      </div>
    );
  };
  render() {
    const { showModal, toggleModal } = this.props;
    const {active} = this.state;
    return (
      <Modal
        className={`tenant-modal`}
        closeTimeoutMS={200}
        isOpen={showModal}
        contentLabel="modal"
        onRequestClose={toggleModal}
        styles={{Styles}}
      >
        <div className="modal-header">
          <button type="button" className="close" onClick={toggleModal}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body pb-1">
          {showModal && this.showStatuses()}
        </div>
      </Modal>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
    properties: state.properties,
    brand: state.brand,
    users: state.users
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(TenantStatus);

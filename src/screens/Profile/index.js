import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import ReactSelect from "react-select";
import loadImage from "blueimp-load-image";
import "./index.css";
import Firebase from "../../firebasehelper";
import { saveProfile } from "../../redux/actions";
const superskills = require("./superskills.json");
const professions = require("./professions.json");
const age_img = require("../../assets/media/icons/personal_profile/user.png");
const error_img = require("../../assets/media/icons/rent_profile/error.png");
const user_img = require("../../assets/media/logo/avatar_pending.png");
const pending_img = require("../../assets/media/icons/pending.png");
const phone_img = require("../../images/profile/phone.png");
const heart_img = require("../../images/profile/heart.png");
const profession_img = require("../../images/profile/profession.png");
const firstname_img = require("../../images/profile/firstname.png");
const lastname_img = require("../../images/profile/secondname.png");
const superhero_img = require("../../images/profile/superhero.png");
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

const Styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: 14,
  }),
};

const TerritoryIcon = {
  UK: UKIcon,
  Ireland: IrelandIcon,
  USA: USAIcon,
  Canada: CanadaIcon,
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

window.addEventListener("message", (data) => {
  console.log("msg received");
  const msg = JSON.parse(data.data);
  console.log("msg", msg);
});

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      viewMode: "profile",
    };
  }
  componentDidMount() {
    const { uid, profile } = this.props;
    console.log("uid", uid);
    if (!uid) this.props.history.push("/");
    console.log("profile", profile);
    this.setState({ profile });
  }
  componentWillReceiveProps(nextProps) {
    const { profile } = nextProps;
    this.setState({ profile });
  }
  startTrial = () => {
    this.props.history.push("properties");
  };
  openRentRobot = () => {
    this.props.history.push("/referencing");
  };

  changeProfileData = async (field, value) => {
    const { profile } = this.state;
    const { uid, brand, dispatch } = this.props;
    let brand_name = brand.name;
    try {
      const newProfile = { ...profile };
      newProfile[field] = value;
      localStorage.setItem("rentkey_profile", JSON.stringify(newProfile));
      this.setState({ profile: newProfile });
      this.props.dispatch(saveProfile(newProfile));
      console.log(field, value);
      console.log({
        [field]: value,
      });
      await Firebase.updateUserById(uid, brand_name, {
        [field]: value,
      });
    } catch (e) {
      console.log(e);
    }
  };

  onChangeProfileData = (field) => {
    const { editfield, editValue, profile } = this.state;
    if (field === editfield) {
      this.changeProfileData(field, editValue);
      this.setState({ editfield: "" });
    } else {
      this.setState({ editfield: field, editValue: profile[field] || "" });
    }
  };

  selectedFile = async (e) => {
    const { uid, brand } = this.props;
    let brand_name = brand.name;
    let _this = this;
    if (e.target.files && e.target.files[0]) {
      var content = e.target.files[0];
      loadImage.parseMetaData(content, function (data) {
        //default image orientation
        var orientation = 0;
        if (data.exif) {
          orientation = data.exif.get("Orientation");
        }
        loadImage(
          content,
          async function (canvas) {
            var base64data = canvas.toDataURL("image/png");
            var img_src = base64data.replace(/^data\:image\/\w+\;base64\,/, "");
            _this.setState({ content: img_src });
            console.log("content", img_src);
            let avatar_url = await Firebase.addAvatar(uid, img_src);
            console.log("avatar_url", avatar_url);
            Firebase.updateUserById(uid, brand_name, {
              avatar_url: avatar_url,
            });
            let img_content = "data:image/jpeg;base64," + img_src;
            _this.setState({ img_content });
          },
          {
            canvas: true,
            meta: true,
          }
        );
      });
    }
  };
  render() {
    const { profile, img_content, viewMode, editfield, editValue } = this.state;
    const { brand, uid } = this.props;
    let {
      avatar_url,
      firstname,
      surname,
      phonenumber,
      dob,
      profession,
      salary,
      super_skill,
    } = profile;
    if (!avatar_url) avatar_url = user_img;
    let brand_name = brand.name;
    brand_name = (brand_name || "").replace(/\s/g, "");

    const territory = (phonenumber || "").startsWith("+1") ? "USA" : "UK";
    console.log(profile);
    return (
      <div id="profile-container" className="row no-gutters">
        <div className="view-controls">
          <button
            className={`btn btn-switch ${
              viewMode === "profile" ? "active" : ""
            }`}
            onClick={() => this.setState({ viewMode: "profile" })}
          >
            Profile
          </button>
          <button
            className={`btn btn-switch ${
              viewMode !== "profile" ? "active" : ""
            }`}
            style={{ marginLeft: 5 }}
            onClick={() => this.setState({ viewMode: "referencing" })}
          >
            Referencing
          </button>
        </div>
        <div
          className={`row no-gutters ${
            this.state.viewMode !== "profile" ? "mobile-hide" : "mobile-show"
          }`}
          style={{ background: "#fff" }}
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
                    backgroundImage: `url(${
                      img_content ? img_content : avatar_url
                    })`,
                  }}
                  onClick={() => {
                    this.refs.fileUploader.click();
                  }}
                ></div>
                <div className="icons-container">
                  {/* {userstatus === "Active" ? (
                      <img src={ApproveIcon} alt="active" />
                    ) : (
                      <div />
                    )} */}
                  <img src={ApproveIcon} alt="active" />
                  <img src={TerritoryIcon[territory]} alt="flag" />
                </div>
              </div>

              <div className="personal-view">
                <div className="row_item">
                  <img src={firstname_img} width="30" alt="firstname"></img>
                  <p>{firstname}</p>
                </div>
                <div className="row_item">
                  <img src={lastname_img} width="30" alt="surname"></img>
                  <p className="row_item_value">
                    {editfield === "surname" ? (
                      <input
                        className="input_box"
                        value={editValue}
                        onChange={(e) =>
                          this.setState({ editValue: e.target.value })
                        }
                      ></input>
                    ) : (
                      surname || "Surname"
                    )}
                  </p>
                  <div
                    className="edit"
                    onClick={() => this.onChangeProfileData("surname")}
                  >
                    <i
                      className={
                        editfield === "surname"
                          ? "si si-check"
                          : "si si-settings"
                      }
                    />
                  </div>
                </div>
                <div className="row_item">
                  <img src={phone_img} width="30" alt="phonenumber"></img>
                  <p>{phonenumber}</p>
                </div>
                <div className="row_item">
                  <img src={heart_img} width="30" alt="age"></img>
                  <p className="row_item_value">
                    {editfield === "dob" ? (
                      <input
                        className="input_box"
                        type="date"
                        value={editValue}
                        onChange={(e) =>
                          this.setState({ editValue: e.target.value })
                        }
                      ></input>
                    ) : (
                      `Age: ${_calculateAge(dob) || ""}`
                    )}
                  </p>
                  <div
                    className="edit"
                    onClick={() => this.onChangeProfileData("dob")}
                  >
                    <i
                      className={
                        editfield === "dob" ? "si si-check" : "si si-settings"
                      }
                    />
                  </div>
                </div>
                {/* <div className="row_item">
                  <img src={profession_img} width="30" alt="profession"></img>
                  <p className="row_item_value">
                    {editfield === "profession" ? (
                      <div style={{ flex: 1 }}>
                        <ReactSelect
                          value={{ label: editValue, value: editValue }}
                          onChange={(e) => {
                            this.setState({ editValue: e.value });
                          }}
                          options={professions.map((obj) => ({
                            value: obj,
                            label: obj,
                          }))}
                          isSearchable={false}
                          styles={Styles}
                        ></ReactSelect>
                      </div>
                    ) : (
                      profession || "Profession"
                    )}
                  </p>
                  <div
                    className="edit"
                    onClick={() => this.onChangeProfileData("profession")}
                  >
                    <i
                      className={
                        editfield === "profession"
                          ? "si si-check"
                          : "si si-settings"
                      }
                    />
                  </div>
                </div>
                <div className="row_item">
                  <img src={superhero_img} width="30" alt="super_skill"></img>
                  <p className="row_item_value">
                    {editfield === "super_skill" ? (
                      <div style={{ flex: 1 }}>
                        <ReactSelect
                          value={{ label: editValue, value: editValue }}
                          onChange={(e) => {
                            this.setState({ editValue: e.value });
                          }}
                          options={superskills.map((obj) => ({
                            value: obj,
                            label: obj,
                          }))}
                          isSearchable={false}
                          styles={Styles}
                        ></ReactSelect>
                      </div>
                    ) : (
                      super_skill || "Super Skill"
                    )}
                  </p>
                  <div
                    className="edit"
                    onClick={() => this.onChangeProfileData("super_skill")}
                  >
                    <i
                      className={
                        editfield === "super_skill"
                          ? "si si-check"
                          : "si si-settings"
                      }
                    />
                  </div>
                </div>
                <div className="row_item">
                  <img src={salary_img} width="30" alt="salary"></img>
                  <p className="row_item_value">
                    £{" "}
                    {editfield === "salary" ? (
                      <input
                        className="input_box"
                        value={editValue}
                        onChange={(e) =>
                          this.setState({ editValue: e.target.value })
                        }
                      ></input>
                    ) : (
                      salary || "Monthly Salary"
                    )}
                  </p>
                  <div
                    className="edit"
                    onClick={() => this.onChangeProfileData("salary")}
                  >
                    <i
                      className={
                        editfield === "salary"
                          ? "si si-check"
                          : "si si-settings"
                      }
                    />
                  </div>
                </div> */}
                <input
                  type="file"
                  id="example-file-input"
                  ref="fileUploader"
                  name="example-file-input"
                  hidden
                  accept="image/*"
                  onChange={this.selectedFile}
                />
              </div>
            </div>
          </div>
          <div className="col-md-7 col-lg-7 col-xl-7" style={{ padding: 15 }}>
            <div className="content">
              <div className="block-fx-pop">
                <div className="renting-view">
                  <div className="row_editable_item">
                    <img src={profession_img} width="30" alt="profession"></img>
                    <p className="row_item_value">
                      {editfield === "profession" ? (
                        <div style={{ flex: 1 }}>
                          <ReactSelect
                            value={{ label: editValue, value: editValue }}
                            onChange={(e) => {
                              this.setState({ editValue: e.value });
                            }}
                            options={professions.map((obj) => ({
                              value: obj,
                              label: obj,
                            }))}
                            isSearchable={false}
                            styles={Styles}
                          ></ReactSelect>
                        </div>
                      ) : (
                        profession || "Profession"
                      )}
                    </p>
                    <div
                      className="edit"
                      onClick={() => this.onChangeProfileData("profession")}
                    >
                      <i
                        className={
                          editfield === "profession"
                            ? "si si-check"
                            : "si si-settings"
                        }
                      />
                    </div>
                  </div>
                  <div className="row_editable_item">
                    <img src={salary_img} width="30" alt="salary"></img>
                    <p className="row_item_value">
                      £{" "}
                      {editfield === "salary" ? (
                        <input
                          className="input_box"
                          value={editValue}
                          onChange={(e) =>
                            this.setState({ editValue: e.target.value })
                          }
                        ></input>
                      ) : (
                        salary || "Monthly Salary"
                      )}
                    </p>
                    <div
                      className="edit"
                      onClick={() => this.onChangeProfileData("salary")}
                    >
                      <i
                        className={
                          editfield === "salary"
                            ? "si si-check"
                            : "si si-settings"
                        }
                      />
                    </div>
                  </div>
                  <div className="row_editable_item">
                    <img src={identity_img} width="30" alt="salary"></img>
                    <p className="row_item_value">Identity & right to rent</p>
                    <div className="edit">
                      <img src={pause_img} alt="pause" />
                    </div>
                  </div>
                  <div className="row_editable_item">
                    <img src={credit_img} width="30" alt="salary"></img>
                    <p className="row_item_value">Credit</p>
                    <div className="edit">
                      <img src={pause_img} alt="pause" />
                    </div>
                  </div>
                  <div className="row_editable_item">
                    <img src={employment_img} width="30" alt="salary"></img>
                    <p className="row_item_value">Employment, affordability & income</p>
                    <div className="edit">
                      <img src={pause_img} alt="pause" />
                    </div>
                  </div>
                  <div className="row_editable_item">
                    <img src={rental_img} width="30" alt="salary"></img>
                    <p className="row_item_value">Rental history</p>
                    <div className="edit">
                      <img src={pause_img} alt="pause" />
                    </div>
                  </div>
                  <div className="row_editable_item">
                    <img src={final_img} width="30" alt="salary"></img>
                    <p className="row_item_value">Overall decision</p>
                    <div className="edit">
                      <img src={pause_img} alt="pause" />
                    </div>
                  </div>
                  {/* <div className="row_item">
                    <p>KYC</p>
                    <img src={pending_img} width="30" alt="cross"></img>
                  </div>
                  <div className="row_item">
                    <p>Credit Rating</p>
                    <img src={pending_img} width="30" alt="cross"></img>
                  </div>
                  <div className="row_item">
                    <p>Right to Rent</p>
                    <img src={pending_img} width="30" alt="cross"></img>
                  </div>
                  <div className="row_item">
                    <p>Employer</p>
                    <img src={pending_img} width="30" alt="cross"></img>
                  </div>
                  <div className="row_item">
                    <p>Accountant</p>
                    <img src={pending_img} width="30" alt="cross"></img>
                  </div>
                  <div className="row_item">
                    <p>Affordability</p>
                    <img src={pending_img} width="30" alt="cross"></img>
                  </div>
                  <div className="row_item">
                    <p>Rental history</p>
                    <img src={pending_img} width="30" alt="cross"></img>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`col-md-10 col-lg-10 col-xl-10 ${
            this.state.viewMode === "profile" ? "mobile-hide" : ""
          }`}
          style={{ padding: 15, flex: 1, alignSelf: "center" }}
        >
          <iframe
            src={`https://rentrobot.io/${brand_name}?uid=${uid}`}
            title="rent robot"
            className="rentbot-iframe"
          />
        </div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
function mapStateToProps(state) {
  return {
    brand: state.brand,
    uid: state.uid,
    profile: state.profile,
    renters: state.renters,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);

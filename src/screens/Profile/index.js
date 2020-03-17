import React from "react";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import loadImage from "blueimp-load-image";
import "./index.css";
import Firebase from "../../firebasehelper";
const phone_img = require("../../assets/media/icons/personal_profile/phone.png");
const age_img = require("../../assets/media/icons/personal_profile/user.png");
const profession_img = require("../../assets/media/icons/personal_profile/suitcase.png");
const salary_img = require("../../assets/media/icons/personal_profile/growth.png");
const error_img = require("../../assets/media/icons/rent_profile/error.png");
const user_img = require("../../assets/media/logo/avatar_pending.png");
const pending_img = require("../../assets/media/icons/pending.png");
window.addEventListener("message", data => {
  console.log("msg received");
  const msg = JSON.parse(data.data);
  console.log("msg", msg);
});

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {}
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
  selectedFile = async e => {
    const { uid, brand } = this.props;
    let brand_name = brand.name;
    let _this = this;
    if (e.target.files && e.target.files[0]) {
      var content = e.target.files[0];
      loadImage.parseMetaData(content, function(data) {
        //default image orientation
        var orientation = 0;
        if (data.exif) {
          orientation = data.exif.get("Orientation");
        }
        loadImage(
          content,
          async function(canvas) {
            var base64data = canvas.toDataURL("image/png");
            var img_src = base64data.replace(/^data\:image\/\w+\;base64\,/, "");
            _this.setState({ content: img_src });
            console.log("content", img_src);
            let avatar_url = await Firebase.addAvatar(uid, img_src);
            console.log("avatar_url", avatar_url);
            Firebase.updateUserById(uid, brand_name, {
              avatar_url: avatar_url
            });
            let img_content = "data:image/jpeg;base64," + img_src;
            _this.setState({ img_content });
          },
          {
            canvas: true,
            orientation: orientation
          }
        );
      });
    }
  };
  render() {
    const { profile, img_content } = this.state;
    const { brand } = this.props;
    console.log("brand", brand);
    console.log("profile in render", profile);
    let { avatar_url, firstname, phonenumber, dob, property_name } = profile;
    if (!avatar_url) avatar_url = user_img;
    return (
      <div id="home-container" className="row no-gutters flex-md-10-auto">
        <div
          className="col-md-5 col-lg-5 col-xl-5"
          style={{ padding: 15, overflow: "auto" }}
        >
          <div className="content">
            <div className="personal_profile">
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  marginRight: 10,
                  backgroundImage: `url(${
                    img_content ? img_content : avatar_url
                  })`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "contain"
                }}
                onClick={() => {
                  this.refs.fileUploader.click();
                }}
              ></div>
              <p>
                {ReactHtmlParser(
                  `<b>${firstname}'s</b> <br /> Personal Profile`
                )}
              </p>
            </div>

            <div className="personal-view">
              <div className="row_item">
                <img src={phone_img} width="30" alt="phonenumber"></img>
                <p>{phonenumber}</p>
              </div>
              <div className="row_item">
                <img src={age_img} width="30" alt="age"></img>
                <p>Age</p>
              </div>
              <div className="row_item">
                <img src={profession_img} width="30" alt="profession"></img>
                <p>Profession</p>
              </div>
              <div className="row_item">
                <img src={salary_img} width="30" alt="salary"></img>
                <p>Annual Salary</p>
              </div>
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
        <div className="col-md-5 col-lg-5 col-xl-5" style={{ padding: 15 }}>
          <div className="content">
            <div className="block-fx-pop">
              <button
                type="button"
                style={{
                  marginBottom: 10,
                  backgroundColor: "#ecedee",
                  width: "100%",
                  height: 50,
                  border: "none",
                  fontWeight: "400",
                  marginBottom: 30
                }}
              >
                Renting Profile
              </button>
              <div className="renting-view">
                <h2>Reference Profile Test</h2>
                <div className="row_item">
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
                </div>
                <h2>Requests</h2>
                <div className="row_item">
                  <p>Rent with pets</p>
                  <img src={pending_img} width="30" alt="cross"></img>
                </div>
                <div className="row_item">
                  <p>Rent without a deposit</p>
                  <img src={pending_img} width="30" alt="cross"></img>
                </div>
                <div className="row_item">
                  <p>Rent a serviced home</p>
                  <img src={pending_img} width="30" alt="cross"></img>
                </div>
                <button
                  style={{ backgroundColor: "#a9ffc6" }}
                  onClick={this.openRentRobot}
                >
                  Take the test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    brand: state.brand,
    uid: state.uid,
    profile: state.profile,
    renters: state.renters
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);

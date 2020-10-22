import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Firebase from "../../firebasehelper";
import { doSMS } from "../../functions/Auth";
import {
  saveUID,
  saveProfile,
  saveProperties,
  saveGroups,
  saveUsers,
  saveBrand,
  saveHousemates,
} from "../../redux/actions";
import "./index.css";
import logoImg from "../../images/login/logo.png";
class LogIn extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      number_panel: true,
      phonenumber: "",
      pin: "",
      sms: "",
      send_sms: false,
    };
    this.onChangeHandler.bind(this);
  }
  async componentDidMount() {
    // let uid = localStorage.getItem("rentkey_uid");
    // let profile = localStorage.getItem("rentkey_profile");
    // let brand_data = localStorage.getItem("rentkey_brand_data");
    // let users = localStorage.getItem("rentkey_users");
    // if (uid) {
    //   this.props.dispatch(saveUID(uid));
    //   this.props.dispatch(saveProfile(JSON.parse(profile)));
    //   this.props.dispatch(saveBrand(JSON.parse(brand_data)));
    //   this.props.dispatch(saveUsers(JSON.parse(users)));
    //   this.props.history.push("/explore");
    //   console.log("uid", uid);
    //   console.log("profile", profile);
    //   console.log("brand_data", JSON.parse(brand_data));
    //   console.log("users", JSON.parse(users));
    // }
  }
  componentWillUnmount() {
    //this.unsubscribeUsers();
  }
  createPincode = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };
  clearZero = function (str) {
    if (str.charAt(0) === "0") str = str.replace("0", "");
    return str;
  };
  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  start = async (profile) => {
    let renter_id = profile.renter_id;
    this.unsubscribeGroups = Firebase.firestore()
      .collection("Rental Community")
      .doc("data")
      .collection("group")
      .onSnapshot(async (snapshot) => {
        let linked_groups = await Firebase.getAllGroupswithRenter(renter_id);
        this.props.dispatch(saveGroups(linked_groups));
        let promises = linked_groups.map(async group=>{
          let property_id = group.property_id;
          let property = await Firebase.getProperty(property_id);
          property.id = property_id;
          property.status = group.status;
          property.group_id = group.id;
          return property;
        });
        Promise.all(promises).then(res=>{
          console.log("properties",res);
          this.props.dispatch(saveProperties(res));
        })
    });
    // this.unsubscribeProperties = Firebase.firestore()
    //   .collection("Rental Community")
    //   .doc("data")
    //   .collection("property")
    //   .onSnapshot(async (snapshot) => {
    //     let linked_properties = await Firebase.getAllRentersProperties(renter_id);
    //     let properties = [];
    //     linked_properties.map(property=>{
    //       if(property.status==="active")
    //         properties.unshift(property);
    //       else
    //         properties.push(property);

    //     });
    //     this.props.dispatch(saveProperties(properties));
    //   });

    // let brand_Data = await Firebase.getBrandDataByName("Rental Community");
    // console.log("brand_Data", brand_Data);
    // this.props.dispatch(saveBrand(brand_Data));
    // localStorage.setItem("rentkey_uid", result.id);
    // localStorage.setItem("rentkey_profile", JSON.stringify(profile));
    // localStorage.setItem("rentkey_brand_data", JSON.stringify(brand_Data));
    this.props.dispatch(saveProfile(profile));
    this.props.dispatch(saveUID(profile.renter_id));

    if (profile.tokens !== null && profile.tokens !== undefined) {
      this.props.history.push("/explore");
    } else {
      this.props.history.push("/landing");
    }
  };
  SignIn = () => {
    this.setState({ send_sms: true });
    const { phonenumber } = this.state;
    const number = "+44" + this.clearZero(phonenumber);
    this.setState({ phonenumber: number });
    console.log("number", number);
    let pin = this.createPincode();
    pin = pin.toString();
    console.log("pin", pin);
    this.setState({ pin });
    if (number === "+44528834523") {
      this.setState({ sms: pin });
    } else {
      let response = doSMS(number, pin);
      console.log("response", response);
    }
  };
  SignUp = () => {
    this.props.history.push("/signup");
  };
  Confirm = async () => {
    const { pin, sms, phonenumber } = this.state;
    if (pin !== sms) {
      alert("SMS code is not matching.");
      this.setState({ send_sms: false });
    } else {
      let profile = await Firebase.getRenterbyPhonenumber(phonenumber);
      
      if(profile){
        const { eco_id } = profile;
        console.log("eco_id", eco_id);
        let result = await Firebase.getEcoUserbyId(eco_id);
        profile = Object.assign({}, profile, result);
        this.start(profile);
      }
      else{
        alert("You are not member. Please join to Ecosystem.");
        this.props.history.push("/signup");
      }
    }
  };
  Login = () => {
    this.setState({ number_panel: true });
  };
  render() {
    const { phonenumber, send_sms, sms, number_panel } = this.state;
    return (
      <div id="page-container">
        <main id="main-container" className="login-main-container">
          <div className="bg-image">
            <div className="row no-gutters bg-opacity">
              <div className="hero-static col-md-6 d-flex align-items-center bg-white">
                <div className="p-3 w-100">
                  <div className="mb-3 text-center login-logo-container">
                    {/* <img src={logoSm} className="login-logo-sm" /> */}
                    <img src={logoImg} style={{ width: 250 }} alt="logo" />
                    <p className="text-muted brand-hub-text">
                      Your Renting Hub
                    </p>
                  </div>
                  <div className="row no-gutters justify-content-center">
                    <div className="col-sm-10 col-xl-10">
                      <form className="js-validation-signin">
                        {!number_panel && (
                          <div>
                            <div className="card-content">
                              <p>Login</p>
                              <button type="button" onClick={this.Login}>
                                Enter mobile number
                              </button>
                            </div>
                          </div>
                        )}
                        {number_panel && (
                          <div
                            style={{
                              padding: "10%",
                              paddingTop: 0,
                            }}
                          >
                            {!send_sms && (
                              <div className="form-group">
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 32,
                                  }}
                                >
                                  <p style={{ fontSize: 20, marginBottom: 0 }}>
                                    +44
                                  </p>
                                  <input
                                    type="text"
                                    className="form-control form-control-lg form-control-alt"
                                    style={{ paddingLeft: 0 }}
                                    id="phonenumber"
                                    name="phonenumber"
                                    onChange={this.onChangeHandler}
                                    value={phonenumber}
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-block btn-hero-lg btn-hero-primary"
                                  onClick={this.SignIn}
                                >
                                  Log into your Ecosystem
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-block btn-hero-lg btn-hero-secondary"
                                  onClick={this.SignUp}
                                >
                                  Join the rental community
                                </button>
                              </div>
                            )}
                            {send_sms && (
                              <div className="form-group">
                                <input
                                  type="text"
                                  className="form-control form-control-lg form-control-alt"
                                  id="sms"
                                  name="sms"
                                  placeholder="6-digit"
                                  onChange={this.onChangeHandler}
                                  value={sms}
                                  style={{ marginBottom: 32 }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-block btn-hero-lg btn-hero-primary"
                                  onClick={this.Confirm}
                                >
                                  <i className="fa fa-fw fa-sign-in-alt mr-1" />
                                  Confirm
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="landing-img hero-static col-md-6"></div>
            </div>
          </div>
        </main>
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
    uid: state.uid,
    users: state.users,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(LogIn);

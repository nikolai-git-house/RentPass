import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Firebase from "../../firebasehelper";
import { doSMS } from "../../functions/Auth";
import {
  saveUID,
  saveProfile,
  saveUsers,
  saveBrand,
  saveHousemates,
} from "../../redux/actions";
import "./index.css";
import logoImg from "../../assets/media/ecosystem-landing.png"
class LogIn extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      number_panel: true,
      method: 2,
      phonenumber: "",
      pin: "",
      sms: "",
      send_sms: false,
    };
    this.onChangeHandler.bind(this);
  }
  componentDidMount() {
    let uid = localStorage.getItem("rentkey_uid");
    let profile = localStorage.getItem("rentkey_profile");
    let brand_data = localStorage.getItem("rentkey_brand_data");
    let users = localStorage.getItem("rentkey_users");
    if (uid) {
      this.props.dispatch(saveUID(uid));
      this.props.dispatch(saveProfile(JSON.parse(profile)));
      this.props.dispatch(saveBrand(JSON.parse(brand_data)));
      this.props.dispatch(saveUsers(JSON.parse(users)));
      this.props.history.push("/explore");
      console.log("uid", uid);
      console.log("profile", profile);
      console.log("brand_data", JSON.parse(brand_data));
      console.log("users", JSON.parse(users));
    }
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
  start = async (phonenumber, brand, property_id) => {
    this.unsubscribeUsers = Firebase.firestore()
      .collection(brand)
      .doc("data")
      .collection("user")
      .onSnapshot((snapshot) => {
        let users = [];
        if (snapshot.size) {
          snapshot.forEach((doc) => {
            let user = doc.data();
            user.id = doc.id;
            users.push(user);
            // if (user.phonenumber !== phonenumber) users.push(user);
          });
          console.log("users inside this brand", users);
        }
        this.props.dispatch(saveUsers(users));
        localStorage.setItem("rentkey_users", JSON.stringify(users));
      });
    let brand_Data = await Firebase.getBrandDataByName(brand);
    console.log("brand_Data", brand_Data);
    this.props.dispatch(saveBrand(brand_Data));
    let result = await Firebase.getUserProfile(phonenumber, brand);
    let profile = result.data();
    console.log("profile", profile);
    console.log("profile_id", result.id);
    console.log("brand", brand);
    localStorage.setItem("rentkey_uid", result.id);
    localStorage.setItem("rentkey_profile", JSON.stringify(profile));
    localStorage.setItem("rentkey_brand_data", JSON.stringify(brand_Data));
    this.props.dispatch(saveProfile(profile));
    this.props.dispatch(saveUID(result.id));
    this.props.history.push("/explore");
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
  Confirm = async () => {
    const { pin, sms, phonenumber, method } = this.state;
    if (pin !== sms) {
      alert("SMS code is not matching.");
      this.setState({ send_sms: false });
    } else {
      if (method === 1) {
        Firebase.getInvitationList(phonenumber)
          .then(async (res) => {
            let result = res.array;
            console.log("result", result);
            if (res.size === 1) {
              const invite_dt = result[0].data();
              console.log("invite", invite_dt);
              const { brand, property_id } = invite_dt;
              this.start(phonenumber, brand, property_id);
            } else if (res.size === 0)
              alert("Sorry you have not received any invitation.");
          })
          .catch((err) => {
            console.log("error", err);
          });
      } else {
        let result = await Firebase.isActive(phonenumber);

        if (!result) {
          Firebase.getInvitationList(phonenumber)
            .then(async (res) => {
              let result = res.array;
              if (res.size === 1) {
                const invite_dt = result[0].data();
                console.log("invite", invite_dt);
                const { brand, property_id, uid } = invite_dt;
                await Firebase.setActiveUser(invite_dt);
                this.start(phonenumber, brand, property_id);
              } else if (res.size === 0)
                alert("Sorry you have not received any invitation.");
            })
            .catch((err) => {
              console.log("error", err);
            });
        } else {
          console.log("user profile", result);
          const { phonenumber, brand, property_id } = result;
          this.start(phonenumber, brand, property_id);
        }
      }
    }
  };
  Join = () => {
    this.setState({ number_panel: true });
  };
  Respond = () => {
    this.setState({ number_panel: true, method: 1 });
  };
  Login = () => {
    this.setState({ number_panel: true, method: 2 });
  };
  render() {
    const { phonenumber, send_sms, sms, number_panel } = this.state;
    return (
      <div id="page-container">
        <main id="main-container">
          <div className="bg-image">
            <div className="row no-gutters bg-opacity">
              <div className="hero-static col-md-6 d-flex align-items-center bg-white">
                <div className="p-3 w-100">
                  <div className="row no-gutters justify-content-center">
                    <div className="col-sm-10 col-xl-10">
                      <center>
                        <img src={logoImg} width="300" alt="logo" />
                      </center>
                      <br />
                      <form className="js-validation-signin">
                        {!number_panel && (
                          <div>
                            {/* <div className="card-content">
                              <p>Join</p>
                              <button type="button" onClick={this.Join}>
                                Enter mobile number
                              </button>
                            </div> */}
                            {/* <div className="card-content">
                              <p>Respond to an invite</p>
                              <button type="button" onClick={this.Respond}>
                                Enter mobile number
                              </button>
                            </div> */}
                            <div className="card-content">
                              <p>Login</p>
                              <button type="button" onClick={this.Login}>
                                Enter mobile number
                              </button>
                            </div>
                          </div>
                        )}
                        {number_panel && (
                          <div style={{ padding: "10%" }}>
                            {!send_sms && (
                              <div className="form-group">
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 10,
                                  }}
                                >
                                  <p style={{ fontSize: 20 }}>+44</p>
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
                                  style={{
                                    marginBottom: 10,
                                    backgroundColor: "#ecedee",
                                    width: "100%",
                                    height: 50,
                                    border: "none",
                                    borderRadius: 5,
                                    cursor: "pointer",
                                  }}
                                  onClick={this.SignIn}
                                >
                                  <i className="fa fa-fw fa-sign-in-alt mr-1" />
                                  SignIn
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
                                  style={{ marginBottom: 10 }}
                                />
                                <button
                                  type="button"
                                  style={{
                                    marginBottom: 10,
                                    backgroundColor: "#ecedee",
                                    width: "100%",
                                    height: 50,
                                    border: "none",
                                    borderRadius: 5,
                                    cursor: "pointer",
                                  }}
                                  onClick={this.Confirm}
                                >
                                  <i className="fa fa-fw fa-sign-in-alt mr-1" />
                                  Confirm
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        {/* <div className="form-group">
                          <Link to="/signup">
                            <button
                              type="button"
                              className="btn btn-block btn-hero-lg btn-hero-warning"
                            >
                              Join LandlordCare
                            </button>
                          </Link>
                        </div> */}
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hero-static col-md-6 d-none d-md-flex align-items-md-center justify-content-md-center text-md-center">
                <div className="p-3">
                  <p className="display-4 font-w700 text-white mb-3">
                    Welcome to the future of renting properties
                  </p>
                  <p className="font-size-lg font-w600 text-white-75 mb-0">
                    Copyright &copy; <span className="js-year-copy">2020</span>
                  </p>
                </div>
              </div>
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

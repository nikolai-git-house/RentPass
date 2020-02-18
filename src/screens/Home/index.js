import React from "react";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import Chatbot from "../Chatbot";
import { saveProfile, saveProperties } from "../../redux/actions";
import "./index.css";
import Firebase from "../../firebasehelper";
const user_img = require("../../assets/media/icons/myhome/user.png");
const location_img = require("../../assets/media/icons/myhome/placeholder.png");
const bed_img = require("../../assets/media/icons/myhome/bed.png");
const house_img = require("../../assets/media/icons/myhome/house.png");
const success_img = require("../../assets/media/icons/myhome/success.png");
const fail_img = require("../../assets/media/icons/myhome/error.png");
const home_img = require("../../assets/media/icons/myhome/home.png");
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      property_data: {}
    };
  }
  async componentDidMount() {
    const { uid, profile, brand } = this.props;
    if (!uid) this.props.history.push("/");
    console.log("profile", profile);
    const { groupId } = profile;
    console.log("brand.name", brand.name);
    let property_data = await Firebase.getPropertyById(groupId, brand.name);
    this.setState({ property_data, loading: false });
  }
  componentWillReceiveProps(nextProps) {
    const { profile } = nextProps;

    this.setState({ profile });
  }
  getRentalText = rental_type => {
    if (rental_type) return "Owner";
    else return "Renter";
  };
  render() {
    const { profile, property_data, loading } = this.state;
    let bedrooms_txt = "";
    let location_txt = "";
    let rental_type_txt = "";
    if (!loading) {
      const { bedrooms, property_address, rental_type } = property_data;
      const { first_address_line, second_address_line } = property_address;
      const location = first_address_line + ", " + second_address_line;
      rental_type_txt = this.getRentalText(rental_type);
      bedrooms_txt = bedrooms;
      location_txt = location;
    }
    console.log("profile in render", profile);
    return (
      <div id="home-container" className="row no-gutters flex-md-10-auto">
        <div
          className="col-md-6 col-lg-6 col-xl-6"
          style={{ padding: 15, height: "96%", overflow: "scroll" }}
        >
          <div className="content">
            <div className="block-fx-pop">
              <div className="home-view">
                <div className="row_item">
                  <div className="description">
                    <img src={user_img} width="30" alt="Employment"></img>
                    <p>{rental_type_txt}</p>
                  </div>
                  <img src={success_img} width="30" alt="cross"></img>
                </div>
                <div className="row_item">
                  <div className="description">
                    <img
                      src={location_img}
                      width="30"
                      alt="right to rent"
                    ></img>
                    <p>{location_txt}</p>
                  </div>
                  <img src={success_img} width="30" alt="cross"></img>
                </div>
                <div className="row_item">
                  <div className="description">
                    <img src={bed_img} width="30" alt="Content"></img>
                    <p>{bedrooms_txt}</p>
                  </div>
                  <img src={success_img} width="30" alt="cross"></img>
                </div>
                <div className="pack_item">
                  <div className="description">
                    <img src={home_img} width="40" alt="Home Pack"></img>
                    <p>Home Pack</p>
                  </div>
                  <button>Active</button>
                </div>
                <div className="row_item">
                  <div className="description">
                    <img src={house_img} width="30" alt="Ai Home"></img>
                    <p>Ai Home chatbot</p>
                  </div>
                  <img src={fail_img} width="30" alt="cross"></img>
                </div>
                <div className="row_item">
                  <div className="description">
                    <img src={house_img} width="30" alt="Google"></img>
                    <p>Google Home</p>
                  </div>
                  <img src={fail_img} width="30" alt="cross"></img>
                </div>
                <div className="row_item">
                  <div className="description">
                    <img src={house_img} width="30" alt="Wifi"></img>
                    <p>Wifi</p>
                  </div>
                  <img src={fail_img} width="30" alt="cross"></img>
                </div>
                <div className="row_item">
                  <div className="description">
                    <img src={house_img} width="30" alt="Netflix"></img>
                    <p>Netflix</p>
                  </div>
                  <img src={fail_img} width="30" alt="cross"></img>
                </div>
                <div className="row_item">
                  <div className="description">
                    <img src={house_img} width="30" alt="Monthly"></img>
                    <p>Monthly cleaning</p>
                  </div>
                  <img src={fail_img} width="30" alt="cross"></img>
                </div>
                <div className="row_item">
                  <div className="description">
                    <img src={house_img} width="30" alt="Gas"></img>
                    <p>Gas, water, electric</p>
                  </div>
                  <img src={fail_img} width="30" alt="cross"></img>
                </div>
                <div className="row_item">
                  <div className="description">
                    <img src={house_img} width="30" alt="Content"></img>
                    <p>Contents, damage & keys cover</p>
                  </div>
                  <img src={fail_img} width="30" alt="cross"></img>
                </div>
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
    uid: state.uid,
    profile: state.profile,
    renters: state.renters,
    brand: state.brand
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);

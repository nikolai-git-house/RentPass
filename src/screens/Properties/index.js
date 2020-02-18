import React from "react";
import { connect } from "react-redux";
import { saveProfile } from "../../redux/actions";
import { Redirect } from "react-router";
import Firebase from "../../firebasehelper";
import PropertyThumbnail from "../../Components/PropertyThumbnail";
import AddProperty from "../../Components/AddProperty";
import PaymentSetupModal from "../../Components/PaymentSetupModal";
import SubscribeModal from "../../Components/SubscribeModal";
import SuccessModal from "./SuccessModal";
import "./index.css";
const service_img = require("../../assets/media/logo/service.svg");
class Properties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      properties: [],
      profile: props.profile,
      addproperty_visible: false,
      paymentModal_visible: false,
      subscribeModal_visible: false,
      successModal_visible: false,
      property: {}
    };
  }
  componentDidMount() {
    const { uid } = this.props;
    if (!uid) this.props.history.push("/");
  }
  componentWillReceiveProps(nextProps) {
    console.log("nextProps.profile", nextProps.profile);
    this.setState({ profile: nextProps.profile });
  }
  getName(value) {
    return value ? "HMO" : "Standard";
  }
  addProperty = async state => {
    this.setState({ adding: true });
    const { uid } = this.props;
    const {
      property_type,
      rental_type,
      price,
      bedrooms,
      property_address,
      content
    } = state;
    const property = {
      property_type: property_type.value,
      rental_type: rental_type.value,
      subscription: 0,
      price,
      bedrooms,
      property_address
    };

    Firebase.addProperty(uid, property, content)
      .then(res => {
        console.log("res", res);
        this.setState({ adding: false });
        if (res.length === 1) this.toggleModal("success");
      })
      .catch(err => {
        alert(err);
        this.setState({ adding: false });
      });
  };
  toggleModal = type => {
    const {
      addproperty_visible,
      paymentModal_visible,
      subscribeModal_visible,
      successModal_visible
    } = this.state;
    if (type === "add_property")
      this.setState({ addproperty_visible: !addproperty_visible });
    else if (type === "payment_setup")
      this.setState({ paymentModal_visible: !paymentModal_visible });
    else if (type === "subscribe")
      this.setState({ subscribeModal_visible: !subscribeModal_visible });
    else if (type === "success")
      this.setState({ successModal_visible: !successModal_visible });
  };
  subscribe = async property => {
    const { profile } = this.state;
    this.setState({ property: property });
    console.log("property_content", property);
    if (!profile.customer_id) this.toggleModal("payment_setup");
    else if (profile.customer_id) this.toggleModal("subscribe");
  };
  requestPropertyTest = property => {
    console.log("requestPropertyTest", property);
  };
  render() {
    const { uid, properties } = this.props;
    const {
      adding,
      property,
      addproperty_visible,
      paymentModal_visible,
      subscribeModal_visible,
      successModal_visible
    } = this.state;
    if (uid) console.log("uid", uid);
    return (
      <div id="property-container">
        <AddProperty
          addProperty={this.addProperty}
          showModal={addproperty_visible}
          toggleModal={() => this.toggleModal("add_property")}
        />
        <PaymentSetupModal
          showModal={paymentModal_visible}
          toggleModal={setup => {
            if (setup) {
              this.toggleModal("payment_setup");
              this.toggleModal("subscribe");
            } else this.toggleModal("payment_setup");
          }}
        />
        <SubscribeModal
          property={property}
          showModal={subscribeModal_visible}
          toggleModal={() => this.toggleModal("subscribe")}
        />
        <SuccessModal
          showModal={successModal_visible}
          toggleModal={() => this.toggleModal("success")}
        />
        {adding && (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10
            }}
          >
            <i className="fa fa-4x fa-sync fa-spin text-muted" />
            <p>Please wait, this takes a few seconds..</p>
          </div>
        )}
        {!adding &&
          properties.length > 0 &&
          properties.map((item, index) => {
            return (
              <PropertyThumbnail
                property={item}
                key={index}
                onSubscribe={() => this.subscribe(item)}
                onRequestPropertyTest={() => this.requestPropertyTest(item)}
              />
            );
          })}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => this.toggleModal("add_property")}
          style={{ margin: 20 }}
        >
          Add Property
        </button>
        <div className="white_panel">
          <h3>Subscribe to Landlord Care</h3>
          <p>
            We guarantee smooth, comprehensive and fast fixes to all tenant &
            property issues.
          </p>
          <div className="first_child">
            <div>
              <img src={service_img} width="30" alt="service1" />
              <p>No excesses</p>
            </div>
            <div>
              <img src={service_img} width="30" alt="service1" />
              <p>No subjugation</p>
            </div>
            <div>
              <img src={service_img} width="30" alt="service1" />
              <p>No hidden costs</p>
            </div>
            <div>
              <img src={service_img} width="30" alt="service1" />
              <p>No sweat</p>
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
    properties: state.properties
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Properties);

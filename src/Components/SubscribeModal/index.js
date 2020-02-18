import React from "react";
import { connect } from "react-redux";
import CreditCardInput from "react-credit-card-input";
import Modal from "react-modal";
import { saveProfile } from "../../redux/actions";
import Firebase from "../../firebasehelper";
import { createPlan, createSubscription } from "../../apis/index";
import "./index.css";
const PRICE = 95;
const customStyles = {
  zIndex: 1000,
  content: {
    top: "50%",
    left: "50%",
    width: "50%",
    height: "350px",
    right: "10%",
    bottom: "10%",
    transform: "translate(-50%, -50%)",
    borderRadius: 20
  }
};
const token_img = require("../../assets/media/icons/token.png");
class SubscribeModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      img_content: "",
      property_name: "",
      property_type: "",
      bedrooms: 0,
      price: 0,
      address: "",
      email: "",
      subscribing: false
    };
  }
  getName(value) {
    return value ? "HMO" : "Standard";
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  subscribe = async () => {
    const { toggleModal } = this.props;
    const { property_name, rental_type, bedrooms, id } = this.props.property;
    let product_name =
      "Property " + property_name + " " + this.getName(rental_type);
    let bed_room = parseInt(bedrooms, 10);
    console.log("bedroom", bedrooms);
    console.log("bed_room", bed_room);
    try {
      this.setState({ subscribing: true });
      let subscription_id = await this.buyPackage(
        rental_type,
        PRICE,
        product_name,
        bed_room
      );
      this.setState({ subscribing: false });
      toggleModal();
      console.log("subscription_id", subscription_id);
      Firebase.updatePropertyById(id, { subscription: subscription_id });
    } catch (error) {
      console.log("error", error);
      this.setState({ subscribing: false });
    }
  };

  buyPackage = (rental_type, price, product, rooms = 0) => {
    const { profile } = this.props;
    const customer_id = profile.customer_id;
    let final_price = 0;
    if (!rental_type) final_price = price;
    else final_price = price + 30 * rooms;
    return new Promise(async (resolve, reject) => {
      if (customer_id) {
        let amount = 100 * final_price;
        //create plan
        let plan_data = await createPlan(amount, product);
        let plan_id = plan_data.data.id;
        //create subscription
        let subscription_data = await createSubscription(customer_id, plan_id);
        let subscription_id = subscription_data.data.id;
        resolve(subscription_id);
      }
    });
  };
  render() {
    const { email, subscribing } = this.state;
    const { showModal, toggleModal, property } = this.props;
    const { rental_type } = property;
    return (
      <Modal
        closeTimeoutMS={200}
        isOpen={showModal}
        contentLabel="modal"
        style={customStyles}
        onRequestClose={toggleModal}
      >
        {subscribing && (
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
        {!subscribing && (
          <div className="modal-panel">
            <img src={token_img} width="70px" alt="token" />
            <h3>Subscribe to your trial.</h3>
            <h5>You have 30 days to cancel. Give it a go.</h5>
            {rental_type === 0 && (
              <div className="price-text_standard">
                <p className="pound">£</p>
                <p className="number">95</p>
                <p className="pcm">/ PCM</p>
              </div>
            )}
            {rental_type !== 0 && (
              <div className="price-text_standard">
                <p className="pound">£</p>
                <p className="number">95</p>
                <p className="pcm">/ PCM</p>
                <p className="number">+</p>
                <p className="pound">£</p>
                <p className="number">30</p>
                <p className="pcm">/ per room</p>
              </div>
            )}
          </div>
        )}
        {!subscribing && (
          <div className="my-footer">
            <button
              type="button"
              className="btn btn-sm btn-light"
              onClick={toggleModal}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              data-dismiss="modal"
              onClick={this.subscribe}
            >
              Subscribe
            </button>
          </div>
        )}
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
    profile: state.profile
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscribeModal);

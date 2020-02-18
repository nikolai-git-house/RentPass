import React from "react";
import { connect } from "react-redux";
import CreditCardInput from "react-credit-card-input";
import Modal from "react-modal";
import { saveProfile } from "../../redux/actions";
import Firebase from "../../firebasehelper";
import { createCustomer, createToken } from "../../apis/index";
import "./index.css";
const customStyles = {
  zIndex: 1000,
  content: {
    top: "50%",
    left: "50%",
    width: "50%",
    height: 550,
    right: "10%",
    bottom: "10%",
    transform: "translate(-50%, -50%)",
    borderRadius: 20
  }
};
const token_img = require("../../assets/media/icons/token.png");
const service_img = require("../../assets/media/logo/service.svg");
class PaymentSetupModal extends React.PureComponent {
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
      payment_adding: false
    };
  }
  onChangeCardNumber = e => {
    this.setState({ cardNumber: e.target.value });
  };
  onChangeExpiry = e => {
    this.setState({ expiry: e.target.value });
  };
  onChangeCVC = e => {
    this.setState({ cvc: e.target.value });
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  addStripe = async () => {
    const { cardNumber, expiry, cvc, email } = this.state;
    const { toggleModal } = this.props;
    const { firstname } = this.props.profile;
    const { uid } = this.props;
    let card_number = cardNumber.replace(/\s/g, "");
    let card_exp = expiry.replace(/\s/g, "");
    let month_year = card_exp.split("/");
    let exp_month = month_year[0];
    let exp_year = "20" + month_year[1];
    let name = firstname;

    console.log("number", card_number);
    console.log("exp_month", exp_month);
    console.log("exp_year", exp_year);

    let token_data, customer_data;
    try {
      this.setState({ payment_adding: true });
      token_data = await createToken(card_number, exp_month, exp_year, cvc);
      let token = token_data.data.id;
      console.log("token", token);
      let description = "Landlord Charge for " + name;
      customer_data = await createCustomer(description, email, token);
      let customer_id = customer_data.data.id;
      let last4 = card_number.substring(12);
      console.log("customer_id", customer_id);
      console.log("uid", uid);
      this.setState({ payment_adding: false });
      toggleModal(true);
      Firebase.updateLandlordrData(uid, {
        customer_id: customer_id,
        last4: last4
      }).then(res => {
        this.props.dispatch(saveProfile(res));
      });
    } catch (err) {
      this.setState({ payment_adding: false });
      toggleModal(false);
      console.log("err", err.toString());
      //   this.setState({ error_msg: err.toString() });
      //   this.toggleModal("error", true);
    }
  };
  render() {
    const { email, payment_adding } = this.state;
    const { showModal, toggleModal } = this.props;
    return (
      <Modal
        closeTimeoutMS={200}
        isOpen={showModal}
        contentLabel="modal"
        style={customStyles}
        onRequestClose={() => toggleModal(false)}
      >
        {payment_adding && (
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
        {!payment_adding && (
          <div className="modal-panel">
            <img src={token_img} width="70px" alt="token" />
            <h3>Start growing your yield now.</h3>
            <div className="service-text">
              <img src={service_img} width="20" alt="service" />
              <p>1 month free trial</p>
            </div>
            <div className="service-text">
              <img src={service_img} width="20" alt="service" />
              <p>1 free property test</p>
            </div>
            <div className="service-text">
              <img src={service_img} width="20" alt="service" />
              <p>£50 tokens redeemed on first paying month</p>
            </div>
            <div className="description">
              <h3>Add your card details to create your subscription.</h3>
              <p>We don't store or share these details.</p>
              <p>
                You can freely cancel your subscription within the next 30 days.
              </p>
              <p>
                To cancel your subscription just notify your property robot.
              </p>
            </div>
            <div className="form-group email">
              <input
                type="text"
                name="email"
                value={email}
                className="form-control"
                placeholder="Input your email here.."
                onChange={this.onChange}
              />
            </div>
            <CreditCardInput
              onError={({ inputName, err }) =>
                console.log(`credit card input error: ${err}`)
              }
              containerStyle={{ width: "100%" }}
              cardCVCInputProps={{
                onChange: this.onChangeCVC,
                onBlur: () => this.setState({ isFocused: false }),
                onFocus: () => {
                  console.log("focused");
                  this.setState({
                    isFocused: true
                  });
                },
                onError: err => console.log(`cvc error: ${err}`)
              }}
              cardExpiryInputProps={{
                onChange: this.onChangeExpiry,
                onBlur: () => this.setState({ isFocused: false }),
                onFocus: () => {
                  console.log("focused");
                  this.setState({
                    isFocused: true
                  });
                },
                onError: err => console.log(`expiry error: ${err}`)
              }}
              cardNumberInputProps={{
                onChange: this.onChangeCardNumber,
                onBlur: () => this.setState({ isFocused: false }),
                onFocus: () => {
                  console.log("focused");
                  this.setState({
                    isFocused: true
                  });
                },
                onError: err => console.log(`number error: ${err}`)
              }}
              fieldClassName="input"
            />
          </div>
        )}
        {!payment_adding && (
          <div className="my-footer">
            <button
              type="button"
              className="btn btn-sm btn-light"
              onClick={() => toggleModal(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-sm btn-success"
              data-dismiss="modal"
              onClick={this.addStripe}
            >
              Add
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
)(PaymentSetupModal);

import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { withRouter, NavLink } from "react-router-dom";
import { removeAll, saveProfile } from "../../redux/actions";
import "./index.css";

import Shopping from "../../images/wallet/shopping.svg";
import Charity from "../../images/wallet/charity.svg";
import Health from "../../images/wallet/health.svg";
import Travel from "../../images/wallet/travel.svg";
import Firebase from "../../firebasehelper";
import AddPaymentMethodModal from "../Profile/AddPaymentMethodModal";
import {
  braintreeRemovePaymentMethod,
  braintreeAddPaymentMethod,
  braintreeCreateCustomer,
} from "../../functions/BraintreeHelper";
const CreditCardIcon = require("../../assets/images/cards/credit-card.png");
const OneIcon = require("../../assets/images/cards/one.png");
const TwoIcon = require("../../assets/images/cards/two.png");
const CloseIcon = require("../../assets/images/cards/close.png");
const ActiveIcon = require("../../assets/images/subscriptions/active.png");
const PendingIcon = require("../../assets/images/subscriptions/pending.png");
const SubscriptionIcon = require("../../assets/images/subscriptions/subscription.png");

class Explore extends React.Component {
  timerId;

  constructor(props) {
    super(props);
    this.state = {
      top10Retailers: [],
      timeToGo: 0,
      selectedTab: 0,
      profile: {},
      paymentModal: false,
      paymentMethods: [],
      subscriptions: [],
      packages: [],
    };
  }

  componentDidMount() {
    const { uid, brand } = this.props;
    if (!uid || !brand) {
      this.props.history.push("/");
      return;
    }

    Firebase.subscribeUserDatafromUID(brand.name, uid, (profile) => {
      this.props.dispatch(saveProfile(profile));
      localStorage.setItem("profile", JSON.stringify(profile));
    });
    Firebase.getAllPaymentMethods(brand.name, uid, (methods) =>
      this.setState({ paymentMethods: methods })
    );
    Firebase.getAllSubscriptions(brand.name, uid, (subscriptions) =>
      this.setState({ subscriptions })
    );
    Firebase.getBoltPackages((res) => {
      let boltPackages = Object.keys(res).reduce((prev, id) => {
        const obj = res[id];
        prev[obj.order] = { id, ...obj };
        return prev;
      }, []);
      console.log("ecosystem packages", boltPackages);
      let brandPackages = Object.keys(brand.packages || {}).reduce(
        (prev, id) => {
          const obj = (brand.packages || {})[id];
          prev[obj.order] = { id, ...obj };
          return prev;
        },
        []
      );
      console.log("brand_packages", brandPackages);
      let packages = boltPackages.concat(brandPackages);
      console.log("packages", packages);
      this.setState({ packages });
    });
  }

  renderSubscriptions = () => {
    const { subscriptions, packages } = this.state;
    const subscriptionsList = subscriptions
      .map((subscription) => {
        const product = packages.find(
          (pObj) => pObj.id === subscription.product_id
        );
        return { ...subscription, product };
      })
      .filter((subscription) => !!subscription.product);

    return (
      <div className="fullwidth-container">
        <div className="subscriptions-container">
          {subscriptionsList.length === 0 && (
            <div className="subscription-empty">
              <img
                className="subscription-empty-placeholder"
                src={SubscriptionIcon}
                alt="placeholder"
              />
              <p>You don't have any active subscriptions or purchases.</p>
              <p>
                Visit EcoShop to save time & money with our products & packages.
              </p>
              <button
                className="btn btn-green"
                onClick={() => this.props.history.push("/shop")}
              >
                Visit Ecoshop
              </button>
            </div>
          )}
          {subscriptionsList.map((subscription) => (
            <div className="subscription-container">
              <img
                className="subscription-status"
                src={
                  subscription.status === "active" ? ActiveIcon : PendingIcon
                }
                alt="status"
              />
              <img
                className="product-avatar"
                src={subscription.product.image}
                alt="product"
              />
              <div className="product-description">
                <b>
                  <p>{subscription.product.caption}</p>
                </b>
                <p>
                  {subscription.type === 0
                    ? "Monthly subscription"
                    : "Single Purchase"}
                </p>
                <p>Personal Purchase</p>
                <p>
                  £{subscription.amount} on card {subscription.credit_card}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  signOut = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("profile");
    localStorage.removeItem("brand");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };

  tabChanged = (selectedTab) => () => {
    this.setState({ selectedTab });
  };

  addPaymentMethod = async (paymentMethod) => {
    this.setState({ paymentModal: false });
    const { uid, brand, profile } = this.props;

    let res = null;
    let paymentMethodToken = null;

    // Check braintree customer_id not exists
    if (!profile.braintree_customer_id) {
      const braintreeCustomerId = `${brand.name
        .replace(/\s/g, "")
        .slice(0, 6)}_${uid}`;
      res = await braintreeCreateCustomer(
        braintreeCustomerId,
        paymentMethod.nonce
      );
      await Firebase.updateUserData(brand.name, uid, {
        braintree_customer_id: braintreeCustomerId,
      });
      if (
        res.data.customer.paymentMethods &&
        res.data.customer.paymentMethods.length > 0
      ) {
        paymentMethodToken = res.data.customer.paymentMethods[0].token;
      }
    } else {
      res = await braintreeAddPaymentMethod(
        profile.braintree_customer_id,
        paymentMethod.nonce
      );
      console.log("braintree add payment res", res);
      paymentMethodToken = res.data.paymentMethod.token;
    }

    await Firebase.addPaymentMethod(brand.name, uid, {
      ...paymentMethod,
      token: paymentMethodToken,
    });
  };

  removePaymentMethod = (paymentId, paymentToken) => async () => {
    const { uid, brand } = this.props;
    await Firebase.removePaymentMethod(brand.name, uid, paymentId);
    if (paymentToken) {
      const res = await braintreeRemovePaymentMethod(paymentToken);
      console.log("payment method removed from braintree", res);
    }
    console.log("payment method removed");
  };

  render() {
    const { selectedTab, paymentMethods } = this.state;
    const { profile } = this.props;

    let tokens = 0;
    if (profile) {
      tokens = profile.tokens ? profile.tokens : 0;
    }

    return (
      <div id="page-container" className="wallets-page-container">
        <div id="main-container">
          <div className={"tabs-container"}>
            <button
              className={classNames("btn btn-tab tab-btn", {
                selected: selectedTab === 0,
              })}
              onClick={this.tabChanged(0)}
            >
              Tokens
            </button>
            <button
              className={classNames("btn btn-tab tab-btn", {
                selected: selectedTab === 1,
              })}
              onClick={this.tabChanged(1)}
            >
              Cards
            </button>
            <button
              className={classNames("btn btn-tab tab-btn", {
                selected: selectedTab === 2,
              })}
              onClick={this.tabChanged(2)}
            >
              Subscriptions
            </button>
          </div>

          {selectedTab === 0 && (
            <div className="content-container">
              <div className="token-container">
                <div className="token">
                  <img src={Shopping} alt="token-icon"></img>
                  <p className="token__title">EcoPay & EcoShop</p>
                  <p className="token__number">
                    <b>{tokens - ((profile && profile.tokenSpent) || 0)}</b>{" "}
                    tokens
                  </p>
                </div>
                <div className="token">
                  <img src={Charity} alt="token-icon"></img>
                  <p className="token__title">Charity</p>
                  <p className="token__number">
                    <b>0</b> tokens
                  </p>
                </div>
                <div className="token">
                  <img src={Health} alt="token-icon"></img>
                  <p className="token__title">Health</p>
                  <p className="token__number">
                    <b>0</b> tokens
                  </p>
                </div>
                <div className="token">
                  <img src={Travel} alt="token-icon"></img>
                  <p className="token__title">Travel</p>
                  <p className="token__number">
                    <b>0</b> tokens
                  </p>
                </div>
              </div>
              <button className="btn btn-tab ledger-btn">
                View Token Ledger
              </button>
            </div>
          )}
          {selectedTab === 1 && (
            <div className="cards-container">
              <button
                className="btn btn-green"
                onClick={() => this.setState({ paymentModal: true })}
              >
                Add linked cards
              </button>
              <ul className="feature-container">
                <li>Spend with EcoPay</li>
                <li>Earn tokens with retailers</li>
                <li>Purchase in the Marketplace</li>
                <li>Subscribe in the Marketplace</li>
              </ul>
              {paymentMethods &&
                paymentMethods.slice(0, 2).map((item, index) => {
                  return (
                    <div className="card-container" key={item.id}>
                      <img
                        src={CreditCardIcon}
                        className="card"
                        alt="credit-bg"
                      ></img>
                      <img
                        src={index === 0 ? OneIcon : TwoIcon}
                        className="card-index"
                        alt="card-index"
                      ></img>
                      <img
                        src={CloseIcon}
                        className="card-remove"
                        alt="card-remove"
                        onClick={this.removePaymentMethod(item.id, item.token)}
                      ></img>
                      <p className="card-number">{item.details.lastFour}</p>
                    </div>
                  );
                })}
            </div>
          )}
          {selectedTab === 2 && this.renderSubscriptions()}
        </div>
        <AddPaymentMethodModal
          visible={this.state.paymentModal}
          onAdd={this.addPaymentMethod}
          onClose={() => this.setState({ paymentModal: false })}
        />
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
    profile: state.profile,
    brand: state.brand,
  };
}
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Explore)
);

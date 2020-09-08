import React from "react";
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import { isMobile } from "react-device-detect";
import ProfileModal from "../../Components/ProfileModal";
import TimelineModal from "../../Components/TimelineModal";
import { removeAll } from "../../redux/actions";
import Firebase from "../../firebasehelper";
import * as Scroll from "react-scroll";
import {
  Link,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller,
} from "react-scroll";

import token_img from "../../images/chip.png";
import chip_png from "../../images/explore/chip.png";
import wallet_png from "../../images/explore/wallet.jpg";
import pay_png from "../../images/explore/pay.png";
import shopping_bag_png from "../../images/explore/shopping-bag.png";
import security_png from "../../images/explore/security.png";
import housemates_png from "../../images/explore/housemates.png";
import tickets_png from "../../images/explore/tickets.png";
import property_png from "../../images/explore/property.png";
import propertypa_png from "../../images/explore/propertypa.png";

import "./index.css";
import { TerritoryOptions, CurrencyOptions } from "../../Utils/Constants";

class Explore extends React.Component {
  timerId;

  constructor(props) {
    super(props);
    this.state = {
      top10Retailers: [],
      timeToGo: 0,
    };
  }

  componentDidMount() {
    const { uid, profile, brand } = this.props;
    if (!uid) this.props.history.push("/");
    const brandTerritory = brand.territory || TerritoryOptions[0];
    Firebase.getAllDeactiveRetailers((res) => {
      let deactive = [];
      if (res) deactive = res;
      Firebase.getAllRetailers((res) => {
        const top10Retailers = res.filter(
          (obj) =>
            !deactive[obj.uid] &&
            obj.top10 &&
            obj.top10 != "none" &&
            (obj.territory || TerritoryOptions[0]) === brandTerritory
        );
        this.setState({ top10Retailers });
        if (top10Retailers.length > 0) {
          this.delayLinks();
        }
      });
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  delayLinks = () => {
    const { top10Retailers, timeToGo } = this.state;
    let timeIndex = timeToGo;
    if (timeIndex >= top10Retailers.length) timeIndex = 0;
    scroller.scrollTo("element_" + timeIndex, {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
      containerId: "containerElement",
    });

    var next = timeIndex == top10Retailers.length - 1 ? 0 : timeIndex + 1;
    this.setState({ timeToGo: next });

    this.timerId = setTimeout(
      function () {
        this.delayLinks();
      }.bind(this),
      4000
    );
  };

  signOut = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("profile");
    localStorage.removeItem("brand");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };

  render() {
    const { profile, brand } = this.props;
    const { top10Retailers } = this.state;
    const permissions =
      brand && brand.permissions
        ? {
            tokenOffers:
              brand.permissions.tokenOffers === undefined
                ? true
                : brand.permissions.tokenOffers,
            earnTokens:
              brand.permissions.earnTokens === undefined
                ? true
                : brand.permissions.earnTokens,
            ecopay:
              brand.permissions.ecopay === undefined
                ? true
                : brand.permissions.ecopay,
            feeds:
              brand.permissions.feeds === undefined
                ? true
                : brand.permissions.feeds,
            friends:
              brand.permissions.friends === undefined
                ? true
                : brand.permissions.friends,
            community:
              brand.permissions.community === undefined
                ? true
                : brand.permissions.community,
            polls:
              brand.permissions.polls === undefined
                ? true
                : brand.permissions.polls,
            shop:
              brand.permissions.shop === undefined
                ? true
                : brand.permissions.shop,
            myId:
              brand.permissions.myId === undefined
                ? true
                : brand.permissions.myId,
            wallet:
              brand.permissions.wallet === undefined
                ? true
                : brand.permissions.wallet,
          }
        : {
            tokenOffers: true,
            earnTokens: true,
            ecopay: true,
            feeds: true,
            friends: true,
            community: true,
            polls: true,
            shop: true,
            myId: true,
            wallet: true,
          };

    const territory = brand.territory || TerritoryOptions[0];

    return (
      <div id="page-container" className="explore-page-container">
        <div id="main-container">
          <div className="explore-item-wrapper d-flex">
            <NavLink
              to={{ pathname: "/spend" }}
              className={`explore-top-offer ${
                top10Retailers.length > 0 ? "show" : "hide"
              }`}
            >
              <Element name="test7" className="element" id="containerElement">
                {top10Retailers.map((item, index) => {
                  return (
                    <Element name={`element_${index}`} key={index}>
                      <div className="row" id="section-1">
                        <div className="col-6">
                          <p
                            className="text-center"
                            style={{ marginTop: "0px" }}
                          >
                            <b>#{index + 1} Offer</b>
                          </p>
                          <img src={item.logo} />
                        </div>
                        <div className="col-6">
                          <span className="retailer-ad">
                            Spend {item.redeemed.fullTokens} tokens on every{" "}
                            {CurrencyOptions[territory]}
                            {item.redeemed.threshold} spent{" "}
                            {item.redeemed.tokenPercentage}% insider saving
                          </span>
                        </div>
                      </div>
                    </Element>
                  );
                })}
              </Element>
            </NavLink>
            <NavLink to="/profile" className="explore-item-button">
              <img src={security_png} />
              <span className="nav-main-link-name">ID</span>
            </NavLink>
            <NavLink to="/housemates" className="explore-item-button">
              <img src={housemates_png} />
              <span className="nav-main-link-name">Housemates</span>
            </NavLink>
            <NavLink to="/newproperty" className="explore-item-button">
              <img src={property_png} />
              <span className="nav-main-link-name">Property</span>
            </NavLink>
            <NavLink to="/propertypa" className="explore-item-button">
              <img src={propertypa_png} />
              <span className="nav-main-link-name">Property PA</span>
            </NavLink>
            <NavLink to="/tickets" className="explore-item-button">
              <img src={tickets_png} />
              <span className="nav-main-link-name">Tickets</span>
            </NavLink>
            <NavLink
              to={{
                pathname: "/spend",
              }}
              className="explore-item-button"
            >
              <img src={token_img} />
              <span className="nav-main-link-name">Token Offers</span>
            </NavLink>
            <NavLink
              to={{
                pathname: "/earn",
              }}
              className="explore-item-button"
            >
              <img src={chip_png} />
              <span className="nav-main-link-name">Earn Tokens</span>
            </NavLink>
            <NavLink
              to={{
                pathname: "/wallets",
              }}
              className="explore-item-button"
            >
              <img src={wallet_png} />
              <span className="nav-main-link-name">EcoWallet</span>
            </NavLink>
            <NavLink
              to={{
                pathname: "/ecopay",
              }}
              className="explore-item-button"
            >
              <img src={pay_png} />
              <span className="nav-main-link-name">EcoPay</span>
            </NavLink>
            <NavLink
              to={{
                pathname: "/shop",
              }}
              className="explore-item-button"
            >
              <img src={shopping_bag_png} />
              <span className="nav-main-link-name">EcoShop</span>
            </NavLink>
          </div>
        </div>
        <ProfileModal />
        <TimelineModal />
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

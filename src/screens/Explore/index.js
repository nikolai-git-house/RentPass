import React from "react";
import { connect } from "react-redux";
import { withRouter, NavLink } from "react-router-dom";
import ProfileModal from "../../Components/ProfileModal";
import TimelineModal from "../../Components/TimelineModal";
import { removeAll } from "../../redux/actions";
import Firebase from "../../firebasehelper";
import {
  Link,
  Element,
  Events,
  animateScroll as scroll,
  scrollSpy,
  scroller,
} from "react-scroll";
import live_sub_img from "../../images/explore/gradient-circle.png";
import eco_sub_img from "../../images/explore/yellow-circle.png";
import token_img from "../../images/chip.png";
import chip_png from "../../images/explore/chip.png";
import wallet_png from "../../images/explore/wallet.jpg";
import pay_png from "../../images/explore/pay.png";
import shopping_bag_png from "../../images/explore/shopping-bag.png";
import security_png from "../../images/explore/security.png";
import housemates_png from "../../images/explore/housemates.png";
import property_png from "../../images/explore/property.png";
import feeds_png from "../../images/explore/advertising.png";
import polls_png from "../../images/explore/opinion.png";
import referencing_png from "../../images/explore/referencing.png";
import support_png from "../../images/explore/support.png";
import store_png from "../../images/explore/ecostore.png";
import "./index.css";
import { TerritoryOptions, CurrencyOptions } from "../../Utils/Constants";

class Explore extends React.Component {
  timerId;

  constructor(props) {
    super(props);
    this.state = {
      top10Retailers: [],
      timeToGo: 0,
      territory: "UK",
    };
  }

  componentDidMount() {
    const { profile } = this.props;
    if (!profile) {
      this.props.history.push("/");
      return;
    }
    const territory =
      profile && profile.phonenumber.includes("+44") ? "UK" : "USA";
    this.setState({ territory });
    Firebase.getAllDeactiveRetailers((res) => {
      let deactive = [];
      if (res) deactive = res;
      Firebase.getAllRetailers((res) => {
        const top10Retailers = res.filter(
          (obj) =>
            !deactive[obj.uid] &&
            obj.top10 &&
            obj.top10 != "none" &&
            (obj.territory || TerritoryOptions[0]) === territory
        );
        this.setState({ top10Retailers });
        if (top10Retailers.length > 0) {
          this.delayLinks();
        }
      });
    });
    Firebase.getPremierTokenHistory("Rental Community", profile.uid, (history) => {
      let production_ptoken = 0;
      let sandbox_ptoken = 0;
      history.map((history) => {
        const { amount, environment } = history;
        environment === "production"
          ? (production_ptoken += amount)
          : (sandbox_ptoken += amount);
      });
      this.setState({
        production_ptoken: -production_ptoken,
        sandbox_ptoken: -sandbox_ptoken,
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
      offset: 30,
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
    localStorage.removeItem("profile");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };

  render() {
    const { top10Retailers, territory,production_ptoken,sandbox_ptoken } = this.state;
    const {profile}=this.props;
    return (
      <div id="page-container" className="explore-page-container">
        <div id="main-container">
          <div className="explore-item-wrapper d-flex">
          <div className="explore-token-wrapper">
              <div className="token-container">
                <div className="tokens-counter-wrapper">
                  <p className="tokens">
                    {(profile &&
                      (profile.tokens || 0) - (profile.tokenSpent || 0)) ||
                      0}
                  </p>
                  <img src={eco_sub_img} alt="coin" />
                </div>
                <label>
                  Shopping <br />
                  Token Balance
                </label>
              </div>
              <div className="token-description">
                Deduct from shopping baskets
                <br />
                at 3-15% on each spend.
              </div>
            </div>
            <div className="explore-token-wrapper eco-token">
              <div className="token-container">
                <div className="tokens-counter-wrapper">
                  <p>
                    {process.env.REACT_APP_ENVIRONMENT
                      ? production_ptoken
                      : sandbox_ptoken}
                  </p>
                  <img src={live_sub_img} alt="coin" />
                </div>
                <label>
                  Premium
                  <br />
                  Token Balance
                </label>
              </div>
              <div className="token-description">
                Spend at unrestricted value, as if there were a new digital
                currency.
              </div>
            </div>
            <NavLink
              to={{ pathname: "/spend" }}
              className={`explore-top-offer ${
                top10Retailers.length > 0 ? "show" : "hide"
              }`}
            >
              <div className="element" id="containerElement">
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
              </div>
            </NavLink>
            <NavLink to="/property" className="explore-item-button">
              <img src={property_png} />
              <span className="nav-main-link-name">Properties</span>
            </NavLink>
            <NavLink to="/profile" className="explore-item-button">
              <img src={security_png} />
              <span className="nav-main-link-name">ID</span>
            </NavLink>
            <NavLink to="/referencing" className="explore-item-button">
              <img src={referencing_png} />
              <span className="nav-main-link-name">Referencing</span>
            </NavLink>
            {/* <NavLink to="/housemates" className="explore-item-button">
              <img src={housemates_png} />
              <span className="nav-main-link-name">Housemates</span>
            </NavLink> */}
            
            {/* <NavLink to="/feeds" className="explore-item-button">
              <img src={feeds_png} />
              <span className="nav-main-link-name">Feeds</span>
            </NavLink>
            <NavLink to="/polls" className="explore-item-button">
              <img src={polls_png} />
              <span className="nav-main-link-name">Polls</span>
            </NavLink> */}
            <NavLink
              to={{
                pathname: "/spend",
              }}
              className="explore-item-button"
            >
              <img src={token_img} />
              <span className="nav-main-link-name">Token Offers</span>
            </NavLink>
            {/* <NavLink
              to={{
                pathname: "/earn",
              }}
              className="explore-item-button"
            >
              <img src={chip_png} />
              <span className="nav-main-link-name">Earn Tokens</span>
            </NavLink> */}
            <NavLink
              to={{
                pathname: "/wallets",
              }}
              className="explore-item-button"
            >
              <img src={wallet_png} />
              <span className="nav-main-link-name">Token Wallet</span>
            </NavLink>
            <NavLink
              to={{
                pathname: "/ecopay",
              }}
              className="explore-item-button"
            >
              <img src={pay_png} />
              <span className="nav-main-link-name">Token Pay</span>
            </NavLink>
            <NavLink
              to={{
                pathname: "/shop",
              }}
              className="explore-item-button"
            >
              <img src={store_png} />
              <span className="nav-main-link-name">Marketplace</span>
            </NavLink>
            <NavLink
              to={{
                pathname: "/support",
              }}
              className="explore-item-button"
            >
              <img src={support_png} />
              <span className="nav-main-link-name">Support</span>
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
    profile: state.profile,
    uid: state.uid,
  };
}
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Explore)
);

import React from "react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import classnames from "classnames";
import "./index.css";
import logoImg from "../../assets/media/logo.png";
import burgerImg from "../../images/burger.png";
import nav_live_coin_img from "../../images/explore/yellow-circle.png";
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
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false,
    };
    this.outOfMenu = React.createRef();
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClick, true);
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClick, true);
  }
  toggleMenu = () => {
    const { menuVisible } = this.state;
    this.setState({ menuVisible: !menuVisible });
  };
  click = () => {
    this.setState({ menuVisible: false });
  };

  goToCommunity = () => {
    const { brand } = this.props;
    if (brand) {
      window.open(
        `https://ecosystem.life/${(brand.name || "")
          .replace(/\s/g, "")
          .toLowerCase()}`,
        "_blank"
      );
    }
  };
  //  start of when click the outsite of menu
  handleClickOutSide() {
    this.setState({ menuVisible: false });
  }
  handleClick = (e) => {
    if (!this.outOfMenu.current.contains(e.target)) {
      this.handleClickOutSide();
    } else {
      return;
    }
  };
  render() {
    const { profile, brand, logout, history } = this.props;
    const { menuVisible } = this.state;
    let username = "";
    let logo = "";
    let tokens = 0;
    if (profile) {
      username = profile.firstname;
      logo = brand.logo;
      tokens = profile.tokens ? profile.tokens : 0;
    }
    return (
      <header id="page-header" className="page-header-glass">
        <div className="content-header">
          <div className="heading">
            <button
              className="header-logo"
              style={{
                backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/boltconcierge-2f0f9.appspot.com/o/brand_logo%2FRental%20Community?alt=media&token=8f0426f6-3e6c-4b75-9b6a-e8117892f137)`,
                // backgroundImage: `url(${default_logo})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundColor: "transparent",
                border: "none",

                cursor: "pointer",
                width: 180,
                height: 60,
              }}
            >
              {/* <img src={logo ? logo : default_logo} height="60px" alt="logo" /> */}
            </button>

            <ul
              className={menuVisible ? "show" : "hide"}
              onClick={this.click}
              ref={this.outOfMenu}
            >
              <li className="nav-main-item profile">
                <NavLink
                  to={{
                    pathname: "/explore",
                  }}
                  className="nav-main-link"
                >
                  <i className="nav-main-link-icon si si-compass" />
                  Explore
                </NavLink>
              </li>
              <li className="nav-main-item" onClick={this.click}>
                <NavLink to="/profile" className={classnames("nav-main-link")}>
                  <img
                    style={{ width: 12, marginRight: 10 }}
                    src={security_png}
                  />
                  <span className="nav-main-link-name">ID</span>
                </NavLink>
              </li>
              {/* <li className="nav-main-item">
                <NavLink to="/home" className={classnames("nav-main-link")}>
                  <span className="nav-main-link-name">My Home</span>
                </NavLink>
              </li> */}
              <li className="nav-main-item" onClick={this.click}>
                <NavLink
                  to="/housemates"
                  className={classnames("nav-main-link")}
                >
                  <img
                    style={{ width: 12, marginRight: 10 }}
                    src={housemates_png}
                  />
                  <span className="nav-main-link-name">Housemates</span>
                </NavLink>
              </li>
              <li className="nav-main-item" onClick={this.click}>
                <NavLink
                  to="/property"
                  className={classnames("nav-main-link")}
                >
                  <img
                    style={{ width: 12, marginRight: 10 }}
                    src={property_png}
                  />
                  <span className="nav-main-link-name">Property</span>
                </NavLink>
              </li>
              <li className="nav-main-item" onClick={this.click}>
                <NavLink
                  to="#"
                  className={classnames("nav-main-link")}
                >
                  <img
                    style={{ width: 12, marginRight: 10 }}
                    src={feeds_png}
                  />
                  <span className="nav-main-link-name">Feeds</span>
                </NavLink>
              </li>
              <li className="nav-main-item" onClick={this.click}>
                <NavLink
                  to="#"
                  className={classnames("nav-main-link")}
                >
                  <img
                    style={{ width: 12, marginRight: 10 }}
                    src={polls_png}
                  />
                  <span className="nav-main-link-name">Polls</span>
                </NavLink>
              </li>
              {/* <li className="nav-main-item" onClick={this.click}>
                <NavLink
                  to="/propertypa"
                  className={classnames("nav-main-link")}
                >
                  <img
                    style={{ width: 12, marginRight: 10 }}
                    src={propertypa_png}
                  />
                  <span className="nav-main-link-name">Property PA</span>
                </NavLink>
              </li> */}
              {/* <li className="nav-main-item" onClick={this.click}>
                <NavLink to="/tickets" className={classnames("nav-main-link")}>
                  <img
                    style={{ width: 12, marginRight: 10 }}
                    src={tickets_png}
                  />
                  <span className="nav-main-link-name">Tickets</span>
                </NavLink>
              </li> */}
              {/* <li className="nav-main-item" onClick={this.click}>
                <NavLink to="/shop" className={classnames("nav-main-link")}>
                  <span className="nav-main-link-name">Shop</span>
                </NavLink>
              </li> */}
              <li className="nav-main-item">
                <NavLink
                  to={{
                    pathname: "/spend",
                  }}
                  className="nav-main-link"
                >
                  <img style={{ width: 12, marginRight: 10 }} src={token_img} />
                  <span className="nav-main-link-name">Token Offers</span>
                </NavLink>
              </li>
              <li className="nav-main-item">
                <NavLink
                  to={{
                    pathname: "/earn",
                  }}
                  className="nav-main-link"
                >
                  <img style={{ width: 12, marginRight: 10 }} src={chip_png} />
                  <span className="nav-main-link-name">Earn Tokens</span>
                </NavLink>
              </li>
              <li className="nav-main-item">
                <NavLink
                  to={{
                    pathname: "/wallets",
                  }}
                  className="nav-main-link"
                >
                  <img
                    style={{ width: 12, marginRight: 10 }}
                    src={wallet_png}
                  />
                  <span className="nav-main-link-name">EcoWallet</span>
                </NavLink>
              </li>
              <li className="nav-main-item">
                <NavLink
                  to={{
                    pathname: "/ecopay",
                  }}
                  className="nav-main-link"
                >
                  <img style={{ width: 12, marginRight: 10 }} src={pay_png} />
                  <span className="nav-main-link-name">EcoPay</span>
                </NavLink>
              </li>
              <li className="nav-main-item">
                <NavLink
                  to={{
                    pathname: "/shop",
                  }}
                  className="nav-main-link"
                >
                  <img
                    style={{ width: 12, marginRight: 10 }}
                    src={shopping_bag_png}
                  />
                  <span className="nav-main-link-name">EcoShop</span>
                </NavLink>
              </li>
              <li className={`nav-main-item burger show`}>
                <a className="nav-main-link" onClick={logout}>
                  <span className="nav-main-link-name">Sign Out</span>
                </a>
              </li>
            </ul>
            <div
              className={`nav-token-counter-wrapper margin_img ${
                menuVisible ? "hide" : "show"
              }`}
            >
              <p className="tokens">
                {tokens - ((profile && profile.tokenSpent) || 0)}
              </p>
              <img
                src={nav_live_coin_img}
                style={{ width: "32px", height: "32px" }}
              />
            </div>
            <button
              className={`burger ${menuVisible ? "hide" : "show"}`}
              onClick={() => {
                this.toggleMenu();
              }}
            >
              <img
                className="img-burger"
                src={burgerImg}
                width="30"
                alt="burger"
              />
            </button>
          </div>
          <div className="second_menu header-actions-container">
            {/* <button
              class="btn btn-block btn-hero-lg btn-hero-success view-platform-btn"
              onClick={this.goToCommunity}
            >
              Visit your community
            </button> */}
            <div className="dropdown d-inline-block">
              <button
                type="button"
                className="btn nav-btn top-btn"
                id="page-header-notifications-dropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fas fa-user" />
                <span className="badge  badge-pill">
                  {profile && profile.firstname}
                </span>
              </button>
              <div
                className="dropdown-menu dropdown-menu-lg dropdown-menu-right p-0"
                aria-labelledby="page-header-notifications-dropdown"
              >
                <div className="p-2 border-top">
                  <button
                    className="btn btn-light btn-block text-center"
                    onClick={logout}
                  >
                    <i className="nav-main-link-icon si si-logout" />
                    &nbsp;&nbsp;&nbsp;Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
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
    brand: state.brand,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);

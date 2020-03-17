import React from "react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import classnames from "classnames";
import "./index.css";
import logoImg from "../../assets/media/logo.png";
import burgerImg from "../../assets/media/icons/burger.png";
const poker_chip = require("../../assets/media/icons/wallet.png");
const nav_live_coin_img = require("../../images/nav_live_coin.png");
const resp_live_coin_img = require("../../images/resp_live_coin.png");

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false
    };
  }
  toggleMenu = () => {
    const { menuVisible } = this.state;
    this.setState({ menuVisible: !menuVisible });
  };
  click = () => {
    this.setState({ menuVisible: false });
  };
  signOut = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("profile");
    localStorage.removeItem("brand");
    window.location = "/login"
  }
  render() {
    const { profile, brand, logout, history } = this.props;
    const { menuVisible } = this.state;

    let username = "";
    let logo = "";
    let tokens = 0;
    let isRenter = false;
    if (profile) {
      username = profile.firstname;
      logo = brand.logo;
      tokens = profile.tokens ? profile.tokens : 0;
      isRenter = profile.renter_owner === "Renter"
    }

    return (
      <header id="page-header" className="page-header-glass">
        <div id="top-menu">
          <img src={logo} />
          <ul>
            <li>
              <a onClick={() => { window.location = "/community/" }}>Community</a>
            </li>
            <li>
              <a onClick={() => { window.location = "/concierge/" }}>Concierge</a>
            </li>
            <li className="active">
              <a onClick={() => { window.location = "/myhome/" }}>My Home</a>
            </li>
          </ul>
          <div className="nav-token-counter-wrapper mr-2">
            <p>{tokens}</p>
            <img src={nav_live_coin_img} alt="coin" />
          </div>
          <div className="dropdown d-inline-block">
            <button
              type="button"
              className="btn top-btn"
              id="page-header-notifications-dropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-user" />
              <span className="badge  badge-pill">{username}</span>
            </button>
            <div
              className="dropdown-menu dropdown-menu-lg dropdown-menu-right p-0"
              aria-labelledby="page-header-notifications-dropdown"
            >
              <div className="p-2 border-top">
                <button
                  className="btn btn-light btn-block text-center"
                  onClick={this.signOut}
                >
                  <i className="fa fa-sign-out-alt" />
                  &nbsp;&nbsp;&nbsp;Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="content-header">
          <div className="heading">
            <a className="link-fx font-w600 font-size-lg text-white" href="/">
              <span className="smini-hidden mobile-show">
                <span className="text-white-75">
                  <img src={brand.logo} style={{ width: 150 }} alt="logo" />
                </span>
              </span>
            </a>

            <ul className={menuVisible ? "show" : "hide"}>
              <li className="nav-main-item mobile-show">
                <a className="nav-main-link" onClick={() => { window.location = "/community/" }}>Community</a>
              </li>
              <li className="nav-main-item mobile-show">
                <a className="nav-main-link" onClick={() => { window.location = "/concierge/" }}>Concierge</a>
              </li>
              <li className="nav-main-item mobile-show">
                <a className="nav-main-link" onClick={() => { window.location = "/myhome/" }}>My Home</a>
              </li>
              {isRenter && (
                <li className="nav-main-item" onClick={this.click}>
                  <NavLink to="/profile" className={classnames("nav-main-link")}>
                    <span className="nav-main-link-name">Rent ID</span>
                  </NavLink>
                </li>
              )}
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
                  <span className="nav-main-link-name">Housemates</span>
                </NavLink>
              </li>
              <li className="nav-main-item" onClick={this.click}>
                <NavLink
                  to="/newproperty"
                  className={classnames("nav-main-link")}
                >
                  <span className="nav-main-link-name">{isRenter ? 'Properties' : 'Property Profile'}</span>
                </NavLink>
              </li>
              {isRenter && (
                <li className="nav-main-item" onClick={this.click}>
                  <NavLink
                    to="/referencing"
                    className={classnames("nav-main-link")}
                  >
                    <span className="nav-main-link-name">Rent Reference</span>
                  </NavLink>
                </li>
              )}
              <li className="nav-main-item" onClick={this.click}>
                <NavLink
                  to="/concierge"
                  className={classnames("nav-main-link")}
                >
                  <span className="nav-main-link-name">Home Concierge</span>
                </NavLink>
              </li>
              <li className="nav-main-item" onClick={this.click}>
                <NavLink to="/tickets" className={classnames("nav-main-link")}>
                  <span className="nav-main-link-name">Home Tickets</span>
                </NavLink>
              </li>
              {/* <li className="nav-main-item" onClick={this.click}>
                <NavLink to="/shop" className={classnames("nav-main-link")}>
                  <span className="nav-main-link-name">Shop</span>
                </NavLink>
              </li> */}
              <button onClick={logout} type="button" className="btn mobile-show">
                <i className="si si-logout" />
                <p style={{ color: "black", width: 100, marginLeft: 5 }}>
                  Logout
                </p>
              </button>
            </ul>
            <button
              className={`burger ${menuVisible ? "hide" : "show"}`}
              onClick={this.toggleMenu}
            >
              <img src={burgerImg} width="30" alt="burger" />
            </button>
          </div>
        </div>
      </header>
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
    profile: state.profile,
    brand: state.brand
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);

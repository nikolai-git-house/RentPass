import React from "react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import classnames from "classnames";
import "./index.css";
import logoImg from "../../assets/media/logo.png";
import burgerImg from "../../images/burger.png";
import nav_live_coin_img from "../../images/nav_live_coin.png";
import token_img from "../../images/chip.png";
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false,
    };
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
                backgroundImage: logo ? `url(${logo})` : `url(${logoImg})`,
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

            <ul className={menuVisible ? "show" : "hide"}>
              <li className="nav-main-item" onClick={this.click}>
                <NavLink to="/profile" className={classnames("nav-main-link")}>
                  <span className="nav-main-link-name">My Profile</span>
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
                  <span className="nav-main-link-name">My Housemates</span>
                </NavLink>
              </li>
              <li className="nav-main-item" onClick={this.click}>
                <NavLink
                  to="/newproperty"
                  className={classnames("nav-main-link")}
                >
                  <span className="nav-main-link-name">My Property</span>
                </NavLink>
              </li>
              <li className="nav-main-item" onClick={this.click}>
                <NavLink to="/tickets" className={classnames("nav-main-link")}>
                  <span className="nav-main-link-name">Tickets</span>
                </NavLink>
              </li>
              <li className="nav-main-item" onClick={this.click}>
                <NavLink to="/shop" className={classnames("nav-main-link")}>
                  <span className="nav-main-link-name">Shop</span>
                </NavLink>
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
            <button
              class="btn btn-block btn-hero-lg btn-hero-success view-platform-btn"
              onClick={this.goToCommunity}
            >
              Visit your community
            </button>
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

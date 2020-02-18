import React from "react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import classnames from "classnames";
import "./index.css";
import logoImg from "../../assets/media/logo.png";
import burgerImg from "../../assets/media/icons/burger.png";
const poker_chip = require("../../assets/media/icons/wallet.png");

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
  render() {
    const { profile, brand, logout, history } = this.props;
    const { menuVisible } = this.state;
    console.log("history", history);
    return (
      <header id="page-header" className="page-header-glass">
        <div className="content-header">
          <div className="heading">
            <a className="link-fx font-w600 font-size-lg text-white" href="/">
              <span className="smini-hidden">
                <span className="text-white-75">
                  <img src={brand.logo} style={{ width: 150 }} alt="logo" />
                </span>
              </span>
            </a>

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
                  <span className="nav-main-link-name">My Properties</span>
                </NavLink>
              </li>
              <li className="nav-main-item" onClick={this.click}>
                <NavLink
                  to="/referencing"
                  className={classnames("nav-main-link")}
                >
                  <span className="nav-main-link-name">Referencing</span>
                </NavLink>
              </li>
              <li className="nav-main-item" onClick={this.click}>
                <NavLink
                  to="/concierge"
                  className={classnames("nav-main-link")}
                >
                  <span className="nav-main-link-name">Concierge</span>
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
              <button onClick={logout} type="button" className="btn">
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

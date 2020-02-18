import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import logoImg from "../../assets/media/logo.png";
import "./index.css";

// eslint-disable-next-line react/prefer-stateless-function
class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { showSidebar, token, username } = this.props;
    const path = "";
    return (
      <nav id="sidebar">
        <div className="simplebar-scroll-content">
          <div className="simplebar-content">
            <div className="my-bg-header">
              <div className="content-header bg-white-10">
                <a
                  className="link-fx font-w600 font-size-lg text-white"
                  href="/"
                >
                  <span className="smini-hidden">
                    <span className="text-white-75">
                      <img src={logoImg} style={{ width: 150 }} alt="logo" />
                    </span>
                  </span>
                </a>
              </div>
            </div>
            <div className="content-side content-side-full">
              <ul className="nav-main">
                <li className="nav-main-item">
                  <Link
                    to="/home"
                    className={classnames("nav-main-link", {
                      active: path === "/home"
                    })}
                  >
                    <i className="nav-main-link-icon si si-home" />
                    <span className="nav-main-link-name">Home</span>
                  </Link>
                </li>
                <li className="nav-main-item">
                  <Link
                    to="/properties"
                    className={classnames("nav-main-link", {
                      active: path === "/properties"
                    })}
                  >
                    <i className="nav-main-link-icon si si-rocket" />
                    <span className="nav-main-link-name">Properties</span>
                  </Link>
                </li>
                <li className="nav-main-item">
                  <Link
                    to="/tenants"
                    className={classnames("nav-main-link", {
                      active: path === "/tenants"
                    })}
                  >
                    <i className="nav-main-link-icon si si-cup" />
                    <span className="nav-main-link-name">Tenants</span>
                  </Link>
                </li>
                <li className="nav-main-item">
                  <Link
                    to="/tickets"
                    className={classnames("nav-main-link", {
                      active: path === "/tickets"
                    })}
                  >
                    <i className="nav-main-link-icon si si-cursor" />
                    <span className="nav-main-link-name">Tickets</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
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
    showSidebar: state.showSidebar
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);

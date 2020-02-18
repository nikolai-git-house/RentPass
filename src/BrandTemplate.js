import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Firebase from "./firebasehelper";
import LogIn from "./screens/LogIn";
import SignUp from "./screens/SignUp";
import AuthReminder from "./screens/AuthReminder";
import AppTemplate from "./screens/AppTemplate";
class BrandTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      background: "#fff"
    };
  }
  componentDidMount() {
    const { name, logo, color, icon } = this.props;
    console.log("name,logo,icon", name, logo, icon);
    document.title = name;
    let link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/png";
    link.rel = "icon";
    link.href = icon;
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  render() {
    const { background } = this.state;
    const { name, icon } = this.props;
    return (
      <Route>
        <Route exact path="/" component={LogIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/authreminder" component={AuthReminder} />
        {/* <Route component={AppTemplate} /> */}
      </Route>
    );
  }
}
export default BrandTemplate;

import React from "react";
import { connect } from "react-redux";
import classNames from "classnames";

import { Route, Switch } from "react-router-dom";
import Profile from "../Profile";
import Home from "../Home";
import Properties from "../Properties";
import Housemates from "../Housemates";
import Referencing from "../Referencing";
import Concierge from "../Concierge";
import Tickets from "../Tickets";
import Shop from "../Shop";
import NewProperty from "../NewProperty";
import Header from "../../Components/Header";
import { removeAll, saveUID, saveProfile, saveBrand, saveUsers } from "../../redux/actions";
import "./index.css";

class AppTemplate extends React.Component {
  state = {
    loading: true
  }
  componentDidMount() {
    let uid = localStorage.getItem("uid");
    let profile = localStorage.getItem("profile");
    let brand_data = localStorage.getItem("brand");
    let users = localStorage.getItem("rentkey_users");
    if (uid) {
      this.props.dispatch(saveUID(uid));
      this.props.dispatch(saveProfile(JSON.parse(profile)));
      this.props.dispatch(saveBrand(JSON.parse(brand_data)));
      this.props.dispatch(saveUsers(JSON.parse(users)));
      this.props.history.push("/newproperty");
      console.log("uid", uid);
      console.log("profile", profile);
      console.log("brand_data", JSON.parse(brand_data));
      console.log("users", JSON.parse(users));
      this.setState({ loading: false })
    } else {
      window.location = "/login"
    }
  }

  logout = () => {
    console.log("logout");
    localStorage.removeItem("rentkey_uid");
    localStorage.removeItem("rentkey_profile");
    localStorage.removeItem("rentkey_brand_data");
    localStorage.removeItem("rentkey_users");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };
  render() {
    const { showSideBar } = this.props;
    const { loading } = this.state;

    console.log("showSidebar", this.props);
    return (
      <div id="page-container">
        <Header logout={this.logout} {...this.props} />
        {!loading && (
          <Switch>
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/properties" component={Properties} />
            <Route exact path="/housemates" component={Housemates} />
            <Route exact path="/newproperty" component={NewProperty} />
            <Route exact path="/referencing" component={Referencing} />
            <Route exact path="/concierge" component={Concierge} />
            <Route exact path="/tickets" component={Tickets} />
            <Route exact path="/shop" component={Shop} />
            {/* <Route exact path="/yield" component={Yield} />
        <Route exact path="/compliance" component={Compliance} /> */}
          </Switch>
        )}

      </div>
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
    showSideBar: state.showSidebar,
    location: state.location
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AppTemplate);

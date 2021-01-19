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
import Perks from "../Perks";
import EarnTokens from "../EarnTokens";
import Wallets from "../Wallets";
import Ecopay from "../Ecopay";
import Header from "../../Components/Header";
import Explore from "../Explore";
import Friends from "../Friends";
import Support from "../Support";
import PropertyPA from "../PropertyPA";
import Landing from "../Landing";
import { removeAll } from "../../redux/actions";
import "./index.css";

class AppTemplate extends React.Component {
  logout = () => {
    console.log("logout");
    localStorage.removeItem("uid");
    localStorage.removeItem("profile");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };
  render() {
    const { showSideBar } = this.props;
    return (
      <div id="page-container">
        <Header logout={this.logout} {...this.props} />
        <div style={{height:70}}></div>
        <Switch>
          <Route exact path="/landing" component={Landing} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/properties" component={Properties} />
          <Route exact path="/housemates" component={Housemates} />
          <Route exact path="/property" component={NewProperty} />
          <Route exact path="/referencing" component={Referencing} />
          <Route exact path="/concierge" component={Concierge} />
          <Route exact path="/tickets" component={Tickets} />
          <Route exact path="/shop" component={Shop} />
          <Route path="/spend" component={Perks} />
          <Route path="/earn" component={EarnTokens} />
          <Route path="/wallets" component={Wallets} />
          <Route path="/ecopay" component={Ecopay} />
          <Route path="/explore" component={Explore} />
          <Route path="/friends" component={Friends} />
          <Route path="/support" component={Support} />
          {/* <Route path="/propertypa" component={PropertyPA} /> */}
        </Switch>
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
    showSideBar: state.showSidebar,
    location: state.location,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AppTemplate);

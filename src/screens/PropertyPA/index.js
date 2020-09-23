import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Firebase from "../../firebasehelper";

import "./index.css";
import MessageList from "./MessageList";

class PropertyPA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chat_started: false,
      restart: false,
      loading: true,
      background: "#fff",
      services_routing: [],
      tier_data: [],
    };
  }

  componentDidMount() {
    const { uid, profile, brand } = this.props;
    if (!uid) {
      this.props.history.push("/");
      return;
    }

    const { name, icon } = brand;
    console.log(brand);
    Firebase.getServicesRouting(name, (res) => {
      //this.setState({ services_routing: res });
      let promise = res.map(async (item, index) => {
        let tier1 = item.tier1;
        let tier2 = item.tier2;

        if (tier2 == null) {
          let tier1_data = await Firebase.getTier1byID(tier1.id);
          let data = tier1_data;
          data["value"] = [];
          data.is_brandRouting = item.is_brandRouting;
          data.active = tier1.active;
          data.id = tier1.id;
          return data;
        } else {
          let tier1_data;
          tier1_data = await Firebase.getTier1byID(tier1.id);

          let tier2_data = await this.getTier2DatafromTier2(tier2);
          const { title, src } = tier1_data;
          let data = { title: title, src: src };
          data["value"] = tier2_data;
          data.is_brandRouting = item.is_brandRouting;
          data.active = tier1.active;
          data.id = tier1.id;
          return data;
        }
      });
      Promise.all(promise)
        .then((tier_res) => {
          console.log("tier_results", tier_res);
          let uid = localStorage.getItem("uid");
          this.setState({
            uid: uid,
            restart: true,
            loading: false,
            tier_data: tier_res,
          });
        })
        .catch((err) => {
          console.log("err", err);
        });
    });

    if (name === "Starling") {
      this.setState({ background: "#1E1936" });
    }
    document.title = name;
    let link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/png";
    link.rel = "icon";
    link.href = icon;
    document.getElementsByTagName("head")[0].appendChild(link);
  }

  componentWillUnmount() {}

  getTier2DatafromTier2 = (tier2) => {
    if (tier2) {
      let tier2_promise = tier2.map(async (item) => {
        let category_data = await Firebase.getCategorybyID(item.id);
        const { topic, image, site_url } = category_data;
        if (item.id === 0)
          return {
            id: 0,
            title: "Home Emergency",
            src: image,
            active: item.active,
          };
        else if (item.id === 1)
          return {
            id: 1,
            title: "Home Repairs",
            src: image,
            active: item.active,
          };
        else
          return {
            id: item.id,
            title: topic,
            src: image,
            active: item.active,
            site_url,
          };
      });
      return Promise.all(tier2_promise);
    }
  };

  startChat = (uid, profile, ticket_id) => {
    this.setState({
      chat_started: true,
      uid,
      profile,
      ticket_id,
    });
  };

  onEndChat = () => {
    this.setState({ chat_started: false, restart: true });
    console.log("chat_ended");
  };

  render() {
    const { profile, brand } = this.props;
    const { name, icon } = brand;
    const { loading, restart, uid, tier_data } = this.state;
    return (
      <div id="page-container" className="propertypa-page-container">
        <div id="main-container">
          {loading && (
            <div className="text-center">
              <i className="fa fa-4x fa-sync fa-spin text-muted mt-5" />
            </div>
          )}
          {!loading && (
            <MessageList
              logo={name}
              icon="https://firebasestorage.googleapis.com/v0/b/boltconcierge-2f0f9.appspot.com/o/brand_icon%2FRental%20Community?alt=media&token=2e96bade-f7f1-4dbd-afd9-6f7caa9d4dc8"
              onStartChat={this.startChat}
              restart={restart}
              uid={uid}
              profile={profile}
              tier_data={tier_data}
            />
          )}
        </div>
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
  connect(mapStateToProps, mapDispatchToProps)(PropertyPA)
);

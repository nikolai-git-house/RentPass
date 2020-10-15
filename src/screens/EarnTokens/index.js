import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./index.css";
import Firebase from "../../firebasehelper";
import EarnCommunity from "./components/EarnCommunity";
import SwitchBar from "./components/SwitchBar";
import FilterTab from "./components/FilterTab";
import { removeAll } from "../../redux/actions";
import ProfileModal from "../../Components/ProfileModal";
import SubscriptionModal from "../../Components/SubscriptionModal";
import TimelineModal from "../../Components/TimelineModal";

class EarnTokens extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      retailers: [],
      loading: true,
      tag: "Top 10",
      sel_view: "community",
      tokenEarnings: [],
    };
  }
  componentDidMount() {
    const { uid, profile, brand } = this.props;

    if (!uid) this.props.history.push("/");

    Firebase.getAllRetailers((res) => {
      this.setState({ loading: false });
      this.setState({ retailers: res });
    });
    Firebase.getAllTokenEarnings((tokenEarnings) => {
      let new_tokenEarnings = tokenEarnings.filter(obj=>obj.brand==="Rental Community"||!obj.brand);
      this.setState({ tokenEarnings:new_tokenEarnings });
    });
  }

  filter_View = (tag) => {
    if (tag === "all") this.setState({ tag: "" });
    else this.setState({ tag });
  };
  signOut = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("profile");
    localStorage.removeItem("brand");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };
  renderTokensList = () => {
    const { loading, tag, retailers, sel_view } = this.state;
    return (
      <React.Fragment>
        {!loading && (
          <div className="tiles earn-tokens-list-wrapper">
            {retailers.map((item, index) => {
              if (tag == "Top 10" && (!item.top10 || item.top10 == "none")) {
                return;
              } else if (tag && tag != "Top 10" && item.retailerType != tag) {
                return;
              }

              let redeemed = {
                fullTokens: 0,
                partTokens: 0,
                threshold: 0,
              };
              if (item.redeemed) {
                redeemed = item.redeemed;
                if (!redeemed.fullTokens) {
                  redeemed.fullTokens = 0;
                }
                if (!redeemed.partTokens) {
                  redeemed.partTokens = 0;
                }
                if (!redeemed.threshold) {
                  redeemed.threshold = 0;
                }
              }
              redeemed.fullTokens = parseFloat(redeemed.fullTokens);
              redeemed.partTokens = parseFloat(redeemed.partTokens);
              let gift = {};
              gift.fullTokens = 0;
              gift.partTokens = 0;
              gift.threshold = 0;
              if (item.gift) {
                gift = item.gift;
                if (!gift.fullTokens) {
                  gift.fullTokens = 0;
                }
                if (!gift.partTokens) {
                  gift.partTokens = 0;
                }
                if (!gift.threshold) {
                  gift.threshold = 0;
                }
              }
              gift.fullTokens = parseFloat(gift.fullTokens);
              gift.partTokens = parseFloat(gift.partTokens);
              return (
                <div
                  id={index}
                  key={index}
                  className="deal"
                  style={{
                    backgroundImage: `url(${item.background})`,
                  }}
                >
                  <div className="deal-caption" style={{ paddingTop: "35px" }}>
                    <span style={{ marginTop: "10px" }}>Earn</span>
                    <span className="top10" style={{ marginTop: "0px" }}>
                      {gift.fullTokens +
                        gift.partTokens +
                        " tokens on £" +
                        gift.threshold}
                    </span>
                  </div>
                  <div
                    className="deal-logo"
                    style={{
                      backgroundImage: `url(${item.logo})`,
                      margin: "25px auto",
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        )}
      </React.Fragment>
    );
  };

  switchView = (sel_view) => {
    this.setState({ sel_view });
  };

  renderContents() {
    const { sel_view, tag, tokenEarnings } = this.state;
    return (
      <React.Fragment>
        {/* <div className="switch-bar-wrapper">
          <SwitchBar handleSwitch={this.switchView} value={sel_view} />
        </div> */}
        {sel_view === "spending" && (
          <div className="filter-bar-wrapper">
            <FilterTab filter_View={this.filter_View} tag={tag} />
          </div>
        )}
        {sel_view === "spending" && (
          <div className="fixed-button-wrapper">
            <button
              className="cc-btn cc-btn-yellow cc-btn-long"
              onClick={() => window.Fidel.openForm()}
            >
              Link bank cards to earn tokens on spends
            </button>
          </div>
        )}
        <div className="content pt-0">
          {sel_view === "spending" && this.renderTokensList()}
          {sel_view === "community" && (
            <EarnCommunity tokenEarnings={tokenEarnings} />
          )}
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { sel_view, loading } = this.state;
    return (
      <div id="page-container" className="earntokens-container">
        <main id="main-container">
          {loading && (
            <div className="text-center">
              <i className="fa fa-4x fa-sync fa-spin text-muted mt-5" />
            </div>
          )}
          {!loading && this.renderContents()}
        </main>
        <ProfileModal />
        <SubscriptionModal />
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
    uid: state.uid,
    profile: state.profile,
    brand: state.brand,
  };
}
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EarnTokens)
);

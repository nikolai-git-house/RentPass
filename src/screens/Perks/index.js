import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./index.css";
import Firebase from "../../firebasehelper";
import FilterTab from "./components/FilterTab";
import TokenGuide from "../../Components/TokenGuide";
import { removeAll } from "../../redux/actions";
import ProfileModal from "../../Components/ProfileModal";
import SubscriptionModal from "../../Components/SubscriptionModal";
import TimelineModal from "../../Components/TimelineModal";
import { TerritoryOptions, CurrencyOptions } from "../../Utils/Constants";

class Perks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      retailers: [],
      loading: true,
      tag: "Top 10",
      offer_type: "earn",
    };
  }
  componentDidMount() {
    const { uid, profile, brand } = this.props;

    if (!uid) this.props.history.push("/");

    const brandTerritory = (brand && brand.territory) || TerritoryOptions[0];
    Firebase.getAllDeactiveRetailers((res) => {
      let deactive = [];
      if (res) deactive = res;
      Firebase.getAllRetailers((resRetailers) => {
        this.setState({ loading: false });
        const retailers = resRetailers.filter((obj) => {
          const retailerTerritory = obj.territory || TerritoryOptions[0];
          return (
            !deactive[obj.uid] &&
            brandTerritory === retailerTerritory &&
            obj.ecopayRetailer
          );
        });
        this.setState({ retailers });
      });
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
  redeemToken = (token) => {
    this.props.history.push(`/ecopay?retailerId=${token.uid}`);
  };
  renderTokensList = () => {
    const { brand } = this.props;
    const territory = (brand && brand.territory) || TerritoryOptions[0];
    const { loading, tag, retailers, offer_type } = this.state;
    return (
      <React.Fragment>
        {!loading && (
          <div className="spend-tokens-list-wrapper">
            <TokenGuide territory={territory} />
            <div className="tiles">
              {retailers.map((item, index) => {
                if (tag == "Top 10" && (!item.top10 || item.top10 == "none")) {
                  return;
                } else if (tag && tag != "Top 10" && item.retailerType != tag) {
                  return;
                }

                let redeemed = {};
                redeemed.fullTokens = 0;
                redeemed.partTokens = 0;
                redeemed.threshold = 0;
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
                    onClick={() => this.redeemToken(item)}
                  >
                    <div
                      className="deal-caption"
                      style={{ paddingTop: "35px" }}
                    >
                      <span style={{ marginTop: "10px" }}>Redeem</span>
                      <span className="top10" style={{ marginTop: "0px" }}>
                        {redeemed.fullTokens +
                          redeemed.partTokens +
                          " tokens on " +
                          CurrencyOptions[territory] +
                          redeemed.threshold}
                      </span>
                      {/*<span style={{marginTop: "10px"}}>Earn</span>
                                            <span className="top10" style={{marginTop: "0px"}}>
                                              {(gift.fullTokens + gift.partTokens) + " tokens on £" + gift.threshold}
                                            </span>*/}
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
          </div>
        )}
      </React.Fragment>
    );
  };

  switchOffer = (offer_type) => {
    this.setState({ offer_type });
  };

  renderContents() {
    const { tag } = this.state;
    return (
      <React.Fragment>
        <div className="filter-bar-wrapper">
          <FilterTab filter_View={this.filter_View} tag={tag} />
        </div>
        <div className="content pt-0">{this.renderTokensList()}</div>
      </React.Fragment>
    );
  }

  render() {
    const { loading } = this.state;
    return (
      <div id="page-container" className="perks-container">
        <main id="main-container">
          {loading && (
            <div className="text-center">
              <i className="fa fa-4x fa-sync fa-spin text-muted mt-5" />
            </div>
          )}
          {!loading && this.renderContents()}
        </main>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Perks));

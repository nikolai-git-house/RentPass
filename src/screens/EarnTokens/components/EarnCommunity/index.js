import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import "./index.css";

import pending_token_png from "../../../../images/wallet/pending_token.png";
import gamification_jpg from "../../../../images/community/gamification.jpg";

function EarnCommunity(props) {
  const { tokenEarnings } = props;

  return (
    <React.Fragment>
      <div className="earn-community-container">
        <div className="d-flex w-100 just-content-center align-items-center earning-tokens-container">
          <div className="gamification-img-container">
            <img src={gamification_jpg} className="gamification-img" />
          </div>
          {tokenEarnings.map((item) => (
            <div className="token-item">
              <img src={item.icon} width="40" alt="icon" />
              <p className="token-item-text">{item.title}</p>
              <div className="token-item-number">
                <img src={pending_token_png} alt="token"></img>
                <p>{item.token}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
  };
}
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EarnCommunity)
);

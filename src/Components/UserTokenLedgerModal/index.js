import React from "react";
import _ from "lodash";
import moment from "moment";

import "./index.css";
import Firebase from "../../firebasehelper";

class UserTokenLedgerModal extends React.PureComponent {
  state = {
    history: {},
  };

  loadTokensHistory = async () => {
    const { brandName, user } = this.props;
    Firebase.getTokenHistory(brandName, user.id, (history) => {
      const groupedByDate = _.groupBy(history, (obj) =>
        moment(obj.created.toDate()).format("LL")
      );
      const tokensHistory = Object.keys(groupedByDate).reduce((prev, date) => {
        var spent = 0;
        var earned = 0;
        groupedByDate[date].forEach((obj1) => {
          if (obj1.amount > 0) {
            spent += obj1.amount;
          } else {
            earned += -obj1.amount;
          }
        });
        prev[date] = { spent, earned };
        return prev;
      }, {});
      this.setState({ history: tokensHistory });
    });
  };

  componentDidUpdate(prevProps) {
    const { user } = this.props;
    const { user: prevUser } = prevProps;

    if (user !== prevUser) {
      this.setState({ history: {} });
      this.loadTokensHistory();
    }
  }

  render() {
    const { user } = this.props;
    const { history } = this.state;

    return (
      <div
        className="modal fade"
        id="list_user_token_ledgers"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modal-default-fadein"
        aria-hidden="false"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{user.firstname}'s token ledger</h5>
            </div>
            <div className="modal-body pb-1">
              <div className="member-row">
                <p className="member-name">Date</p>
                <p className="member-name">Earned</p>
                <p className="member-name">Spent</p>
              </div>
              {Object.keys(history || {}).map((date) => (
                <div className="member-row">
                  <p className="member-name">
                    {moment(date).calendar(null, {
                      sameDay: "[Today]",
                      nextDay: "[Tomorrow]",
                      nextWeek: "dddd",
                      lastDay: "[Yesterday]",
                      lastWeek: "[Last] dddd",
                      sameElse: "DD/MM/YYYY",
                    })}
                  </p>
                  <p className="member-name">{history[date].earned}</p>
                  <p className="member-name">{history[date].spent}</p>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-light"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default UserTokenLedgerModal;

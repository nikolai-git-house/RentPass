import React from "react";
import { connect } from "react-redux";
import Firebase from "../../firebasehelper";
import "./index.css";
class SubscriptionModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      profile: props.profile
    };
  }
  componentDidMount() {
    const { profile } = this.props;
  }
  componentDidUpdate(prevProps) {
    const { profile } = prevProps;
    this.setState({ profile });
  }
  showSubscriptions = () => {
    const { profile } = this.state;
    let packages = [];
    if (profile) {
      if (profile.packages) {
        packages = profile.packages;
      }
    }
    if (packages.length) {
      return packages.map(item => {
        return (
          <div className="row_item">
            <p>{item.caption}</p>
            <p>{item.price}£</p>
          </div>
        );
      });
    } else {
      return <p>You have no subscriptions yet.</p>;
    }
  };
  render() {
    return (
      <div
        className="modal fade"
        id="subscription_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modal-default-fadein"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">My Subscriptions</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                ref={button => (this.dismissElement = button)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body pb-1 content">
              {this.showSubscriptions()}
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
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
    profile: state.profile,
    brand: state.brand
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionModal);

import React from "react";
import Modal from "react-modal";
import { connect } from "react-redux";
import Firebase from "../../firebasehelper";
import "./index.css";
const pending_img = require("../../assets/media/icons/pending.png");
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};
const getIndex = value => {
  switch (value) {
    case "accountant":
      return 4;
    case "affordability":
      return 5;
    case "credit_rating":
      return 1;
    case "employer":
      return 3;
    case "kyc":
      return 0;
    case "rent_a_serviced_home":
      return 9;
    case "rent_with_pets":
      return 7;
    case "rent_without_a_deposit":
      return 8;
    case "rental_history":
      return 6;
    case "right_to_rent":
      return 2;
    default:
      return 0;
  }
};
class TenantStatus extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tenant: {}
    };
  }
  componentDidUpdate(prevProps) {
    const { tenant } = this.props;
    this.setState({ tenant });
  }
  showStatuses = () => {
    const { tenant } = this.state;
    const { status } = tenant;
    if (status) {
      let new_array = [];
      let array = Object.values(status);
      let key_array = Object.keys(status);
      array.map((item, index) => {
        let key = getIndex(key_array[index]);
        new_array[key] = key_array[index];
      });
      return new_array.map((item, index) => {
        return (
          <div className="row_item">
            <p>
              {item.replaceAll("_", " ").replace(/^\w/, c => c.toUpperCase())}
            </p>
            <p>
              {item === "none" ? (
                <img src={pending_img} width="30" alt="status" />
              ) : (
                <img src={pending_img} width="30" alt="status" />
              )}
            </p>
          </div>
        );
      });
    }
  };
  render() {
    const { showModal, toggleModal, tenant } = this.props;
    return (
      <Modal
        closeTimeoutMS={200}
        isOpen={showModal}
        contentLabel="modal"
        onRequestClose={toggleModal}
      >
        <div className="modal-header">
          <h5 className="modal-title">Tenant Status</h5>
          <button type="button" className="close" onClick={toggleModal}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body pb-1 status_container">
          {showModal && this.showStatuses()}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={toggleModal}
          >
            Close
          </button>
        </div>
      </Modal>
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
    properties: state.properties,
    brand: state.brand,
    users: state.users
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(TenantStatus);

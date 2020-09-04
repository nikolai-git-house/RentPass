import React from "react";
import DropIn from "braintree-web-drop-in-react";
import { braintreeToken } from "../../functions/BraintreeHelper";
import Firebase from "../../firebasehelper";

import "./index.css";

class AddPaymentMethodModal extends React.PureComponent {
  instance;

  state = {
    clientToken: null,
  };

  async componentDidMount() {
    // Get a client token for authorization from your server
    const tokenRes = await braintreeToken();
    if (tokenRes.status === "1") {
      this.setState({ clientToken: tokenRes.data });
    }
  }

  onAdd = async () => {
    const method = await this.instance.requestPaymentMethod();
    this.props.onAdd(method);
  };

  render() {
    const { visible } = this.props;
    const { clientToken } = this.state;
    return visible ? (
      <div
        className="modal"
        style={{ display: "block" }}
        id="payment_method_modal"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Payment Method</h5>
              <button
                type="button"
                className="close"
                onClick={this.props.onClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body pb-1 content">
              <p style={{ marginBottom: 0 }}>
                Add & save a linked card for EcoPay, earning tokens &
                marketplace shopping.
              </p>
              {clientToken && (
                <DropIn
                  options={{ authorization: clientToken }}
                  onInstance={(instance) => (this.instance = instance)}
                />
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-green"
                onClick={this.onAdd}
              >
                Save linked cards
              </button>
              <button
                type="button"
                className="btn btn-sm btn-light"
                onClick={this.props.onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  }
}
export default AddPaymentMethodModal;

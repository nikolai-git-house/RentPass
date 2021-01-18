import React from "react";
import Select from "react-select";
import "./index.css";
import { clearZero } from "../../functions/Auth";

class AddCommunityMemberModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      phonenumber: "",
      phoneAppendix: {
        value: "+44",
        label: "+44",
      },
    };
  }
  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handlePhoneAppendix = (newValue) => {
    this.setState({
      phoneAppendix: newValue,
    });
  };

  addUser = () => {
    const { firstname, phonenumber, phoneAppendix } = this.state;
    const { addUser } = this.props;
    addUser(firstname, `${phoneAppendix.value}${clearZero(phonenumber)}`);
  };

  render() {
    const { firstname, phonenumber, phoneAppendix } = this.state;
    return (
      <div
        className="modal fade"
        id="add_community_member"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modal-default-fadein"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add or invite friend</h5>
              <button
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body pb-1">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-alt"
                  id="signup-username"
                  name="firstname"
                  placeholder="First Name"
                  onChange={this.onChangeHandler}
                  value={firstname}
                />
              </div>
              <div className="invite-user-phone-group">
                <div className="form-group phone-appendix">
                  <Select
                    value={phoneAppendix}
                    onChange={this.handlePhoneAppendix}
                    options={[
                      {
                        value: "+44",
                        label: "+44",
                      },
                      {
                        value: "+1",
                        label: "+1",
                      },
                    ]}
                  />
                </div>
                <div className="form-group phone-number">
                  <input
                    type="number"
                    className="form-control form-control-lg form-control-alt"
                    id="signup-email"
                    name="phonenumber"
                    placeholder="Phone Number"
                    onChange={this.onChangeHandler}
                    value={phonenumber}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-orange"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                className="btn btn-green"
                data-dismiss="modal"
                onClick={this.addUser}
                disabled={!firstname||!phonenumber}
              >
                Add or Invite
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default AddCommunityMemberModal;

import React from "react";
import Select from "react-select";
import Modal from "react-modal";
import { connect } from "react-redux";
import Firebase from "../../firebasehelper";
import { sendInvitation, clearZero } from "../../functions/Auth";
import { sendNotification } from "../../apis/index";
const Styles = {
  control: styles => ({ ...styles, backgroundColor: "white", width: 450 })
};
class AddTenant extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tenants: [],
      selectedTenants: []
    };
  }
  componentDidMount() {
    console.log("users", this.props.users);
    const { users, profile } = this.props;
    let tenants = users.map((item, index) => {
      return { value: item, label: item.firstname };
    });
    let properties = profile.properties
      ? profile.properties.map((item, index) => {
          let { property_address } = item;
          const label = property_address.first_address_line;
          return { value: item.id, label };
        })
      : [];
    this.setState({ tenants, properties });
  }
  handleChange = selectedTenants => {
    this.setState({ selectedTenants });
    console.log(`selectedTenants:`, selectedTenants);
  };
  handleChangeProperty = selectedProperty => {
    this.setState({ selectedProperty });
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  addTenant = () => {
    const { toggleModal } = this.props;
    toggleModal();
    this.Invite();
  };
  Invite = () => {
    const { phonenumber, username, selectedProperty } = this.state;
    console.log("phone", phonenumber);
    console.log("username", username);
    console.log("selectedProperty", selectedProperty);
    let phone = "+44" + clearZero(phonenumber);
    const property_id = selectedProperty.value;
    const property_name = selectedProperty.label;
    console.log("property_id", property_id);
    console.log("property_name", property_name);
    Firebase.sendAddTenantRequest(
      phone,
      username,
      property_id,
      property_name
    ).then(user_profile => {
      console.log("user_profile", user_profile);
      if (user_profile) {
        const { uuid, firstname, app_opened } = user_profile;
        const content =
          "Hello " +
          firstname +
          ", " +
          "You have been invited as a tenant on property " +
          property_name +
          ".";
        sendNotification([uuid], content);
      } else sendInvitation(phone, username, property_name);
    });
    //this.addMember(phone, username, property_id, property_name);
  };

  addMember = (phone, username, property_id, property_name) => {
    Firebase.addTenant(property_id, phone, username)
      .then(result => {
        console.log("result", result);
        if (result) {
          let response = sendInvitation(phone, username, property_name);
          console.log("response", response);
        } else
          alert(
            "The phone number is existing on other property. You can't invite the user to another group."
          );
      })
      .catch(err => {
        console.log("error", err);
      });
  };
  render() {
    const { username, selectedProperty, properties, phonenumber } = this.state;
    const { showModal, toggleModal } = this.props;
    return (
      <Modal
        closeTimeoutMS={200}
        isOpen={showModal}
        contentLabel="modal"
        onRequestClose={toggleModal}
      >
        <div className="modal-header">
          <h5 className="modal-title">Add Tenants</h5>
          <button type="button" className="close" onClick={toggleModal}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body pb-1">
          <div className="form-group">
            <label htmlFor="example-text-input">Name</label>
            <input
              type="text"
              name="username"
              value={username}
              className="form-control"
              placeholder="Name"
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="example-text-input">Property</label>
            <Select
              placeholder="Select property..."
              className="select-custom-class"
              value={selectedProperty}
              onChange={this.handleChangeProperty}
              options={properties}
              styles={Styles}
            />
          </div>
          <div className="form-group">
            <label htmlFor="example-text-input">Mobile</label>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <p
                style={{
                  marginRight: -29,
                  marginTop: 1,
                  color: "#495057",
                  zIndex: 0
                }}
              >
                +44
              </p>
              <input
                type="text"
                name="phonenumber"
                value={phonenumber}
                className="form-control"
                style={{ paddingLeft: 28 }}
                onChange={this.onChange}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={toggleModal}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={this.addTenant}
          >
            Add
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
    profile: state.profile,
    users: state.users
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AddTenant);

import React, { Component } from "react";
import Modal from "react-modal";
import Firebase from "../../../firebasehelper";
import "./index.css";
class AddHousemate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phonenumber: "",
      username: ""
    };
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  addHousemate = () => {
    const { addHousemate } = this.props;
    const { phonenumber, username } = this.state;
    addHousemate(username, phonenumber);
    this.setState({ username: "", phonenumber: "" });
  };
  render() {
    const { username, phonenumber } = this.state;
    const { showModal, toggleModal } = this.props;
    return (
      <Modal
        closeTimeoutMS={200}
        isOpen={showModal}
        contentLabel="modal"
        onRequestClose={toggleModal}
      >
        <div className="modal-header">
          <h5 className="modal-title">Add Housemates</h5>
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
            onClick={this.addHousemate}
          >
            Add
          </button>
        </div>
      </Modal>
    );
  }
}
export default AddHousemate;

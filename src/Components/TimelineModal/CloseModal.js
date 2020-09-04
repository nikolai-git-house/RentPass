import React, { Component } from "react";
import Modal from "react-modal";
const really_happy_img = require("../../images/timeline/really_happy.png");
const happy_img = require("../../images/timeline/happy.png");
const satisfactory_img = require("../../images/timeline/satisfactory.png");
const unhappy_img = require("../../images/timeline/unhappy.png");
const customStyles = {
  content: {
    width: "94%",
    top: "30%",
    left: "3%",
    right: "auto",
    bottom: "auto",
    padding: 0
  },
  overlay: {
    backgroundColor: "rgb(0,0,0,0.4)",
    zIndex: 1000
  }
};

class CloseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: "Really Happy"
    };
  }

  render() {
    const { modalIsOpen, closeModal, terminateTicket } = this.props;
    const { checked } = this.state;
    return (
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 20
          }}
        >
          <p style={{ fontSize: 20, marginBottom: 20 }}>Were you happy?</p>
          <div
            className={`close_option ${
              checked === "Really Happy" ? "clicked" : null
            }`}
            onClick={() => this.setState({ checked: "Really Happy" })}
          >
            <img
              src={really_happy_img}
              style={{ width: 30, height: 30 }}
              alt="emoticon"
            />
            <p>Really Happy</p>
          </div>
          <div
            className={`close_option ${checked === "Happy" ? "clicked" : null}`}
            onClick={() => this.setState({ checked: "Happy" })}
          >
            <img
              src={happy_img}
              style={{ width: 30, height: 30 }}
              alt="emoticon"
            />
            <p>Happy</p>
          </div>
          <div
            className={`close_option ${
              checked === "Satisfactory" ? "clicked" : null
            }`}
            onClick={() => this.setState({ checked: "Satisfactory" })}
          >
            <img
              src={satisfactory_img}
              style={{ width: 30, height: 30 }}
              alt="emoticon"
            />
            <p>Satisfactory</p>
          </div>
          <div
            className={`close_option ${
              checked === "Unhappy" ? "clicked" : null
            }`}
            onClick={() => this.setState({ checked: "Unhappy" })}
          >
            <img
              src={unhappy_img}
              style={{ width: 30, height: 30 }}
              alt="emoticon"
            />
            <p>Unhappy</p>
          </div>
          <div className="row">
            <button
              className="close_button"
              onClick={() => terminateTicket(checked)}
            >
              Close Ticket
            </button>
            <button className="close_button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}
export default CloseModal;

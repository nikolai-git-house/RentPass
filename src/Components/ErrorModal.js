import React, { Component } from "react";
import Modal from "react-modal";

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

class ErrorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { modalIsOpen, closeModal } = this.props;
    const { caption, content } = this.props;
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
          <img
            src={require("../images/error.png")}
            width="82"
            height="82"
            alt="error"
          />
          <p
            style={{
              fontSize: 27,
              padding: 10,
              margin: 0,
              color: "rgb(0,0,0,.65)"
            }}
          >
            {caption}
          </p>
          <p style={{ fontSize: 16, margin: 0, color: "rgb(0,0,0,.65)" }}>
            {content}
          </p>
          <button
            style={{
              width: 100,
              background: "#f9ff66",
              borderRadius: 20,
              border: "none",
              margin: 20
            }}
            onClick={closeModal}
          >
            <p style={{ fontSize: 16, margin: 10, color: "rgb(0,0,0,.65)" }}>
              OK
            </p>
          </button>
        </div>
      </Modal>
    );
  }
}
export default ErrorModal;

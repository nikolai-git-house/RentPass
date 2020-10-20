import React, { Component } from "react";
import Modal from "react-modal";
import ReactHtmlParser from "react-html-parser";
const customStyles = {
  content: {
    width: 350,
    top: "30%",
    left: "auto",
    right: "auto",
    bottom: "auto",
    padding: 0
  },
  overlay: {
    backgroundColor: "rgb(0,0,0,0.4)",
    zIndex: 1000
  }
};

class BugModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { modalIsOpen, closeModal } = this.props;
    const { content } = this.props;
    return (
      <Modal
        className="bugModal"
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
            paddingTop: 20,
            textAlign:"center"
          }}
        >
          <img
            src={require("../assets/media/property_status/home.png")}
            width="82"
            height="82"
            alt="error"
            style={{marginBottom:10}}
          />
          <p style={{ fontSize: 16, margin: 0, color: "rgb(0,0,0,.65)",lineHeight:1.2 }}>
            {ReactHtmlParser(content)}
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
export default BugModal;

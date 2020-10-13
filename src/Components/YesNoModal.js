import React, { Component } from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "90%",
  },
  overlay: {
    backgroundColor: "rgb(0,0,0,0.4)",
    zIndex: 1000,
  },
};

class YesNoModal extends Component {
  render() {
    const {
      icon,
      visible,
      caption,
      content,
      yes,
      no,
      onYes,
      onNo,
    } = this.props;
    return (
      <Modal isOpen={visible} style={customStyles} ariaHideApp={false}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 20,
          }}
        >
          {icon && <img src={icon} width="82" height="82" alt="error" />}
          <p
            style={{
              fontSize: 18,
              padding: 10,
              margin: 0,
            }}
          >
            {caption}
          </p>
          <p
            style={{
              fontSize: 14,
              margin: "0 10px",
              textAlign: "center",
            }}
          >
            {content}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: 40,
              marginTop: 20,
            }}
          >
            {yes && (
              <button className="btn btn-green" onClick={onYes}>
                <p style={{ fontSize: 16 }}>{yes}</p>
              </button>
            )}
            {no && (
              <button
                className="btn btn-green"
                style={{ background: "red" }}
                onClick={onNo}
              >
                <p style={{ fontSize: 16 }}>{no}</p>
              </button>
            )}
          </div>
        </div>
      </Modal>
    );
  }
}
export default YesNoModal;

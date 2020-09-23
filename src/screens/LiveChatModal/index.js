import React, { Component } from "react";
import MessageList from "./MessageList";
import Modal from "react-modal";
import Firebase from "../../firebasehelper";
import "./Styles/index.css";

const customStyles = {
  zIndex: 1000,
  content: {
    width: "100%",
    height: "90%",
  },
};

class LiveChatModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      uid,
      ticket,
      username,
      icon,
      showModal,
      toggleModal,
      brand,
    } = this.props;
    return (
      <Modal
        closeTimeoutMS={200}
        isOpen={showModal}
        style={customStyles}
        contentLabel="modal"
        onRequestClose={toggleModal}
      >
        <div className="modal-header">
          <h5 className="modal-title">Chat</h5>
          <button type="button" className="close" onClick={toggleModal}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body pb-1 status_container app-wrapper">
          <MessageList
            logo="bolt"
            icon="https://firebasestorage.googleapis.com/v0/b/boltconcierge-2f0f9.appspot.com/o/brand_icon%2FRental%20Community?alt=media&token=2e96bade-f7f1-4dbd-afd9-6f7caa9d4dc8"
            room_id={uid}
            ticket={ticket}
            username={username}
            brand={brand}
          />
        </div>
      </Modal>
    );
  }
}
export default LiveChatModal;

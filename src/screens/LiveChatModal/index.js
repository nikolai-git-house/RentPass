import React, { Component } from "react";
import MessageList from "./MessageList";
import Modal from "react-modal";
import Firebase from "../../firebasehelper";
import "./Styles/index.css";

const customStyles = {
  zIndex: 1000,
  content: {
    width: "100%",
    height: "90%"
  }
};

class LiveChatModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { uid, ticket, username, icon, showModal, toggleModal } = this.props;
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
            icon={icon}
            uid={uid}
            ticket={ticket}
            username={username}
          />
        </div>
      </Modal>
    );
  }
}
export default LiveChatModal;

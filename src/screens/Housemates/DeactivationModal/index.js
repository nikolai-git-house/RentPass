import React, { Component } from "react";
import Modal from "react-modal";
import "./index.css";
const active_img = require("../../../assets/media/property_status/active.png");
const pending_img = require("../../../assets/media/property_status/pending.png");
const arrow_img = require("../../../assets/media/arrow.png");

class DeactivationModal extends React.Component {
  constructor(props) {
    super(props);
  }
  onDeactivate = ()=>{
    const { toggleModal,Deactivate } = this.props;  
    Deactivate();
    toggleModal();
  }
  render() {
    const { showModal, toggleModal } = this.props;
    return (
      <Modal
        className="deactivation-modal"
        closeTimeoutMS={200}
        isOpen={showModal}
        contentLabel="modal"
        onRequestClose={toggleModal}
      >
        <div className="modal-body pb-1">
            <div className="images">
                <img
                    src={active_img}
                    width="50"
                    alt="avatar"
                />
                <img
                    src={arrow_img}
                    width="50"
                    alt="avatar"
                />
                <img
                    src={pending_img}
                    width="50"
                    alt="avatar"
                />
            </div>
            <div className="description">
               <p><b>You can only have one active property</b>
                    &nbsp;at any one time. To activate a wishlisted property deactivate your active property.
               </p>
            </div>
            <div className="buttons">
                <button className="btn btn-activated" onClick={this.onDeactivate}>Deactivate</button>
                <button className="btn btn-deactivated" onClick={toggleModal}>Don't change</button>
            </div>
        </div>  
      </Modal>
    );
  }
}

export default DeactivationModal;

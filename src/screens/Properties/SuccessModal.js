import React from "react";
import Modal from "react-modal";
const customStyles = {
  zIndex: 1000,
  content: {
    top: "50%",
    left: "50%",
    width: "50%",
    height: "280px",
    right: "10%",
    bottom: "10%",
    transform: "translate(-50%, -50%)",
    borderRadius: 20,
    textAlign: "center"
  }
};
const success_img = require("../../assets/media/icons/balloons.png");
class SuccessModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { showModal, toggleModal } = this.props;
    return (
      <Modal
        closeTimeoutMS={200}
        isOpen={showModal}
        contentLabel="modal"
        style={customStyles}
        onRequestClose={toggleModal}
      >
        <div className="modal-panel">
          <img src={success_img} width="70px" alt="success" />
          <h3>You've earned 50 tokens.</h3>
          <h5>
            These tokens can be redeemed on your next property management
            subscription.
          </h5>
          <button className="btn btn-success" onClick={toggleModal}>
            Amazing
          </button>
        </div>
      </Modal>
    );
  }
}
export default SuccessModal;

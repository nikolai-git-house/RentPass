import React from "react";
import loadImage from "blueimp-load-image";
import Ticket from "../Ticket";
import Modal from "react-modal";

const Styles = {
  control: styles => ({ ...styles, backgroundColor: "white", width: 300 })
};
const customStyles = {
  zIndex: 1000,
  content: {
    top: "50%",
    left: "50%",
    width: "40%",
    height: "70%",
    right: "10%",
    bottom: "10%",
    borderRadius: 20,
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column"
  }
};
class TicketDetailModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      ticket: props.ticket,
      room_id: props.room_id,
      membername: props.membername,
      showModal: props.showModal,
      toggleModal: props.toggleModal
    };
  }
  componentDidMount() {
    const { username, ticket, uid } = this.props;
    console.log("uid in TicketDetail", uid);
  }
  componentWillReceiveProps(nextProps) {
    console.log("nextProps", nextProps);
    const { ticket, uid, username, showModal, toggleModal } = nextProps;
    this.setState({ ticket, uid, username, showModal, toggleModal });
  }
  render() {
    const { ticket, uid, username, showModal, toggleModal } = this.state;
    return (
      <Modal
        closeTimeoutMS={200}
        isOpen={showModal}
        contentLabel="modal"
        style={customStyles}
        onRequestClose={toggleModal}
      >
        <div className="modal-header">
          <h5 className="modal-title">Ticket Detail</h5>
          <button type="button" className="close" onClick={toggleModal}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div
          className="modal-body pb-1"
          style={{ height: 500, overflow: "scroll" }}
        >
          {ticket && (
            <Ticket
              ticket={ticket}
              uid={uid}
              username={username}
              agency_name="landlord"
            />
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={toggleModal}
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }
}
export default TicketDetailModal;

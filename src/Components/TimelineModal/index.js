import React from "react";
import { connect } from "react-redux";
import Firebase from "../../firebasehelper";
import TicketItem from "./TicketItem";
import "./index.css";
function compare(a, b) {
  if (parseInt(a.time, 10) < parseInt(b.time, 10)) {
    return 1;
  }
  if (parseInt(a.time, 10) > parseInt(b.time, 10)) {
    return -1;
  }
  return 0;
}
class TimelineModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tickets: [],
      ticket_id: "",
      visible_arr: [],
      close_visible: false
    };
  }
  componentDidMount() {
    const { profile, uid } = this.props;
    Firebase.getAllTicketsById(uid, res => {
      let tickets = Object.values(res);
      tickets.sort(compare);
      let visible_arr = tickets.map(item => {
        return false;
      });
      tickets.splice(5);
      this.setState({ tickets, visible_arr });
    });
  }
  toggleModal = (type, value) => {
    if (type === "close") this.setState({ close_visible: value });
  };
  onTerminateTicket = (ticket_id, status) => {
    this.setState({ ticket_id });
    if (status !== "Closed") this.toggleModal("close", true);
  };
  terminateTicket = checked => {
    this.toggleModal("close", false);
    const { uid } = this.props;
    const { ticket_id } = this.state;
    let ticket_Str = ticket_id.toString();
    let ticketID = ticket_Str.split(".").join("");
    let feeling = checked;
    Firebase.terminateChat(uid, ticketID, feeling, res => {
      if (res === "success") {
        console.log("terminated!");
      }
    });
  };
  toggleTicket = index => {
    let { visible_arr } = this.state;
    visible_arr[index] = !visible_arr[index];
    this.setState({ visible_arr });
  };
  showTickets = () => {
    const { tickets, visible_arr } = this.state;
    const { profile } = this.props;
    return tickets.map((item, index) => {
      const ticket_id = item.ticket_id;
      const { firstname } = profile;
      return (
        <TicketItem
          ticket={item}
          firstname={firstname}
          //   toggleTicket={() => this.toggleTicket(index)}
          terminateTicket={() => this.onTerminateTicket(ticket_id, item.status)}
          onPressChat={() => this.onPressChat(ticket_id, item.status)}
          visible={visible_arr[index]}
        />
      );
    });
  };
  render() {
    return (
      <div
        className="modal fade"
        id="timeline_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modal-default-fadein"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">My Timeline</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                ref={button => (this.dismissElement = button)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body pb-1 content">{this.showTickets()}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-light"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
    profile: state.profile,
    brand: state.brand
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(TimelineModal);

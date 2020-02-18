import React from "react";
import "./index.css";
import {
  isTicketforLandlord,
  getStringfromSeconds
} from "../../functions/index";
class RequestItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false
    };
  }
  click = () => {
    const { clickRequest } = this.props;
    const { flag } = this.state;
    clickRequest();
    this.setState({ flag: !flag });
  };
  getColorByStatus(status) {
    switch (status) {
      case "Open":
        return "#7Ef0a7";
        break;
      case "Waiting":
        return "#FFD366";
        break;
      case "Closed":
        return "red";
        break;
      default:
        return "green";
    }
  }
  clickTicketDetail = (item, index) => {
    const { clickTicketDeail } = this.props;
    this.setState({ focused: index });
    clickTicketDeail(item);
  };
  clickTicket = (item, index) => {
    const { clickTicket } = this.props;
    this.setState({ focused: index });
    clickTicket(item);
  };
  showTickets = tickets => {
    const { focused } = this.state;
    const { ticket_opened } = this.props;
    return tickets.map((item, index) => {
      const ticket_id = item.ticket_id;
      if (isTicketforLandlord(ticket_id))
        return (
          <div
            key={index}
            style={{
              background: ticket_opened
                ? focused === index
                  ? "#9F9E9E"
                  : "#152439"
                : "#152439",
              color: "white",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: 10,
              paddingRight: 10
            }}
            className="ticket"
            onClick={() => this.clickTicket(item, index)}
          >
            <div
              style={{ maxWidth: 500, display: "flex", flexDirection: "row" }}
            >
              <p>{getStringfromSeconds(item.time)}</p>
              <p>
                &nbsp;&nbsp;&nbsp;<b>Ticket</b>&nbsp;:&nbsp;
                {item.issue}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: 200,
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <p
                style={{
                  color: this.getColorByStatus(item.status),
                  fontWeight: "bold"
                }}
              >
                {item.status}
              </p>
              <button
                type="button"
                data-toggle="modal"
                data-target="#ticket_detail"
                onClick={() => this.clickTicketDetail(item, index)}
                style={{
                  cursor: "pointer",
                  background: "lightgrey",
                  height: 30,
                  borderRadius: 6,
                  color: "#152439"
                }}
              >
                Ticket Details
              </button>
            </div>
          </div>
        );
    });
  };
  render() {
    const { data, clicked } = this.props;
    const { username, tickets } = data;
    let tickets_arr = Object.values(tickets);
    return (
      <div>
        <div
          className="block-content"
          onClick={this.click}
          style={{ background: clicked ? "#f4f6fa" : "white" }}
        >
          <p>
            <i className="fas fa-user" />
            &nbsp;&nbsp;&nbsp;{username}
          </p>
        </div>
        {clicked && this.showTickets(tickets_arr)}
      </div>
    );
  }
}
export default RequestItem;

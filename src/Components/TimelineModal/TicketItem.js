import React, { Component, StyleSheet } from "react";
import { getStringfromSeconds } from "../../functions/Auth";
class TicketItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible
    };
  }
  componentDidUpdate(nextProps) {
    this.setState({ visible: nextProps.visible });
  }
  onPressChat = () => {
    const { onPressChat } = this.props;
    onPressChat();
  };
  terminateChat = () => {
    const { terminateTicket } = this.props;
    terminateTicket();
  };
  getIssueText = () => {
    const { ticket } = this.props;
    const { item, room, adjective } = ticket;
    if (item) {
      return (
        "The " +
        item.toLowerCase() +
        " in the " +
        room.toLowerCase() +
        " is " +
        adjective.toLowerCase() +
        "."
      );
    } else return null;
  };
  render() {
    const { img, ticket, toggleTicket, firstname } = this.props;
    const { issue, status, title, time, feeling, note } = ticket;
    const { visible } = this.state;
    return (
      <div className="ticket_item">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            height: 60,
            backgroundColor: "#fff",
            borderRadius: 5,
            shadowColor: "black",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.2,
            elevation: 3
          }}
          onClick={toggleTicket}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start"
            }}
          >
            <p style={{ fontSize: 16, margin: 0 }}>{title}</p>
          </div>
          <p style={{ fontSize: 14, margin: 0 }}>
            {getStringfromSeconds(time)}
          </p>
        </div>
        {visible && (
          <div
            style={{
              padding: 10,
              backgroundColor: "#f6f6f6",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", width: "50%" }}
            >
              <p style={{ fontWeight: "500", marginBottom: 20 }}>
                {status} Ticket
              </p>
              <p>{this.getIssueText()}</p>
              <p style={{ fontWeight: "600" }}>
                {feeling
                  ? `${firstname} is ${feeling.toLowerCase()} with this ticket.`
                  : null}
              </p>
            </div>
            <div
              className="button_group"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <button
                className="option_button"
                style={{
                  backgroundColor: "#7ef0a7"
                }}
                onClick={this.onPressChat}
              >
                <p>Chat</p>
              </button>
              <button
                className="option_button"
                style={{
                  backgroundColor: "#ffd366"
                }}
              >
                <p>Add note</p>
              </button>
              {status !== "Closed" && (
                <button
                  className="option_button"
                  style={{
                    backgroundColor: "#faff87"
                  }}
                  onClick={this.terminateChat}
                >
                  <p>Close ticket</p>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TicketItem;

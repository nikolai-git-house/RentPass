import React, { Component } from "react";
import MessageList from "./MessageList";
import "./Styles/index.css";
class LiveChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { room_id, ticket, username, icon, brand } = this.props;
    return (
      <div className="app-wrapper">
        <MessageList
          logo="bolt"
          icon={icon}
          room_id={room_id}
          ticket={ticket}
          username={username}
          brand={brand}
        />
      </div>
    );
  }
}
export default LiveChat;

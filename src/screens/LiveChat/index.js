import React, { Component } from "react";
import MessageList from "./MessageList";
import "./Styles/index.css";
class LiveChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { room_id, ticket, username, icon, brand, onBack } = this.props;
    return (
      <div className="live-chat-container">
        <div className="mobile-back" onClick={onBack}>
          <i class="fa fa-angle-left"></i>
        </div>
        <MessageList
          logo="bolt"
          icon="https://firebasestorage.googleapis.com/v0/b/boltconcierge-2f0f9.appspot.com/o/brand_icon%2FRental%20Community?alt=media&token=2e96bade-f7f1-4dbd-afd9-6f7caa9d4dc8"
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

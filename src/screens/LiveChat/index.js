import React, { Component } from "react";
import MessageList from "./MessageList";
import Firebase from "../../firebasehelper";
import "./Styles/index.css";
class LiveChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { uid, ticket, username, icon } = this.props;
    return (
      <div className="app-wrapper">
        <MessageList
          icon={icon}
          uid={uid}
          ticket={ticket}
          username={username}
        />
      </div>
    );
  }
}
export default LiveChat;

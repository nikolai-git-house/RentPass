import React, { Component } from "react";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import Firebase from "../../firebasehelper";
import { getStringfromSeconds, sendNotification } from "../../functions";
var a = require("indefinite");
var timer;

class MessageList extends Component {
  state = {
    showInput: false,
    messages: [],
    name: "",
    isIphoneX: true,
    user_typing: false,
    landlord_typing: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    let { room_id, ticket, username, brand } = this.props;
    const {
      time,
      ticket_id,
      title,
      adjective,
      item,
      room,
      band,
      repair_sla,
      response_sla,
    } = ticket;
    let time_str = getStringfromSeconds(time);
    Firebase.getChats(room_id, ticket_id, (res) => {
      let chats = Object.values(res);
      if (title === "Home Repairs") {
        chats.unshift(
          {
            message: `The <b>${item}</b> in the <b>${room}</b> is <b>${adjective}</b>.`,
            type: "agency",
          },
          {
            message: `This is ${a(band)}.`,
            type: "bot",
          },
          {
            message: `This is covered by Ecosystem.`,
            type: "bot",
          },
          {
            message: `${
              brand && a(brand, { capitalize: true })
            } worker will be in touch ${response_sla}.`,
            type: "bot",
          },
          {
            message: `${brand} aim to have this repair made ${repair_sla}.`,
            type: "bot",
          }
        );
      }
      chats.unshift({
        message: `${username} has requested help with <b>${title}</b> on the ${time_str}.`,
        type: "agency",
      });

      this.setState({ messages: chats });
    });
    Firebase.getAgencyTyping(room_id, ticket_id, (typing) => {
      this.setState({ agency_typing: typing });
    });
    Firebase.getLandlordTyping(room_id, ticket_id, (typing) => {
      this.setState({ landlord_typing: typing });
    });

    Firebase.getAllUsersInBrand(brand).then((users) => {
      this.setState({ user: users.find((obj) => obj.id === ticket.uid) });
    });
    this.scrollToBottom();
  }
  componentWillReceiveProps(nextProps) {
    let { room_id, ticket, username, brand } = nextProps;
    const {
      time,
      ticket_id,
      title,
      adjective,
      item,
      room,
      band,
      repair_sla,
      response_sla,
    } = ticket;
    let time_str = getStringfromSeconds(time);
    Firebase.getChats(room_id, ticket_id, (res) => {
      let chats = Object.values(res);
      if (title === "Home Repairs") {
        chats.unshift(
          {
            message: `The <b>${item}</b> in the <b>${room}</b> is <b>${adjective}</b>.`,
            type: "agency",
          },
          {
            message: `This is ${a(band)}.`,
            type: "bot",
          },
          {
            message: `This is covered by Ecosystem.`,
            type: "bot",
          },
          {
            message: `${a(brand, {
              capitalize: true,
            })} worker will be in touch ${response_sla}.`,
            type: "bot",
          },
          {
            message: `${brand}  aim to have this repair made ${repair_sla}.`,
            type: "bot",
          }
        );
      }
      chats.unshift({
        message: `${username} has requested a <b>${title}</b> on ${time_str}.`,
        type: "agency",
      });

      this.setState({ messages: chats });
    });
    Firebase.getAgencyTyping(room_id, ticket_id, (typing) => {
      this.setState({ user_typing: typing });
    });
    Firebase.getLandlordTyping(room_id, ticket_id, (typing) => {
      this.setState({ landlord_typing: typing });
    });

    Firebase.getAllUsersInBrand(brand).then((users) => {
      this.setState({ user: users.find((obj) => obj.id === ticket.uid) });
    });
  }
  scrollToBottom(delay = 0) {
    console.log("scrolled to Bottom");
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  setMessages() {
    const { logo, icon } = this.props;
    const { messages, user } = this.state;
    setTimeout(() => this.scrollToBottom(), 100);
    return messages.map((message, i) => {
      return (
        <MessageItem
          message={message}
          key={i}
          logo={logo}
          icon={icon}
          userIcon={user && user.avatar_url}
          loaded={true}
        />
      );
    });
  }

  setMessageInState(message) {
    const messages = this.state.messages.slice();
    messages.push(message);
    this.setState({ messages });
  }

  addMessage = (message) => {
    const { room_id, ticket } = this.props;
    const { ticket_id } = ticket;

    this.setMessageInState(message);
    Firebase.addMessage(room_id, ticket_id, message, (res) => {
      // Firebase.getUserProfileById(room_id).then(res => {
      //   console.log("user profile", res);
      //   let content = "An agency sent you a message.";
      //   const { uuid } = res;
      //   if (!res.app_opened) sendNotification([uuid], content);
      // });
    });
    Firebase.setTypeValue(room_id, ticket_id, false);
    setTimeout(() => this.scrollToBottom(), 100);
  };
  onType = () => {
    const { room_id, ticket } = this.props;
    const { ticket_id } = ticket;
    Firebase.setTypeValue(room_id, ticket_id, true);
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      Firebase.setTypeValue(room_id, ticket_id, false);
    }, 1000);
  };
  render() {
    const { logo } = this.props;
    const { user_typing, landlord_typing, contractor_typing } = this.state;
    return (
      <div>
        <div className="message-list-wrapper">
          {this.setMessages()}
          {user_typing && (
            <MessageItem message={{ type: "user" }} loaded={false} />
          )}
          {landlord_typing && (
            <MessageItem message={{ type: "landlord" }} loaded={false} />
          )}
          {contractor_typing && (
            <MessageItem message={{ type: "contractor" }} loaded={false} />
          )}
          <div
            component="div"
            className="message-input-container"
            ref={(el) => {
              this.messagesEnd = el;
            }}
          >
            <MessageInput
              addMessage={this.addMessage}
              logo={logo}
              onType={this.onType}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MessageList;

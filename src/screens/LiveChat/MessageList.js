import React, { Component } from "react";
import { TransitionGroup } from "react-transition-group";
import { animateScroll } from "react-scroll";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import Firebase from "../../firebasehelper";
import { getStringfromSeconds, sendNotification } from "../../functions";
var timer;

class MessageList extends Component {
  state = {
    showInput: false,
    messages: [],
    name: "",
    isIphoneX: true,
    user_typing: false,
    landlord_typing: false
  };

  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    let { uid, ticket, username } = this.props;
    const {
      time,
      ticket_id,
      title,
      adjective,
      item,
      room,
      band,
      repair_sla,
      response_sla
    } = ticket;
    let time_str = getStringfromSeconds(time);
    Firebase.getChats(uid, ticket_id, res => {
      let chats = Object.values(res);
      if (title === "Home Repairs") {
        chats.unshift(
          {
            message: `The <b>${item}</b> in the <b>${room}</b> is <b>${adjective}</b>.`,
            type: "agency"
          },
          {
            message: `This is a ${band}.`,
            type: "agency"
          },
          {
            message: `This is covered by Bolt.`,
            type: "agency"
          },
          {
            message: `Bolt worker will be in touch ${response_sla}.`,
            type: "agency"
          },
          {
            message: `Bolt aim to have this repair made ${repair_sla}.`,
            type: "agency"
          }
        );
      }
      chats.unshift({
        message: `${username} has requested help with <b>${title}</b> on the ${time_str}.`,
        type: "agency"
      });

      this.setState({ messages: chats });
    });
    Firebase.getAgencyTyping(uid, ticket_id, typing => {
      this.setState({ agency_typing: typing });
    });
    Firebase.getLandlordTyping(uid, ticket_id, typing => {
      this.setState({ landlord_typing: typing });
    });
    this.scrollToBottom();
  }
  componentWillReceiveProps(nextProps) {
    let { uid, ticket, username } = nextProps;
    const {
      time,
      ticket_id,
      title,
      adjective,
      item,
      room,
      band,
      repair_sla,
      response_sla
    } = ticket;
    let time_str = getStringfromSeconds(time);
    Firebase.getChats(uid, ticket_id, res => {
      let chats = Object.values(res);
      if (title === "Home Repairs") {
        chats.unshift(
          {
            message: `The <b>${item}</b> in the <b>${room}</b> is <b>${adjective}</b>.`,
            type: "agency"
          },
          {
            message: `This is a ${band}.`,
            type: "agency"
          },
          {
            message: `This is covered by Bolt.`,
            type: "agency"
          },
          {
            message: `Bolt worker will be in touch ${response_sla}.`,
            type: "agency"
          },
          {
            message: `Bolt aim to have this repair made ${repair_sla}.`,
            type: "agency"
          }
        );
      }
      chats.unshift({
        message: `${username} has requested a <b>${title}</b> on ${time_str}.`,
        type: "agency"
      });
      this.setState({ messages: chats });
      this.scrollToBottom();
    });
    Firebase.getAgencyTyping(uid, ticket_id, typing => {
      this.setState({ agency_typing: typing });
    });
    Firebase.getLandlordTyping(uid, ticket_id, typing => {
      this.setState({ landlord_typing: typing });
    });
  }
  scrollToBottom() {
    console.log("scrolled to Bottom");
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  setMessages() {
    const { icon } = this.props;
    const { messages } = this.state;
    setTimeout(() => this.scrollToBottom(), 100);
    return messages.map((message, i) => {
      return (
        <MessageItem message={message} key={i} icon={icon} loaded={true} />
      );
    });
  }

  setMessageInState(message) {
    const messages = this.state.messages.slice();
    messages.push(message);
    this.setState({ messages });
  }

  addMessage = message => {
    const { uid, ticket } = this.props;
    const { ticket_id } = ticket;
    this.setMessageInState(message);
    Firebase.addMessage(uid, ticket_id, message, res => {
      console.log("added message", message);
    });
    Firebase.setTypeValue(uid, ticket_id, false);
    setTimeout(() => this.scrollToBottom(), 100);
  };
  onType = () => {
    const { uid, ticket } = this.props;
    const { ticket_id } = ticket;
    Firebase.setTypeValue(uid, ticket_id, true);
    if (timer) clearTimeout(timer);
    timer = setTimeout(function() {
      Firebase.setTypeValue(uid, ticket_id, false);
    }, 1000);
  };
  render() {
    const { icon } = this.props;
    const { agency_typing, landlord_typing } = this.state;
    return (
      <div className="message-list-wrapper" style={{ height: 600 }}>
        {this.setMessages()}
        {agency_typing && (
          <MessageItem
            message={{ type: "agency" }}
            icon={icon}
            loaded={false}
          />
        )}
        {landlord_typing && (
          <MessageItem message={{ type: "landlord" }} loaded={false} />
        )}
        <div
          component="div"
          className="message-input-container"
          ref={el => {
            this.messagesEnd = el;
          }}
        >
          <MessageInput
            addMessage={this.addMessage}
            icon={icon}
            onType={this.onType}
          />
        </div>
      </div>
    );
  }
}

export default MessageList;

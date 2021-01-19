import React, { Component } from "react";
import { Element, scroller } from "react-scroll";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import Firebase from "../../../firebasehelper";
import { getStringfromSeconds } from "../../../functions";
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
      show_input:true
    };
  }

  componentDidMount() {
    let { room_id, ticket, username } = this.props;
    const {
      time,
      title,
      issue,
      adjective,
      item,
      room,
      band,
      repair_sla,
      response_sla,
      id,
      feeling,
      status
    } = ticket;
    this.setState({show_input:status!=="Closed"});
    let ticket_id = ""+id;
    ticket_id = ticket_id.split(".").join("");
    let time_str = getStringfromSeconds(time);
    Firebase.getChats(room_id, ticket_id, (res) => {
      let chats = Object.values(res);
      if (title === "Support") {
        chats.unshift(
          {
            message: `Hi <b>${username}</b>, How can I help you today?`,
            type: "bot",
          },
          {
            message: issue,
            type: "user",
          },
          {
            message: "Thanks for letting us know, a specialist will be with you in the next few minutes...",
            type: "bot",
          },
        );
      }else{
        if (title === "Home Repairs") {
          chats.unshift(
            {
              message: `The <b>${item}</b> in the <b>${room}</b> is <b>${adjective}</b>.`,
              type: "bot",
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
              message: `Rental Community worker will be in touch ${response_sla}.`,
              type: "bot",
            },
            {
              message: `Rental Community aim to have this repair made ${repair_sla}.`,
              type: "bot",
            }
          );
        }
        chats.unshift({
          message: `${username} has requested help with <b>${title}</b> on the ${time_str}.`,
          type: "bot",
        });
      }
      if(status==="Closed"){
        chats.push({
          message: `I am ${feeling} to close this ticket.`,
          background:"#FFA8A7",
          type: "user",
        },);
      }
      this.setState({ messages: chats });

    });
    Firebase.getAgencyTyping(room_id, ticket_id, (typing) => {
      this.setState({ agency_typing: typing });
    });
    Firebase.getLandlordTyping(room_id, ticket_id, (typing) => {
      this.setState({ landlord_typing: typing });
    });
    this.scrollToBottom();
  }
  componentWillReceiveProps(nextProps) {
    let { room_id, ticket, username } = nextProps;
    const {
      time,
      id,
      title,
      issue,
      adjective,
      item,
      room,
      band,
      repair_sla,
      response_sla,
      feeling,
      status,
    } = ticket;
    this.setState({show_input:status!=="Closed"});
    let ticket_id = ""+id;
    ticket_id = ticket_id.split(".").join("");
    let time_str = getStringfromSeconds(time);
    Firebase.getChats(room_id, ticket_id, (res) => {
      let chats = Object.values(res);
      if (title === "Support") {
        chats.unshift(
          {
            message: `Hi <b>${username}</b>, How can I help you today?`,
            type: "bot",
          },
          {
            message: issue,
            type: "user",
          },
          {
            message: "Thanks for letting us know, a specialist will be with you in the next few minutes...",
            type: "bot",
          },
        );
      }else{
        if (title === "Home Repairs") {
          chats.unshift(
            {
              message: `The <b>${item}</b> in the <b>${room}</b> is <b>${adjective}</b>.`,
              type: "bot",
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
              message: `Rental Community worker will be in touch ${response_sla}.`,
              type: "bot",
            },
            {
              message: `Rental Community aim to have this repair made ${repair_sla}.`,
              type: "bot",
            }
          );
        }
        chats.unshift({
          message: `${username} has requested help with <b>${title}</b> on the ${time_str}.`,
          type: "bot",
        });
      }
      if(status==="Closed"){
        chats.push({
          message: `I am ${feeling} to close this ticket.`,
          background:"#FFA8A7",
          type: "user",
        },);
      }
      this.setState({ messages: chats });
    });
    Firebase.getAgencyTyping(room_id, ticket_id, (typing) => {
      this.setState({ user_typing: typing });
    });
    Firebase.getLandlordTyping(room_id, ticket_id, (typing) => {
      this.setState({ landlord_typing: typing });
    });
  }
  scrollToBottom(delay = 0) {
    scroller.scrollTo("bottom",{
      duration: 200,
      delay: 0,
      smooth: "easeInOutQuart",
      containerId: "containerElement",
    });
  }

  setMessages() {
    const { logo, avatar } = this.props;
    const { messages } = this.state;
    setTimeout(() => this.scrollToBottom(), 100);
    return messages.map((message, i) => {
      return (
        <MessageItem
          message={message}
          key={i}
          userIcon={avatar}
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
    const { id } = ticket;
    let ticket_id = ""+id;
    ticket_id = ticket_id.split(".").join("");
    console.log("add Message to ticket_id",ticket_id);
    this.setMessageInState(message);
    message.time = Date.now();
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
    const { id } = ticket;
    let ticket_id = id;
    Firebase.setTypeValue(room_id, ticket_id, true);
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      Firebase.setTypeValue(room_id, ticket_id, false);
    }, 1000);
  };
  render() {
    const { logo } = this.props;
    const { user_typing, landlord_typing, contractor_typing,show_input } = this.state;
    return (
      <div className="message-list-wrapper-container">
        <div className="message-list-wrapper">
          <Element className="message-items-container" id="containerElement">
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
            <Element name="bottom" style={{minHeight:30}}></Element>
          </Element>
          {show_input&&<div
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
          </div>}
        </div>
      </div>
    );
  }
}

export default MessageList;
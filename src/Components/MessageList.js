import React, { Component } from "react";
import { TransitionGroup } from "react-transition-group";
import { animateScroll } from "react-scroll";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";

import {
  getBotMessageGroup,
  getBetweenTimeoutValue,
  getTimeoutValue,
  getInputTimeoutValue,
  addBotMessageGroup,
  addBotMessages
} from "../Utils/botMessages";
import {
  getUserMessage,
  addUserMessage,
  addUserMessages
} from "../Utils/userMessages";
import { postMessage } from "../Utils/middleware";
class MessageList extends Component {
  state = {
    showInput: false,
    messages: [],
    name: "",
    isIphoneX: true
  };
  constructor(props) {
    super(props);
    this.messages = [
      {
        type: "user",
        message: "Hello"
      }
    ];
  }

  componentDidMount() {
    const { type } = this.props;
    this.getBotMessageGroup(type);
  }

  getBotMessageGroup = type => {
    this.setState({
      showInput: false
    });
    const messageGroup = getBotMessageGroup(type);
    console.log("messageGroup", messageGroup);
    if (messageGroup) {
      messageGroup.forEach((message, index) => {
        const timeoutValue =
          getTimeoutValue() + (index ? index * getBetweenTimeoutValue() : 0);
        setTimeout(() => {
          this.setMessageInState(message);
          this.scrollToBottom();
          if (index === messageGroup.length - 1) this.toggleUserInput(true);
        }, timeoutValue);
      });
    }
  };

  scrollToBottom(delay = 0) {
    if (delay) {
      setTimeout(() => {
        animateScroll.scrollToBottom({
          duration: 500,
          smooth: "easeInOutQuad"
        });
      }, delay);
    } else {
      animateScroll.scrollToBottom({
        duration: 500,
        smooth: "easeInOutQuad"
      });
    }
  }

  setMessages() {
    const { logo } = this.props;
    const { messages } = this.state;
    return messages.map((message, i) => {
      const firstChild = i !== 0 && messages[i - 1].type !== message.type;
      if (message.type === "card-static") {
        return (
          <div className="card-static-wrapper" key={i}>
            {this.image}
          </div>
        );
      }
      if (message.type === "form") {
        return (
          <div className="form" key={i}>
            {this.image}
          </div>
        );
      }
      return (
        <MessageItem
          message={message}
          firstChild={firstChild}
          key={i}
          timeoutValue={getTimeoutValue(message.message)}
          logo={logo}
        />
      );
    });
  }

  toggleUserInput(timeout) {
    const { type } = this.props;
    if (!this.state.showInput) this.scrollToBottom(500);
    const { userMessage } = this.state;
    const showInput = !this.state.showInput;
    if (timeout) {
      setTimeout(() => {
        if (!this.state.showInput) this.scrollToBottom(500);
        this.setState({
          showInput,
          userMessage: showInput ? getUserMessage(type) : userMessage
        });
      }, getInputTimeoutValue());
    } else {
      this.setState({
        showInput,
        userMessage: showInput ? getUserMessage(type) : userMessage
      });
    }
  }

  setMessageInState(message) {
    const messages = this.state.messages.slice();
    messages.push(message);
    this.setState({ messages });
  }

  addMessage = message => {
    const { type } = this.props;
    if (message.finish) postMessage("profileTestfinished", true);
    if (message.isPhoneNumberExist) {
      addBotMessageGroup(type, [
        {
          type: "bot",
          message:
            "There is already an account with that number. Please try with another number."
        }
      ]);
      addUserMessage(type, {
        type: "user",
        inputType: "input",
        placeholder: "",
        key: "phone"
      });
    }

    if (message.inputType === "input" && message.key === "forename") {
      setTimeout(() => {
        this.scrollToBottom();
        //break into firstname and lastname;
        let name = message.message;
        this.setMessageInState({
          type: "bot",
          message: `Thanks ${name}.`
        });
        this.getBotMessageGroup(type);
      }, getBetweenTimeoutValue());
    } else if (message.key === "wrong_sms") {
      addUserMessage(type, {
        type: "user",
        inputType: "input",
        placeholder: "6-digits",
        key: "sms"
      });
      addUserMessage(type, {
        type: "user",
        inputType: "input",
        placeholder: "",
        key: "phone"
      });
      addBotMessageGroup(type, [
        {
          type: "bot",
          message: "Please confirm the sms code received."
        }
      ]);
      addBotMessageGroup(type, [
        {
          type: "bot",
          message: `SMS Code is not matching. Try again.`
        }
      ]);
      this.getBotMessageGroup(type);
    } else if (message.key === "no_received") {
      addUserMessage(type, {
        type: "user",
        inputType: "input",
        placeholder: "6-digits",
        key: "sms"
      });
      addUserMessage(type, {
        type: "user",
        inputType: "input",
        placeholder: "",
        key: "phone"
      });
      addBotMessageGroup(type, [
        {
          type: "bot",
          message: "Please confirm the sms code received."
        }
      ]);
      addBotMessageGroup(type, [
        {
          type: "bot",
          message: `Try again.`
        }
      ]);
      this.getBotMessageGroup(type);
    } else if (message.key === "property_address") {
      console.log("postcod");
      if (message.message === "PostCode") {
        addUserMessage(type, {
          type: "user",
          inputType: "input",
          placeholder: "Number of bedrooms",
          key: "bedrooms"
        });
        addUserMessage(type, {
          type: "user",
          inputType: "address",
          key: "address"
        });
        addUserMessage(type, {
          type: "user",
          inputType: "input",
          placeholder: "Postcode",
          key: "postcode"
        });
        addBotMessageGroup(type, [
          {
            type: "bot",
            message: "How many bedrooms does the property have?"
          }
        ]);
        addBotMessageGroup(type, [
          {
            type: "bot",
            message: "Please select your address from the dropdown."
          }
        ]);
        addBotMessageGroup(type, [
          {
            type: "bot",
            message: "What is the postcode of your property?"
          }
        ]);
      } else {
        addUserMessage(type, {
          type: "user",
          inputType: "input",
          placeholder: "Number of bedrooms",
          key: "bedrooms"
        });
        addUserMessage(type, {
          type: "user",
          inputType: "input",
          placeholder: "http://xxx",
          key: "rightmove"
        });
        addBotMessageGroup(type, [
          {
            type: "bot",
            message: "How many bedrooms does the property have?"
          }
        ]);
        addBotMessageGroup(type, [
          {
            type: "bot",
            message: "What is the rightmove link of your property?"
          }
        ]);
      }
      this.getBotMessageGroup(type);
    } else if (message.key === "HMO") {
      addUserMessage(type, {
        type: "user",
        inputType: "input",
        placeholder: "Rental price per room",
        key: "hmo"
      });
      addBotMessageGroup(type, [
        {
          type: "bot",
          message:
            "What is the weekly rental price per room? (Include data entry for number of rooms)"
        }
      ]);
      this.getBotMessageGroup(type);
    } else if (message.key === "AST") {
      addUserMessage(type, {
        type: "user",
        inputType: "input",
        placeholder: "Weekly rental price",
        key: "ast"
      });
      addBotMessageGroup(type, [
        {
          type: "bot",
          message: "What is the weekly rental price for the property?"
        }
      ]);
      this.getBotMessageGroup(type);
    } else {
      if (typeof message.allowNotification !== "undefined") {
        if (this.stoppedMessage) {
          postMessage("allowNotificationsTwice", message.allowNotification);
        } else {
          postMessage("allowNotifications", message.allowNotification);
        }
      }
      if (typeof message.moveBot !== "undefined" && message.moveBot) {
        if (message.allowNotification === true) {
          if (message.twiceAsked) {
            for (let i = 0; i < message.moveBot; i++) {
              getBotMessageGroup(type);
            }
          } else {
            this.stoppedMessage = message;
            return;
          }
        } else {
          for (let i = 0; i < message.moveBot; i++) {
            getBotMessageGroup(type);
          }
        }
      }
      if (
        typeof message.moveUser !== "undefined" &&
        message.moveUser &&
        message.allowNotification !== true
      ) {
        for (let i = 0; i < message.moveUser; i++) {
          getUserMessage(type);
        }
      }
      if (!message.finish) {
        setTimeout(() => {
          this.getBotMessageGroup(type);
        }, 1000);
      }
    }

    this.setMessageInState(message);
    this.toggleUserInput();
  };

  render() {
    const { logo } = this.props;
    const { showInput, userMessage, isIphoneX } = this.state;
    return (
      <div className="message-list-wrapper">
        {this.setMessages()}
        <TransitionGroup component="div" className="message-input-container">
          {showInput ? (
            <MessageInput
              message={userMessage}
              addMessage={this.addMessage}
              isIphoneX={isIphoneX}
              logo={logo}
            />
          ) : null}
        </TransitionGroup>
      </div>
    );
  }
}

export default MessageList;

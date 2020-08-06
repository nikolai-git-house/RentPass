import React, { Component } from "react";
import { TransitionGroup } from "react-transition-group";
import { animateScroll } from "react-scroll";
import { connect } from "react-redux";
import { saveUID, saveProfile, saveUsers } from "../../redux/actions";
import MessageItem from "../../Components/MessageItem";
import MessageInput from "../../Components/MessageInput";
import Firebase from "../../firebasehelper";
import {
  getBotMessageGroup,
  getBetweenTimeoutValue,
  getTimeoutValue,
  getInputTimeoutValue,
  addBotMessageGroup,
  addBotMessages
} from "../../Utils/botMessages";
import {
  getUserMessage,
  addUserMessage,
  addUserMessages
} from "../../Utils/userMessages";
const logoImg = require("../../assets/media/logo.png");
const TYPE = "signup_botMessages";
class SignUp extends React.Component {
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
    this.getBotMessageGroup(TYPE);
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
    if (!this.state.showInput) this.scrollToBottom(500);
    const { userMessage } = this.state;
    const showInput = !this.state.showInput;
    if (timeout) {
      setTimeout(() => {
        if (!this.state.showInput) this.scrollToBottom(500);
        this.setState({
          showInput,
          userMessage: showInput ? getUserMessage(TYPE) : userMessage
        });
      }, getInputTimeoutValue());
    } else {
      this.setState({
        showInput,
        userMessage: showInput ? getUserMessage(TYPE) : userMessage
      });
    }
  }

  setMessageInState(message) {
    const messages = this.state.messages.slice();
    messages.push(message);
    this.setState({ messages });
  }

  addMessage = message => {
    if (message.isPhoneNumberExist) {
      addBotMessageGroup(TYPE, [
        {
          type: "bot",
          message:
            "There is already an account with that number. Please try with another number."
        }
      ]);
      addUserMessage(TYPE, {
        type: "user",
        inputType: "input",
        placeholder: "",
        key: "phone"
      });
    }
    if (message.inputType === "input" && message.key === "forename") {
      setTimeout(() => {
        this.scrollToBottom();
        let name = message.message;
        this.setMessageInState({
          type: "bot",
          message: `Thanks ${name}.`
        });
        this.getBotMessageGroup(TYPE);
      }, getBetweenTimeoutValue());
    }
    if (message.key === "wrong_sms") {
      addUserMessage(TYPE, {
        type: "user",
        inputType: "input",
        placeholder: "6-digits",
        key: "sms"
      });
      addUserMessage(TYPE, {
        type: "user",
        inputType: "input",
        placeholder: "",
        key: "phone"
      });
      addBotMessageGroup(TYPE, [
        {
          type: "bot",
          message: "Please confirm the sms code received."
        }
      ]);
      addBotMessageGroup(TYPE, [
        {
          type: "bot",
          message: `SMS Code is not matching. Try again.`
        }
      ]);
      this.getBotMessageGroup(TYPE);
    }
    if (message.key === "no_received") {
      addUserMessage(TYPE, {
        type: "user",
        inputType: "input",
        placeholder: "6-digits",
        key: "sms"
      });
      addUserMessage(TYPE, {
        type: "user",
        inputType: "input",
        placeholder: "",
        key: "phone"
      });
      addBotMessageGroup(TYPE, [
        {
          type: "bot",
          message: "Please confirm the sms code received."
        }
      ]);
      addBotMessageGroup(TYPE, [
        {
          type: "bot",
          message: `Try again.`
        }
      ]);
      this.getBotMessageGroup(TYPE);
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
              getBotMessageGroup(TYPE);
            }
          } else {
            this.stoppedMessage = message;
            return;
          }
        } else {
          for (let i = 0; i < message.moveBot; i++) {
            getBotMessageGroup(TYPE);
          }
        }
      }
      if (
        typeof message.moveUser !== "undefined" &&
        message.moveUser &&
        message.allowNotification !== true
      ) {
        for (let i = 0; i < message.moveUser; i++) {
          getUserMessage(TYPE);
        }
      }
      if (!message.finish) {
        setTimeout(() => {
          this.getBotMessageGroup(TYPE);
        }, 1000);
      }
    }
    this.setMessageInState(message);
    this.toggleUserInput();
  };
  register = async profile => {
    const newProfile = { ...profile, renter_owner: 'Renter' }
    let register_result = await Firebase.register(newProfile);
    console.log("register_result", register_result);
    if (register_result) {
      this.props.dispatch(saveProfile(newProfile));
      this.props.dispatch(saveUID(register_result.id));
      this.props.history.push("/home");
    }
  };
  render() {
    const { logo } = this.props;
    const { showInput, userMessage, isIphoneX } = this.state;
    return (
      <div className="app-wrapper">
        <div className="bg" />
        <div>
          <img src={logoImg} style={{ width: 180 }} alt="logo" />
        </div>
        <div style={{ height: 20 }}></div>
        <div className="message-list-wrapper">
          {this.setMessages()}
          <TransitionGroup component="div" className="message-input-container">
            {showInput ? (
              <MessageInput
                message={userMessage}
                addMessage={this.addMessage}
                isIphoneX={isIphoneX}
                logo={logo}
                onRegister={this.register}
              />
            ) : null}
          </TransitionGroup>
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
    users: state.users
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);

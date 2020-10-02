import React, { Component } from "react";
import { animateScroll } from "react-scroll";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import Firebase from "../firebasehelper";
import ErrorModal from "./ErrorModal";
import {
  getBotMessageGroup,
  getBetweenTimeoutValue,
  getTimeoutValue,
  getInputTimeoutValue,
  addBotMessageGroup,
  addBotMessages,
} from "../Utils/botMessages";
import {
  getUserMessage,
  addUserMessage,
  addUserMessages,
} from "../Utils/userMessages";
import {
  registration_botMessages,
  registration_userMessages,
} from "../Constants/messages";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.messages = [
      {
        type: "user",
        message: "Hello",
      },
    ];
    this.state = {
      showInput: false,
      messages: [],
      name: "",
      isIphoneX: true,
      brand: "ecosystem",
      modalIsOpen: false,
      uid: props.uid,
      profile: props.profile,
      showTravel: false,
      super_admins: [],
      chatbot: {},
    };
  }

  componentDidMount() {
    const { logo } = this.props;
    this.setState({ brand: logo });
    addBotMessages(registration_botMessages);
    addUserMessages(registration_userMessages);
    this.getBotMessageGroup();
  }
  getBotMessageGroup = () => {
    this.setState({
      showInput: false,
    });
    let messageGroup = getBotMessageGroup();
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
          smooth: "easeInOutQuad",
        });
      }, delay);
    } else {
      animateScroll.scrollToBottom({
        duration: 500,
        smooth: "easeInOutQuad",
      });
    }
  }

  setMessages() {
    const { logo, icon } = this.props;
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
          icon={icon}
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
          userMessage: showInput ? getUserMessage() : userMessage,
        });
      }, getInputTimeoutValue());
    } else {
      this.setState({
        showInput,
        userMessage: showInput ? getUserMessage() : userMessage,
      });
    }
  }

  setMessageInState(message) {
    const messages = this.state.messages.slice();
    messages.push(message);
    this.setState({ messages });
  }
  addMessage = (message) => {
    if (message.inputType === "input" && message.key === "firstname") {
      setTimeout(() => {
        this.scrollToBottom();
        let firstname = message.message;
        this.setMessageInState({
          type: "bot",
          message: `Great, thanks ${firstname}. `,
        });
        this.getBotMessageGroup();
      }, getBetweenTimeoutValue());
    } else if (message.key === "signup") {
      let profile = message.profile;
      this.setState({ profile: profile });
      const { brand } = this.state;
      this.signup(profile)
        .then((res) => {
          if (res) {
            const uid = res.id;
            this.setState({ uid: uid });
            this.getBotMessageGroup();
            Firebase.getChatsById(res.id, (res) => {
              if (res) {
                this.openChat();
              }
            });
          } else {
            this.setState({
              modalIsOpen: true,
              caption: "Error",
              content: `Your phone number is already existing in ${brand}!`,
            });
          }
        })
        .catch((err) => {
          this.setState({
            modalIsOpen: true,
            caption: "Error",
            content: err,
          });
        });
    }else if (message.key === "wrong_sms") {
      addUserMessage({
        type: "user",
        inputType: "input",
        placeholder: "6-digits",
        key: "sms",
      });
      addUserMessage({
        type: "user",
        inputType: "input",
        placeholder: "",
        key: "phone",
      });
      addBotMessageGroup([
        {
          type: "bot",
          message: "Please confirm the sms code received.",
        },
      ]);
      addBotMessageGroup([
        {
          type: "bot",
          message: `SMS Code is not matching. Try again.`,
        },
      ]);
      this.getBotMessageGroup();
    } else if (message.key === "no_received") {
      addUserMessage({
        type: "user",
        inputType: "input",
        placeholder: "6-digits",
        key: "sms",
      });
      addUserMessage({
        type: "user",
        inputType: "input",
        placeholder: "",
        key: "phone",
      });
      addBotMessageGroup([
        {
          type: "bot",
          message: "Please confirm the sms code received.",
        },
      ]);
      addBotMessageGroup([
        {
          type: "bot",
          message: `Try again.`,
        },
      ]);
      this.getBotMessageGroup();
    } else if (message.key === "sms") {
      let phone = message.phone;
      let profile = message.profile;
      this.setState({ profile, phone });
      let new_profile = {
        dob: profile.dob,
        firstname: profile.firstname,
        phonenumber: profile.phonenumber,
      };
        this.signup(new_profile)
        .then((res) => {
          if (res) {
            const uid = res.id;
            this.setState({ uid: uid });
            this.getBotMessageGroup();
            Firebase.getChatsById(res.id, (res) => {
              if (res) {
                this.openChat();
              }
            });
          } else {
            this.setState({
              modalIsOpen: true,
              already_existing: true,
              caption: "You are already a member",
              content: `This phone number is registered to a member, I will take you to the members area.`,
            });
          }
        })
        .catch((err) => {
          this.setState({
            modalIsOpen: true,
            caption: "Error",
            content: err,
          });
        });
    } else {
      if (!message.finish) {
        setTimeout(() => {
          this.getBotMessageGroup();
        }, 1000);
      }
    }

    this.setMessageInState(message);
    this.toggleUserInput();
  };
  signup = (profile) => {
    const { brand } = this.state;
    if (brand !== "ecosystem") {
      return Firebase.signup(profile, brand);
    }
  };

  goBack = () => {
    this.restart();
    this.getBotMessageGroup();
  };
  closeModal = () => {
    this.setState({ modalIsOpen: false });
    window.location.reload();
  };
  render() {
    const { logo, tier_data,chatbot } = this.props;
    const {
      showInput,
      userMessage,
      isIphoneX,
      modalIsOpen,
      caption,
      content,
      is_member,
      profile,
      brand,
      uid
    } = this.state;
    return (
      <div className="message-list-wrapper">
        {this.setMessages()}
        <div component="div" className="message-input-container">
          {showInput ? (
            <MessageInput
              message={userMessage}
              addMessage={this.addMessage}
              isIphoneX={isIphoneX}
              logo={logo}
              brand={brand}
              chatbot={chatbot}
              is_member={is_member}
              tier_data={tier_data}
              onRestart={this.goBack}
              profile={profile}
              uid={uid}
            />
          ) : null}
        </div>
        <ErrorModal
          caption={caption}
          content={content}
          closeModal={this.closeModal}
          modalIsOpen={modalIsOpen}
        />
      </div>
    );
  }
}

export default MessageList;

import React, { Component } from "react";
import { TransitionGroup } from "react-transition-group";
import { animateScroll } from "react-scroll";
import MessageItem from "../../Components/MessageItem";
import MessageInput from "../../Components/MessageInput";
import Firebase from "../../firebasehelper";
import ErrorModal from "../../Components/ErrorModal";
import {
  getBotMessageGroup,
  getBetweenTimeoutValue,
  getTimeoutValue,
  getInputTimeoutValue,
  addBotMessageGroup,
  addBotMessages,
} from "./Utils/botMessages";
import {
  getUserMessage,
  addUserMessage,
  addUserMessages,
} from "./Utils/userMessages";
import {
  registered_botMessages,
  registered_userMessages,
  registration_botMessages,
  registration_userMessages,
} from "./Constants/messages";
import { getTicketNumber, ticket_create_SMS } from "../../functions/Auth";
import ClockImage from "../../images/clock.png";
import PhoneImage from "../../images/phone.png";

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
      is_member: false,
      showTravel: false,
      super_admins: [],
    };
  }

  componentDidMount() {
    const { logo, restart, uid, profile } = this.props;
    this.setState({ brand: logo });
    if (restart) {
      this.setState({ uid: uid, profile: profile });
      this.restart();
    }
    this.getBotMessageGroup();
    Firebase.getAllSuperAdmins((res) => {
      this.setState({ super_admins: res });
    });
  }
  componentWillReceiveProps(nextProps) {
    // const { logo, restart, uid, profile } = nextProps;
    // this.setState({ brand: logo });
    // if (restart) {
    //   this.setState({ uid: uid, profile: profile });
    //   this.restart();
    // }
    // this.getBotMessageGroup();
  }
  restart = () => {
    const { profile, uid } = this.state;
    const { firstname } = profile;
    this.setState({ messages: [], showTravel: false });
    Firebase.getChatsById(uid, (res) => {
      console.log("getChatsById", res);
      if (res) {
        this.setState({ ticket_id: res });
        this.openChat();
      }
    });
    addBotMessageGroup([
      {
        type: "bot",
        message: `Hi ${firstname},<br> How can I help today?`,
      },
    ]);
    addUserMessage({
      type: "user",
      inputType: "choice",
      key: "choice",
    });
  };
  getBotMessageGroup = () => {
    this.setState({
      showInput: false,
    });
    let messageGroup = getBotMessageGroup();
    console.log("messageGroup", messageGroup);
    if (!messageGroup) {
      addBotMessages([
        [
          {
            type: "bot",
            message: "Hello, are you a member?",
          },
        ],
      ]);
      addUserMessages([
        {
          type: "user",
          inputType: "toggleButton",
          options: [
            {
              text: "No, I'd like to register for a 30 day trial",
              value: "No",
            },
            { text: "Yes", value: "Yes" },
          ],
          key: "is_member",
        },
      ]);
      messageGroup = getBotMessageGroup();
    }
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
  isUserCovered = () => {
    const { profile } = this.state;
    const { packages } = profile;
    let flag = false;
    if (packages) {
      packages.forEach((item) => {
        if (item.caption === "Serviced Home Pack") flag = true;
      });
    }
    return flag;
  };
  addMessage = (message) => {
    const { brand, uid, profile } = this.state;
    console.log("addMessage", message);
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
    } else if (message.key === "is_member") {
      if (message.message === "Yes") {
        this.setState({ is_member: true });
        addBotMessages(registered_botMessages);
        addUserMessages(registered_userMessages);
      } else {
        addBotMessages(registration_botMessages);
        addUserMessages(registration_userMessages);
      }
      this.getBotMessageGroup();
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
    } else if (message.key === "cuisine") {
      addUserMessage({
        type: "user",
        inputType: "book_date",
        key: "book_date",
      });
      addBotMessageGroup([
        {
          type: "bot",
          message: "What day would you like to book the table for?",
        },
      ]);
      this.getBotMessageGroup();
    } else if (message.key === "book_date") {
      addUserMessage({
        type: "user",
        inputType: "book_time",
        key: "book_time",
        placeholder: "Time",
      });
      addBotMessageGroup([
        {
          type: "bot",
          message: "What time?",
        },
      ]);
      this.getBotMessageGroup();
    } else if (message.key === "book_time") {
      addUserMessage({
        type: "user",
        inputType: "book_people",
        key: "book_people",
      });
      addBotMessageGroup([
        {
          type: "bot",
          message: "How many people?",
        },
      ]);
      this.getBotMessageGroup();
    } else if (message.key === "book_people") {
      let profile = message.profile;
      addUserMessage({
        type: "user",
        inputType: "choice",
        key: "choice",
      });
      addBotMessageGroup([
        {
          type: "bot",
          message: `Congratulations. Your booking at <b>${profile["cuisine"].restaurant_name}</b> has been made for <b>${profile["book_date"]}</b> at <b>${profile["book_time"]}</b> for <b>${profile["book_people"]}</b> people.`,
        },
        {
          type: "bot",
          message: "How else can I help you today?",
        },
      ]);

      const ticket = {
        id: 22,
        issue: `Booking at ${profile["cuisine"].restaurant_name}`,
        status: "Waiting",
        title: "My Dining",
      };
      this.requestChat(ticket);
      this.getBotMessageGroup();
    } else if (message.key === "wellness") {
      addUserMessage({
        type: "user",
        inputType: "wellnessSupport",
        options: [
          {
            text: "Schedule A Call",
            value: "Schedule A Call",
            icon: ClockImage,
            bgColor: "#ffe4fe",
          },
          {
            text: "Chat Direct To An Expert Now",
            value: "Chat Direct To An Expert Now",
            icon: PhoneImage,
            bgColor: "#faffcc",
          },
        ],
        issue: message.message,
        ticket_id: message.ticket_id,
        key: "wellness-speak",
      });

      addBotMessageGroup([
        {
          type: "bot",
          message:
            "Our expert wellness and wellbeing helpers are here to offer you support and guidance, today impartially and confidentially.\n<b>Feeling your best self, starts with a single click.</b>",
        },
      ]);

      this.getBotMessageGroup();
    } else if (message.key === "tokens") {
      if (message.message === "Spend Token") {
        this.props.history.push("/spend_tokens", { brand: brand, uid: uid });
      }
    } else if (message.key === "wellness-speak") {
      if (message.message === "Speak to someone now") {
        addUserMessage({
          type: "user",
          inputType: "choice",
          key: "choice",
        });

        addBotMessageGroup([
          {
            type: "bot",
            message:
              "A specialist concierge will be in touch via chat in the next few minutes.",
          },
          {
            type: "bot",
            message: "How else can I help you today?",
          },
        ]);

        const ticket = {
          id: message.ticket_id,
          issue: message.issue,
          status: "Waiting",
          title: "My Wellness",
        };
        this.requestChat(ticket);
      } else {
        this.restart();
      }
      this.getBotMessageGroup();
    } else if (message.key === "choice") {
      if (message.message !== "Home Repairs") {
        const ticket_title = message.message;
        console.log("ticket_title", ticket_title);
        if (ticket_title === "Book Personal Travel") {
          // this.setState({ showTravel: true });
          this.props.history.push("/travelguide", {
            brand: brand,
            uid: uid,
            phonenumber: profile.phonenumber,
          });
        } else if (
          ticket_title === "Top 10" ||
          ticket_title === "Fashion" ||
          ticket_title === "Food and Drink" ||
          ticket_title === "Beauty & Wellbeing" ||
          ticket_title === "Home" ||
          ticket_title === "Entertainment" ||
          ticket_title === "Tech"
        ) {
          // this.setState({ showTravel: true });
          this.props.history.push("/myoffers", {
            category: ticket_title,
            brand: brand,
          });
        } else if (ticket_title === "Dining") {
          addUserMessage({
            type: "user",
            inputType: "restaurant",
            key: "cuisine",
          });
          addBotMessageGroup([
            {
              type: "bot",
              message: "Let's build your perfect dining experience.",
            },
            {
              type: "bot",
              message: "I'll earn you tokens & find discounts + upgrades.",
            },
          ]);
        } else if (ticket_title === "My Wellness") {
          addUserMessage({
            type: "user",
            inputType: "wellness",
            key: "wellness",
          });
          addBotMessageGroup([
            {
              type: "bot",
              message: "How are you feeling?",
            },
          ]);
        } else if (ticket_title === "Tokens") {
          addUserMessage({
            type: "user",
            inputType: "tokens",
            key: "tokens",
          });
          addBotMessageGroup([
            {
              type: "bot",
              message: "Here's your token balance.",
            },
            {
              type: "bot",
              message:
                "Live tokens are available to redeem on the store and with our partner retailers now.",
            },
          ]);
        } else if (ticket_title === "View timeline") {
          addUserMessage({
            type: "user",
            inputType: "timeline",
            key: "timeline",
          });
          addBotMessageGroup([
            {
              type: "bot",
              message:
                "Here are your latest requests. Expand to view and interact.",
            },
          ]);
        } else {
          addBotMessageGroup([
            {
              type: "bot",
              message:
                "A specialist concierge will be in touch via chat in the next few minutes.",
            },
          ]);
          addUserMessage({
            type: "user",
            inputType: "choice",
            key: "choice",
          });
          //this.createTicket(ticket_title);
        }
      } else if (message.message === "Home Repairs") {
        addUserMessage({
          type: "user",
          inputType: "issue",
          key: "question",
        });
        addBotMessageGroup([
          {
            type: "bot",
            message: "Please could you describe your problem in detail?",
          },
        ]);
      }

      message.message =
        "I'd like help with " +
        message.message.toLowerCase() +
        " please " +
        brand +
        "?";
      this.getBotMessageGroup();
    } else if (message.key === "after_repair") {
      if ((message.message = "Thank You")) {
        this.restart();
        this.getBotMessageGroup();
      }
    } else if (message.key === "wrong_sms") {
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
      let is_member = message.is_member;
      if (is_member) {
        Firebase.getProfile(phone, brand).then((res) => {
          if (res) {
            localStorage.setItem("uid", res.id);
            this.setState({ uid: res.id });
            this.setState({ profile: res.data() });
            this.getBotMessageGroup();
            Firebase.getChatsById(res.id, (res) => {
              if (res) {
                this.setState({ ticket_id: res });
                this.openChat();
              }
            });
          } else
            this.setState({
              modalIsOpen: true,
              caption: "Error",
              content: `Your phone number is not existing in ${brand}!`,
            });
        });
      } else {
        this.setState({ profile, phone });
        console.log("profile before signup", profile);
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
      }
    } else if (message.key === "question") {
      const quez = message.quez;
      const { item, room, adjective } = quez;
      let is_covered = this.isUserCovered();
      Firebase.findAnswer(item, room, adjective, (res) => {
        if (res) {
          let ticket = {
            id: res.ticket,
            issue: res.issue,
            status: "Waiting",
            title: "Home Repairs",
            response_sla: res.response_sla,
            repair_sla: res.repair_sla,
            band: res.band,
            item,
            room,
            adjective,
          };
          if (is_covered) {
            addBotMessageGroup([
              {
                type: "bot",
                message: "Thanks for reporting this issue.",
              },
              { type: "bot", message: "This is a " + res.band + "." },
              { type: "bot", message: `This is covered by ${brand}` },
              {
                type: "bot",
                message:
                  `A ${brand} worker will be in touch ` +
                  res.response_sla +
                  ".",
              },
              {
                type: "bot",
                message:
                  "We aim to have this repair made " + res.repair_sla + ".",
              },
              {
                type: "bot",
                message:
                  "We have logged a ticket, which our team will be monitoring. If you have any other questions please do let me know.",
              },
            ]);
            addUserMessage({
              type: "user",
              inputType: "toggleButton",
              options: [
                { text: "Thank You", value: "Thank You" },
                { text: "Speak to a person", value: "Speak to a person" },
              ],
              key: "after_repair",
            });

            let _this = this;
            setTimeout(() => {
              _this.requestChat(ticket);
            }, 12000);
            // setTimeout(() => {
            //   _this.toggleUserInput();
            // }, 18000);

            this.getBotMessageGroup();
          } else {
            addBotMessageGroup([
              {
                type: "bot",
                message: "Thanks for reporting this issue.",
              },
              { type: "bot", message: "This is a " + res.band + "." },
              {
                type: "bot",
                message: `We are arranging a ${brand} specialist to service this for you.`,
              },
              {
                type: "bot",
                message: `Our vetted service person will visit you with an aim of fixing this issue during the visit for a set charge of.`,
              },
              {
                type: "bot",
                message: `I always provide you with the best in market rates for your address.`,
              },
              {
                type: "bot",
                message: `We will arrange access through this chat. If the job requires additional parts or visits I will approve this with you via chat.`,
              },
              {
                type: "bot",
                message: `You are in safe hands.`,
              },
              { type: "bot", message: `Do you accept this?` },
              // {
              //   type: "bot",
              //   message:
              //     `A ${brand} worker will be in touch ` + res.response_sla + "."
              // },
              // {
              //   type: "bot",
              //   message:
              //     "We aim to have this repair made " + res.repair_sla + "."
              // },
              // {
              //   type: "bot",
              //   message:
              //     "We have logged a ticket, which our team will be monitoring. If you have any other questions please do let me know."
              // }
            ]);

            addUserMessage({
              type: "user",
              inputType: "toggleButton",
              options: [
                { text: "Yes", value: "Yes" },
                { text: "No", value: "No" },
              ],
              response_sla: res.response_sla,
              repair_sla: res.repair_sla,
              ticket: ticket,
              key: "accept",
            });
            // setTimeout(() => {
            //   _this.toggleUserInput();
            // }, 18000);

            this.getBotMessageGroup();
          }
        }
      });
    } else if (message.key === "accept") {
      let ticket = message.ticket;
      console.log(message);
      this.requestChat(ticket);
      console.log("message", message);
      if (message.message === "Yes") {
        addBotMessageGroup([
          {
            type: "bot",
            message:
              `A ${brand} worker will be in touch ` + ticket.response_sla + ".",
          },
          {
            type: "bot",
            message:
              "We aim to have this repair made " + ticket.repair_sla + ".",
          },
        ]);
        addUserMessage({
          type: "user",
          inputType: "toggleButton",
          options: [
            { text: "Thank you, I'm happy.", value: "Thank You" },
            { text: "Speak to a human", value: "Speak to a human" },
          ],
          key: "after_repair",
        });
        this.getBotMessageGroup();
      } else {
        addBotMessageGroup([
          {
            type: "bot",
            message: `Ok, as you wish, please let us know if you'd like further help with the issue.`,
          },
        ]);
        this.getBotMessageGroup();
        this.restart();
      }
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
    console.log("profile in MessageList", profile);
    const { brand } = this.state;
    if (brand !== "ecosystem") {
      return Firebase.signup(profile, brand);
    }
  };
  sendSMS = (ticket_title) => {
    const { uid, profile, brand, super_admins } = this.state;
    super_admins.map((item) => {
      let { phonenumber, username } = item;
      let response = ticket_create_SMS(
        phonenumber,
        username,
        ticket_title,
        brand
      );
    });
    // let response = ticket_create_SMS(
    //   phonenumber,
    //   firstname,
    //   ticket_title,
    //   brand
    // );
  };
  createTicket = async (choice) => {
    let ticket_id = await getTicketNumber(choice);
    let ticket = {
      id: ticket_id,
      issue: choice,
      status: "Waiting",
      title: choice,
    };
    console.log("ticket", ticket);
    this.requestChat(ticket);
  };
  requestChat = (ticket) => {
    const { uid, profile, brand } = this.state;
    const { firstname, phonenumber } = profile;
    console.log(
      "uid,profile,brand,ticket.title",
      uid,
      profile,
      brand,
      ticket.title
    );
    let time = new Date().getTime().toString();
    ticket.time = time;
    this.setState({ issue_title: ticket.title });
    this.sendSMS(ticket.title);
    Firebase.requestChat(uid, firstname, brand, ticket);
  };
  openChat = () => {
    const { uid, ticket_id, profile } = this.state;
    console.log("uid,ticket_id,profile", uid, ticket_id, profile);
    const { onStartChat } = this.props;
    onStartChat(uid, profile, ticket_id);
  };
  goBack = () => {
    // const { uid, profile } = this.props;
    // this.setState({ uid: uid, profile: profile });
    this.restart();
    this.getBotMessageGroup();
  };
  closeModal = () => {
    this.setState({ modalIsOpen: false });
    window.location.reload();
  };
  render() {
    const { logo, tier_data, uid } = this.props;
    const {
      showInput,
      userMessage,
      isIphoneX,
      modalIsOpen,
      caption,
      content,
      is_member,
      profile,
    } = this.state;
    console.log("showInput", showInput);
    console.log("profile", profile);
    return (
      <div className="message-list-wrapper">
        {this.setMessages()}
        <div component="div" className="message-input-container">
          {showInput ? (
            <MessageInput
              message={userMessage}
              addMessage={this.addMessage}
              onStartChat={(ticket_id) => {
                this.setState({ ticket_id });
                this.openChat();
              }}
              isIphoneX={isIphoneX}
              logo={logo}
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

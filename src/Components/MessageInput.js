import React, { Component, Fragment } from "react";
import Progress from "react-progressbar";
import Select from "./Select";
import ToggleButton from "./ToggleButton";
import YesNoButton from "./YesNoButton";
import DateInput from "./DateInput";
import IssueInput from "./IssueInput";
import { doSMS, clearZero } from "../functions/Auth";
import { animateScroll } from "react-scroll";
import Firebase from "../firebasehelper";
import ErrorModal from "./ErrorModal";
let profile = {};
class MessageInput extends Component {
  state = {
    value: "",
    modalIsOpen: false,
    caption: "",
    content: "",
    checking_phone: false,
    profile: {
      value: "",
      isFocused: false,
      pin: "",
      phonenumber: "",
      firstname: "",
      dob: "",
      sms: "",
      email: "",
      password: "",
      personalType: "",
      spareType: "",
      animalType: "",
      socialType: "",
      employmentType: "",
      salary: "",
      addressType: "",
    },
    fileupload: 0,
  };
  handleTouchStart = false;

  getStaticMessage() {
    const { addMessage, message, logo } = this.props;
    if (Array.isArray(message.message)) {
      return (
        <div className="message-array">
          {message.message.map((message, i) => {
            return (
              <div
                className={`message message-static ${
                  logo === "ecosystem" ? " " : "notbolt"
                }`}
                onTouchStart={() => {
                  addMessage({
                    type: "user",
                    ...message,
                  });
                }}
                key={i}
              >
                {message.message}
              </div>
            );
          })}
        </div>
      );
    }
    return (
      <div
        className={`message message-static ${
          logo === "ecosystem" ? " " : "notbolt"
        }`}
        onClick={() => {
          if (message.signup) {
            const signup_profile = {
              firstname: profile.firstname,
              phonenumber: profile.phonenumber,
              dob: profile.dob,
            };
            message.profile = signup_profile;
          }
          addMessage(message);
        }}
      >
        {message.message}
      </div>
    );
  }

  getInputMessage() {
    const { value, isFocused, checking_phone } = this.state;
    const { message, logo, isIphoneX, addMessage } = this.props;
    return (
      <div className="message-input-outer">
        {message.key === "sms" && (
          <div
            className={`button ${logo === "ecosystem" ? "" : "notbolt"}`}
            onClick={(e) => {
              this.handleTouchStart = true;
              addMessage({
                type: "user",
                message: "I didn't receive a code.",
                inputType: "input",
                key: "no_received",
              });
            }}
          >
            I didn't receive a code
          </div>
        )}
        <div className="message-input-container">
          {message.key.includes("phone") && <p>+44</p>}
          <input
            type="text"
            value={value}
            placeholder={message.placeholder}
            className={`${message.key.includes("phone") ? "phone" : ""}  ${
              message.key === "salary" ? "salary" : ""
            } ${message.key === "company_site" ? "company_site" : ""}`}
            onChange={this.onChange}
            onKeyPress={(e) => {
              if (e.charCode === 13) this.addMessage();
            }}
            onFocus={() => {
              this.setState(
                {
                  isFocused: true,
                },
                () => {
                  animateScroll.scrollToBottom({
                    duration: 500,
                    smooth: "easeInOutQuad",
                  });
                }
              );
            }}
            onBlur={() => {
              this.setState({
                isFocused: false,
              });
            }}
          />

          {!checking_phone && (
            <div
              className={`send-button ${value ? "" : "disabled"} ${
                logo === "ecosystem" ? "" : "notbolt"
              }`}
              onClick={(e) => {
                if (value) {
                  if (this.handleTouchStart) {
                    setTimeout(() => {
                      this.handleTouchStart = false;
                    }, 1000);
                    e.preventDefault();
                    return;
                  }
                  this.handleTouchStart = true;
                  this.addMessage();
                } else
                  this.setState({
                    modalIsOpen: true,
                    caption: "Warning",
                    content: "All fields are required!",
                  });
              }}
            >
              <img
                src={require("../images/computer-icons-send.png")}
                alt="send-icon"
              />
            </div>
          )}
          {checking_phone && (
            <p style={{ fontSize: 15 }}>Checking phone number..</p>
          )}
        </div>
      </div>
    );
  }

  getSelectInput() {
    const { addMessage, message } = this.props;
    const { options } = message;
    return <Select options={options} addMessage={addMessage} />;
  }

  setSelectedOption = (index) => {
    const { addMessage, message } = this.props;
    const selectedOption = message.options[index]["value"];

    profile[message.key] = selectedOption;
    if (message.ticket)
      addMessage({
        type: "user",
        message: selectedOption,
        inputType: "toggleInput",
        key: message.key,
        ticket: message.ticket,
      });
    else
      addMessage({
        type: "user",
        message: selectedOption,
        inputType: "toggleInput",
        key: message.key,
      });
  };
  getDateMessage() {
    const { addMessage, logo, message } = this.props;
    return (
      <DateInput addMessage={this.addDate} logo={logo} message={message} />
    );
  }
  getToggleButton() {
    const { options, directionRow } = this.props.message;
    return (
      <ToggleButton
        options={options}
        setSelectedOption={this.setSelectedOption}
        row={directionRow}
      />
    );
  }
  getYesNoInput() {
    return <YesNoButton setSelectedOption={this.chooseOption} />;
  }
  onStartChat = (ticket_id) => {
    const { onStartChat } = this.props;
    onStartChat(ticket_id);
  };
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  createPincode = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };
  addAddress = (address) => {
    const { addMessage, message } = this.props;
    profile[message.key] = address;
    let add = address.split(", ");
    profile["number"] = add[0];
    profile["street"] = add[1];
    profile["city"] = add[2];
    profile["postcode"] = add[3];
    addMessage({
      message: address,
      ...message,
    });
  };
  addDate = (date) => {
    const { addMessage, message } = this.props;
    profile[message.key] = date;
    let status = profile["addressType"];
    addMessage({
      message: date,
      status: status,
      ...message,
    });
  };
  jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  addMessage = async () => {
    const { addMessage, message, is_member, logo,setTicket } = this.props;
    const { value } = this.state;
    if (message.key === "email") {
      if (value && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
        this.setState({
          modalIsOpen: true,
          caption: "Invalid Email",
          content: "Please enter valid email address!",
        });
      else if (value) {
        profile[message.key] = value;
        addMessage({
          type: "user",
          message: value,
          inputType: "input",
          isNext: message.isNext,
        });
      } else {
        profile[message.key] = null;
        addMessage({
          type: "user",
          message: "not now",
          inputType: "input",
          isNext: message.isNext,
        });
      }
    } else if (message.key === "dob") {
      if (
        value &&
        !/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(
          value
        )
      )
        this.setState({
          modalIsOpen: true,
          caption: "Invalid format of date",
          content: "Please enter valid date format!",
        });
      else if (value) {
        profile[message.key] = value;
        addMessage({
          type: "user",
          message: value,
          inputType: "input",
          isNext: message.isNext,
          isCommunication: message.isCommunication
        });
      }
    } else if (message.key === "password") {
      if (
        value &&
        !/(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/.test(
          value
        )
      )
        this.setState({
          modalIsOpen: true,
          caption: "Password is not strong",
          content: "Please enter stronger password!",
        });
      else if (value) {
        profile["password"] = value;
        addMessage({
          type: "user",
          message: value,
          inputType: "input",
          isNext: message.isNext,
        });
      }
    } else if (message.key !== "email") {
      if (message.key === "phone") {
        let number = clearZero(value);
        let phone = "+44" + number;
        if (profile["is_member"] === "No") {
          let pin = this.createPincode();
          pin = pin.toString();
          console.log("pin", pin);
          localStorage.setItem("phone", phone);
          localStorage.setItem("pin", pin);
          let response = doSMS(phone, pin, logo);
          console.log("response", response);

          addMessage({
            type: "user",
            message: phone,
            profile: profile,
            key: "phone",
            inputType: "input",
            isNext: message.isNext,
          });
        } else {
          this.setState({ checking_phone: true });
          let profile = await Firebase.getProfile(phone, logo);
          this.setState({ checking_phone: false });
          if (profile) {
            let pin = this.createPincode();
            pin = pin.toString();
            console.log("pin", pin);
            localStorage.setItem("phone", phone);
            localStorage.setItem("pin", pin);
            let response = doSMS(phone, pin, logo);
            console.log("response", response);

            addMessage({
              type: "user",
              message: phone,
              profile: profile,
              key: "phone",
              inputType: "input",
              isNext: message.isNext,
            });
          } else {
            this.setState({
              modalIsOpen: true,
              caption: "Error",
              content: `You aren't registered with that mobile number. Please register as a member now. You will get 30 a day free trial.`,
            });
          }
        }
      } else if (message.key === "sms") {
        let phone = localStorage.getItem("phone");
        let pin = localStorage.getItem("pin");
        if (pin === value) {
          profile["phonenumber"] = phone;
          addMessage({
            type: "user",
            message: value,
            key: message.key,
            inputType: "input",
            is_member: is_member,
            profile: profile,
            phone: phone,
            isNext: message.isNext,
          });
        } else {
          addMessage({
            type: "user",
            message: value,
            key: "wrong_sms",
            inputType: "input",
            isNext: message.isNext,
          });
        }
      } else {
        profile[message.key] = value;
        addMessage({
          type: "user",
          message: value,
          profile: profile,
          key: message.key,
          inputType: "input",
          isNext: message.isNext,
          isCommunicationLayer: message.isCommunicationLayer
        });
      }
    }
  };
  componentWillLeave(callback) {
    const { message } = this.props;
    console.log("message in componentWillLeave", message);
    console.log("message when leave", message);
    if (message.inputType !== "input") {
      this.setState({
        leaving: true,
      });
      setTimeout(() => {
        callback();
      }, 400);
    } else callback();
  }
  closeModal = () => {
    this.setState({ modalIsOpen: false });
    window.location.reload();
  };
  goBack = () => {
    const { goBack } = this.props;
    goBack();
  };
  render() {
    const { leaving, modalIsOpen, caption, content, fileupload } = this.state;
    const { message } = this.props;
    return (
      <Fragment>
        <ErrorModal
          caption={caption}
          content={content}
          closeModal={this.closeModal}
          modalIsOpen={modalIsOpen}
        />
        {message && (
          <div
            className={`message-input-wrapper ${message.inputType} ${
              leaving ? "leaving" : ""
            }`}
          >
            {message.inputType === "static" ? this.getStaticMessage() : null}
            {message.inputType === "input" ? this.getInputMessage() : null}
            {message.inputType === "address" ? this.getAddress() : null}
            {message.inputType === "date" ? this.getDateMessage() : null}
            {message.inputType === "issue" ? this.getIssueInput() : null}
            {message.inputType === "select" ? this.getSelectInput() : null}
            {message.inputType === "yesno" ? this.getYesNoInput() : null}
          </div>
        )}
        <Progress completed={fileupload} />
      </Fragment>
    );
  }
}

export default MessageInput;

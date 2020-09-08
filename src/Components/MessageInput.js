import React, { Component, Fragment } from "react";
import Progress from "react-progressbar";
import Select from "./Select";
import ToggleButton from "./ToggleButton";
import YesNoButton from "./YesNoButton";
import CardContainer from "./CardContainer";
import Address from "./Address";
import FileDialog from "./FileDialog";
import DateInput from "./DateInput";
import CountryPicker from "./CountryPicker";
import { doSMS, clearZero } from "../functions/Auth";
import { animateScroll } from "react-scroll";
import Firebase from "../firebasehelper";
import ErrorModal from "./ErrorModal";
import SelectBrand from "./SelectBrand";
import Choice from "./Choice";
import IssueInput from "./IssueInput";
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let items = [];
let rooms = [];

Firebase.getAllItem((res) => {
  items = res.map((item) => {
    return { value: item, label: item.toLowerCase() };
  });
});
Firebase.getAllRoom((res) => {
  rooms = res.map((item) => {
    return { value: item, label: item.toLowerCase() };
  });
});

let profile = {};
class MessageInput extends Component {
  state = {
    value: "",
    modalIsOpen: false,
    caption: "",
    content: "",
    profile: {
      value: "",
      isFocused: false,
      pin: "",
      phone: "",
      username: "",
      sms: "",
      email: "",
      password: "",
      salary: "",
    },
    checkingprofile: false,
  };
  handleTouchStart = false;

  getStaticMessage() {
    const { addMessage, message, logo } = this.props;
    return (
      <div
        className={`message message-static ${
          logo === "ecosystem" ? " " : "notbolt"
        }`}
        onClick={(e) => {
          this.handleTouchStart = true;
          this.addMessage({
            type: "user",
            message: message.message,
            register: message.register,
            start_trial: message.start_trial,
          });
        }}
      >
        {message.message}
      </div>
    );
  }
  getInputMessage() {
    const { value, isFocused } = this.state;
    const { message, logo, isIphoneX, addMessage } = this.props;
    return (
      <div className="message-input-outer">
        {message.key === "sms" && (
          <div
            className={`button ${logo === "bolt" ? "" : "notbolt"}`}
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
            } ${message.key === "company_site" ? "company_site" : ""} ${
              message.key === "bill-price" ? "bill-price" : ""
            }`}
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

          <div
            className={`send-button ${value ? "" : "disabled"} ${
              logo === "bolt" ? "" : "notbolt"
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
            Go
          </div>
        </div>
      </div>
    );
  }

  getSelectInput() {
    const { addMessage, message } = this.props;
    const { options } = message;
    return <Select options={options} addMessage={addMessage} />;
  }

  setSelectedOption = async (index) => {
    const { addMessage, message } = this.props;
    const selectedOption = message.options[index]["value"];
    console.log("message", message);
    profile[message.key] = selectedOption;
    console.log("selectedOption", selectedOption);
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
  chooseOption = (result) => {
    const { addMessage, message } = this.props;
    profile[message.key] = result;
    addMessage({
      type: "user",
      message: result,
      inputType: "yesno",
      key: message.key,
    });
  };
  getAddress() {
    const { addMessage, message } = this.props;
    return (
      <Address
        addMessage={this.addAddress}
        message={message}
        postcode={profile["postcode"]}
      />
    );
  }
  getDateMessage() {
    const { addMessage, logo, message } = this.props;
    return (
      <DateInput addMessage={this.addDate} logo={logo} message={message} />
    );
  }
  getToggleButton() {
    const { options } = this.props.message;
    return (
      <ToggleButton
        options={options}
        setSelectedOption={this.setSelectedOption}
      />
    );
  }
  getYesNoInput() {
    return <YesNoButton setSelectedOption={this.chooseOption} />;
  }
  getCardInput() {
    const { addMessage, message } = this.props;
    const { cards } = message;
    return (
      <CardContainer addMessage={addMessage} cards={cards} message={message} />
    );
  }

  addChoice = (choice) => {
    const { addMessage, message } = this.props;
    profile[message.key] = choice;
    addMessage({
      message: choice,
      ...message,
    });
  };

  getChoice() {
    const { message, tier_data } = this.props;
    return (
      <Choice
        addMessage={this.addChoice}
        message={message}
        tier_data={tier_data}
      />
    );
  }

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
    const address_arr = address.split(",");
    if (message.key === "address") {
      profile["street"] = address_arr[0];
      profile["city"] = address_arr[1];
    } else {
      profile[message.key] = address;
    }
    addMessage({
      message: address,
      ...message,
    });
  };

  jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  doRegister = (profile) => {
    const { onRegister } = this.props;
    onRegister(profile);
  };
  addMessage = async () => {
    const { addMessage, message, onStartTrial } = this.props;
    console.log("message", message);
    const { value } = this.state;
    if (message.key === "firstname") {
      profile["firstname"] = value;
    }
    if (message.key === "phone") {
      this.setState({ checkingprofile: true });
      let number = clearZero(value);
      let phone = "+44" + number;
      this.setState({ checkingprofile: true });
      Firebase.isProfileExist(phone).then((res) => {
        console.log("isProfileExist", res);
        this.setState({ checkingprofile: false });
        addMessage({
          type: "user",
          message: phone,
          key: message.key,
          isPhoneNumberExist: res,
          inputType: "input",
          isNext: message.isNext,
        });
        if (!res) {
          let pin = this.createPincode();
          pin = pin.toString();
          console.log("pin", pin);
          localStorage.setItem("phone", phone);
          localStorage.setItem("pin", pin);
          let response = doSMS(phone, pin);
          console.log("response", response);
        }
      });
    } else if (message.key === "sms") {
      let phone = localStorage.getItem("phone");
      let pin = localStorage.getItem("pin");
      if (pin === value) {
        profile["phone"] = phone;
        addMessage({
          type: "user",
          message: value,
          key: message.key,
          inputType: "input",
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
    } else if (message.register) {
      addMessage({
        type: "user",
        message: message.message,
        key: message.key,
        inputType: "input",
      });
      let newProfile = [];
      newProfile = {
        firstname: profile["firstname"],
        phonenumber: profile["phone"],
        manageType: profile["manageType"],
      };
      this.doRegister(newProfile);
    } else if (message.start_trial) {
      addMessage({
        type: "user",
        message: message.message,
        key: message.key,
        inputType: "input",
      });
      onStartTrial();
    } else
      addMessage({
        type: "user",
        message: value,
        key: message.key,
        inputType: "input",
        result: message.result,
      });
    console.log("profile", profile);
  };
  componentWillLeave(callback) {
    const { message } = this.props;
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
  };

  addIssueQuestion = (item, room, adjective) => {
    const { addMessage, message } = this.props;
    const text =
      "The " +
      item.toLowerCase() +
      " in the " +
      room.toLowerCase() +
      " is " +
      adjective.toLowerCase() +
      ".";
    profile[message.key] = text;
    addMessage({
      message: text,
      quez: { item: item, room: room, adjective: adjective },
      ...message,
    });
  };

  getIssueInput() {
    const { logo, message } = this.props;
    return (
      <IssueInput
        addMessage={this.addIssueQuestion}
        logo={logo}
        message={message}
        items={items}
        rooms={rooms}
      />
    );
  }

  getSelectBrand() {
    const { addMessage, message } = this.props;
    return (
      <SelectBrand
        addMessage={(message) =>
          addMessage({
            type: "user",
            message: message,
            inputType: "selectbrand",
            isNext: true,
          })
        }
        message={message}
      />
    );
  }

  render() {
    const {
      leaving,
      modalIsOpen,
      caption,
      content,
      checkingprofile,
    } = this.state;
    const { message } = this.props;
    return (
      <Fragment>
        <ErrorModal
          caption={caption}
          content={content}
          closeModal={this.closeModal}
          modalIsOpen={modalIsOpen}
        />
        {checkingprofile && (
          <p style={{ fontSize: 10, textAlign: "right" }}>
            Checking phone number...
          </p>
        )}
        {message && !checkingprofile && (
          <div
            className={`message-input-wrapper ${message.inputType} ${
              leaving ? "leaving" : ""
            }`}
          >
            {message.inputType === "static" ? this.getStaticMessage() : null}
            {message.inputType === "nation" ? this.getNation() : null}
            {message.inputType === "input" ? this.getInputMessage() : null}
            {message.inputType === "address" ? this.getAddress() : null}
            {message.inputType === "date" ? this.getDateMessage() : null}
            {message.inputType === "select" ? this.getSelectInput() : null}
            {message.inputType === "selectBrand" ? this.getSelectBrand() : null}
            {message.inputType === "card" ? this.getCardInput() : null}
            {message.inputType === "yesno" ? this.getYesNoInput() : null}
            {message.inputType === "upload" ? this.getUploadDialog() : null}
            {message.inputType === "choice" ? this.getChoice() : null}
            {message.inputType === "issue" ? this.getIssueInput() : null}
            {message.inputType === "toggleButton"
              ? this.getToggleButton()
              : null}
          </div>
        )}
      </Fragment>
    );
  }
}

export default MessageInput;

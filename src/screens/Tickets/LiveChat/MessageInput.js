import React, { Component, Fragment } from "react";
const IconSendImg = require("../../../assets/images/computer-icons-send.png");
class MessageInput extends Component {
  state = {
    value: "",

    caption: "",
    content: ""
  };
  handleTouchStart = false;

  getInputMessage() {
    const { value, isFocused } = this.state;
    const { logo, onType } = this.props;
    return (
      <div className="message-input-outer">
        <div className="message-input-container">
          <input
            type="text"
            value={value}
            onChange={this.onChange}
            onKeyPress={(e) => {
              if (e.charCode === 13) this.addMessage();
            }}
          />
          <div
            className={`send ${value ? "" : "disabled"} ${
              logo === "ecosystem" ? "" : "notbolt"
            }`}
            onClick={(e) => {
              if (value) 
                this.addMessage();
              }}
            >
              <img src={IconSendImg} alt="send-icon" />
          </div>
        </div>
      </div>
    );
  }

  onChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  addMessage = () => {
    const { addMessage } = this.props;
    const { value } = this.state;
    addMessage({
      type: "user",
      message: value
    });
    this.setState({ value: "" });
  };
  render() {
    const { modalIsOpen, caption, content, typing } = this.state;
    return (
      <div className={`message-input-wrapper`}>{this.getInputMessage()}</div>
    );
  }
}

export default MessageInput;
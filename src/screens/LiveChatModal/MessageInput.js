import React, { Component, Fragment } from "react";
import { animateScroll } from "react-scroll";
import Firebase from "../../firebasehelper";
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
            onKeyPress={e => {
              onType();
              if (e.charCode === 13) this.addMessage();
            }}
            onFocus={() => {
              this.setState(
                {
                  isFocused: true
                },
                () => {
                  animateScroll.scrollToBottom({
                    duration: 500,
                    smooth: "easeInOutQuad"
                  });
                }
              );
            }}
            onBlur={() => {
              this.setState({
                isFocused: false
              });
            }}
          />

          <div
            className={`send-button ${value ? "" : "disabled"} ${
              logo === "bolt" ? "" : "notbolt"
            }`}
            onClick={e => {
              if (value) {
                this.addMessage();
              }
            }}
          >
            Go
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
    console.log("typing", typing);
    return (
      <div className={`message-input-wrapper`}>{this.getInputMessage()}</div>
    );
  }
}

export default MessageInput;

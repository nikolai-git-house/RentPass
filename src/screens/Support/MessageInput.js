import React, { Component, Fragment } from "react";
import { animateScroll } from "react-scroll";
const IconSendImg = require("../../assets/images/computer-icons-send.png");
class MessageInput extends Component {
  state = {
    value: "",
    caption: "",
    content: ""
  };
  handleTouchStart = false;

  getInputMessage() {
    const { value } = this.state;
    const { logo } = this.props;
    return (
      <div className="message-input-outer">
        <div className="message-input-container">
          <input
            type="text"
            value={value}
            onChange={this.onChange}
            onKeyPress={e => {
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
              className={`send ${value ? "" : "disabled"} ${
                logo === "ecosystem" ? "" : "notbolt"
              }`}
              onClick={(e) => {
                if (value) {
                    this.addMessage();
                    setTimeout(() => {
                        animateScroll.scrollToBottom({
                            duration: 500,
                            smooth: "easeInOutQuad"
                          });
                    }, 1000);
                } else
                    this.setState({
                      modalIsOpen: true,
                      caption: "Warning",
                      content: "All fields are required!",
                    });
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
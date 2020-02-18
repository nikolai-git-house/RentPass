import React, { Component } from "react";
import { animateScroll } from "react-scroll";
import Loader from "./Loader";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentWillMount() {
    const { timeoutValue, message } = this.props;
    const { type } = message;
    setTimeout(
      () => {
        if (type === "bot")
          animateScroll.scrollToBottom({
            duration: 0
          });
        this.setState({
          loaded: true
        });
      },
      type === "bot" ? timeoutValue : 0
    );
  }

  render() {
    const { firstChild } = this.props;
    const { type, message } = this.props.message;
    const { loaded } = this.state;
    return (
      <div
        className={`message-item-wrapper ${loaded ? "loaded" : ""} ${type} ${
          firstChild ? "first-child" : ""
        }`}
      >
        <Loader />
        <div className="message">{message}</div>
      </div>
    );
  }
}

export default Form;

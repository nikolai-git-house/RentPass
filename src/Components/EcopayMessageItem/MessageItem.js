import React, { Component, Fragment } from "react";
import ReactHtmlParser from "react-html-parser";
import { animateScroll } from "react-scroll";
import Barcode from "react-barcode";
import Loader from "../Loader";
class MessageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      user_img: require("../../images/livechat/user.png"),
    };
  }

  componentWillMount() {
    const { timeoutValue, message, logo } = this.props;
    const { type } = message;
    setTimeout(
      () => {
        if (type === "bot")
          animateScroll.scrollToBottom({
            duration: 0,
          });
        this.setState({
          loaded: true,
        });
      },
      type === "bot" ? timeoutValue : 0
    );
  }

  renderMessage(obj) {
    const { logo } = this.props;
    const { message } = obj;
    if (obj.inputType === "selectbrand") {
      return (
        <div
          className={`message ${logo === "ecosystem" ? "" : "notbolt"}`}
          style={{ backgroundColor: "white" }}
        >
          <img src={message.ecopayLogo || message.logo} width={200} />
        </div>
      );
    } else if (obj.inputType === "input" && obj.key === "barcode") {
      return (
        <div className={`message ${logo === "ecosystem" ? "" : "notbolt"}`}>
          <Barcode value={message} width={1} />
        </div>
      );
    } else {
      return (
        <div
          className={`message ${logo === "ecosystem" ? "" : "notbolt"}`}
          style={obj.style}
        >
          <span>{ReactHtmlParser(message)}</span>
        </div>
      );
    }
  }

  render() {
    const { firstChild, logo, icon } = this.props;
    const { type, message, src, mark, end } = this.props.message;
    const { loaded, user_img } = this.state;
    return (
      <div
        style={
          type === "bot"
            ? {
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }
            : {
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-end",
              }
        }
      >
        {/* <Sound url="../audio/bamboo.mp3" playStatus={Sound.status.PLAYING} /> */}
        {type === "bot" && (
          <img
            src={icon}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              flex: "none",
            }}
            alt="concierge"
            className="avatar"
          />
        )}

        {src && (
          <div
            className={`message-item-wrapper ${
              loaded ? "loaded" : ""
            } ${type} ${firstChild ? "first-child" : ""}`}
            style={{ width: "100%", height: "200px" }}
          >
            <Loader />
            <div
              className="message"
              style={{
                backgroundImage: `url(${src})`,
                width: "100%",
                height: "100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        )}
        {message && (
          <div
            className={`message-item-wrapper ${
              loaded ? "loaded" : ""
            } ${type} ${firstChild ? "first-child" : ""}`}
          >
            <Loader />

            {this.renderMessage(this.props.message)}
          </div>
        )}

        {type === "user" && (
          <img
            src={user_img}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              flex: "none",
            }}
            alt="concierge"
            className="avatar"
          />
        )}
      </div>
    );
  }
}

export default MessageItem;

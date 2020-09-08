import React, { Component, Fragment } from "react";
import ReactHtmlParser from "react-html-parser";
import { animateScroll } from "react-scroll";
import Loader from "./Loader";

class MessageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      img_src: require("../images/logos/logo.png"),
      user_img: require("../images/livechat/user.png"),
    };
  }

  componentWillMount() {
    const { timeoutValue, message, logo } = this.props;
    const { type, mark } = message;
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
    this.setState({ img_src: require("../images/logos/logo.png") });

    if (mark) {
      this.setState({ img_src: require("../images/battery.png") });
    }
  }

  render() {
    const { firstChild, logo, icon } = this.props;
    const { type, message, mark, end } = this.props.message;
    const { loaded, img_src, user_img } = this.state;
    return (
      <Fragment>
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
          {type === "bot" && (
            <img
              className="avatar"
              src={icon || img_src}
              style={{ width: 40, height: 40, marginRight: 3 }}
              alt="concierge"
            />
          )}

          <div
            className={`message-item-wrapper ${
              loaded ? "loaded" : ""
            } ${type} ${firstChild ? "first-child" : ""}`}
          >
            <Loader />
            <div className={`message ${logo === "bolt" ? "" : "notbolt"}`}>
              {ReactHtmlParser(message)}
            </div>
          </div>
          {type === "user" && (
            <img
              src={user_img}
              style={{ width: 40, height: 40 }}
              alt="concierge"
              className="avatar"
            />
          )}
        </div>
      </Fragment>
    );
  }
}

export default MessageItem;

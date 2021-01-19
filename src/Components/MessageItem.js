import React, { Component, Fragment } from "react";
import ReactHtmlParser from "react-html-parser";
import { animateScroll } from "react-scroll";
import Barcode from "react-barcode";
import Loader from "./Loader";
import classNames from "classnames";
import loading_gif from "../assets/images/loading.gif";
class MessageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      user_img: props.userIcon||require("../images/livechat/user.png"),
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
    const { firstChild, icon, color, isLanding } = this.props;
    const { type, message, src,loading } = this.props.message;
    const { loaded, user_img } = this.state;
    return (
      <div
        className={classNames({ "landing-message-item": isLanding })}
        style={
          type === "bot"
            ? {
                marginTop:20,
                marginBottom:20,
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }
            : {
                marginTop:20,
                marginBottom:20,
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-end",
              }
        }
      >
        {type === "bot" && (
          isLanding?<div className="landing_icon" style={{backgroundColor:color}}>
              <img
                src={"https://firebasestorage.googleapis.com/v0/b/boltconcierge-2f0f9.appspot.com/o/brand_icon%2FRental%20Community?alt=media&token=2e96bade-f7f1-4dbd-afd9-6f7caa9d4dc8"}
                style={{
                  width: 20,
                  height: 20,
                }}
                alt="concierge"
            />
          </div>
          :<img
            src={loading?loading_gif:"https://firebasestorage.googleapis.com/v0/b/boltconcierge-2f0f9.appspot.com/o/brand_icon%2FRental%20Community?alt=media&token=2e96bade-f7f1-4dbd-afd9-6f7caa9d4dc8"}
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
            style={{ width: "100%", height: "200px",marginTop:0,marginBottom:0 }}
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
            style={{marginTop:0,marginBottom:0}}
          >
            <Loader />

            {this.renderMessage(this.props.message)}
          </div>
        )}

        {type === "user" && (
          <div
            className="avatar"
            style={{backgroundImage:`url(${user_img})`}}
            alt="concierge"
        />
        )}
      </div>
    );
  }
}

export default MessageItem;

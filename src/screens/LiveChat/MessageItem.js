import React, { Component, Fragment } from "react";
import ReactHtmlParser from "react-html-parser";
import Loader from "./Loader";

class MessageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: props.loaded,
      img_src: require("./logos/logo.png"),
    };
  }

  componentDidMount() {
    this.setState({ loaded: this.props.loaded });
  }
  getImage = (type) => {
    const { icon, userIcon } = this.props;
    switch (type) {
      case "agency":
        return userIcon || require("./logos/logo.png");
      case "bot":
        return icon;
      case "landlord":
        return require("./logos/landlord_logo.png");
      case "contractor":
        return require("./logos/contractor_logo.png");
      default:
        return require("./logos/agency_logo.png");
    }
  };
  render() {
    const { logo } = this.props;
    const { type, message } = this.props.message;
    const { loaded, img_src } = this.state;
    return (
      <Fragment>
        <div
          style={
            type === "user"
              ? {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  marginBottom: 16,
                  minHeight: 'max-content'
                }
              : {
                  display: "flex",
                  alignSelf: "flex-end",
                  maxWidth: "100%",
                  marginBottom: 16,
                  minHeight: 'max-content'
                }
          }
        >
          {type === "user" && (
            <img
              className="avatar"
              src={img_src}
              style={{ width: 40, height: 40 }}
              alt="concierge"
            />
          )}

          <div
            className={`message-item-wrapper ${
              loaded ? "loaded" : ""
            } ${type} `}
          >
            <Loader />
            <div className={`message ${logo === "bolt" ? "" : "notbolt"}`}>
              {ReactHtmlParser(message)}
            </div>
          </div>
          {(type === "agency" ||
            type === "landlord" ||
            type === "contractor" ||
            type === "bot") && (
            <img
              className="avatar"
              src={this.getImage(type)}
              style={{ width: 40, height: 40, marginLeft: 5 }}
              alt="concierge"
            />
          )}
        </div>
      </Fragment>
    );
  }
}

export default MessageItem;

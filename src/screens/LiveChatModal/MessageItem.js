import React, { Component, Fragment } from "react";
import ReactHtmlParser from "react-html-parser";
import { animateScroll } from "react-scroll";
import Loader from "./Loader";
const getImage = type => {
  switch (type) {
    case "landlord":
      return require("./logos/landlord_logo.png");
    case "contractor":
      return require("./logos/contractor_logo.png");
    default:
      return require("./logos/agency_logo.png");
  }
};
class MessageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: props.loaded,
      img_src: require("./logos/logo.png")
    };
  }

  componentDidMount() {
    this.setState({ loaded: this.props.loaded });
  }

  render() {
    const { icon } = this.props;
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
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginBottom: 16
                }
              : {
                  display: "flex",
                  flexDirection: "row",
                  alignSelf: "flex-end",
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                  maxWidth: "100%"
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
            <div className={`message`}>{ReactHtmlParser(message)}</div>
          </div>
          {(type === "landlord" || type === "contractor") && (
            <img
              className="avatar"
              src={getImage(type)}
              style={{ width: 40, height: 40, marginLeft: 5 }}
              alt="concierge"
            />
          )}
          {type === "agency" && (
            <img
              className="avatar"
              src={icon}
              style={{
                width: 40,
                height: 40,
                minWidth: 40,
                minHeight: 40,
                marginLeft: 5
              }}
              alt="concierge"
            />
          )}
        </div>
      </Fragment>
    );
  }
}

export default MessageItem;

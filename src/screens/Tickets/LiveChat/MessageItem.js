import React, { Component, Fragment } from "react";
import ReactHtmlParser from "react-html-parser";
import Loader from "./Loader";

class MessageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: props.loaded,
      img_src: props.userIcon|| require("./logos/logo.png"),
    };
  }

  componentDidMount() {
    this.setState({ loaded: this.props.loaded });
  }
  getImage = (type) => {
    const icon = "https://firebasestorage.googleapis.com/v0/b/boltconcierge-2f0f9.appspot.com/o/brand_icon%2FRental%20Community?alt=media&token=2e96bade-f7f1-4dbd-afd9-6f7caa9d4dc8";
    switch (type) {
      case "agency":
        return icon;
      case "bot":
        return icon;
      case "landlord":
        return require("./logos/landlord_logo.png");
      case "contractor":
        return require("./logos/contractor_logo.png");
      default:
        return icon;
    }
  };
  render() {
    const { logo } = this.props;
    const { type, message,background } = this.props.message;
    const { loaded, img_src } = this.state;
    return (
      <Fragment>
        <div
          style={
            type === "user"
              ? {
                  display: "flex",
                  alignSelf: "flex-end",
                  maxWidth: "100%",
                  minHeight: 'max-content',
                  marginTop:10,
                }
              : {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  minHeight: 'max-content',
                  marginTop:10,
                }
          }
        >
          {(type === "agency" ||
            type === "landlord" ||
            type === "contractor" ||
            type === "bot") && (
            <img
              className="avatar"
              src={this.getImage(type)}
              style={{marginLeft: 5 }}
              alt="concierge"
            />
          )}

          <div
            className={`message-item-wrapper ${
              loaded ? "loaded" : ""
            } ${type} `}
          >
            <Loader />
            <div className={`message ${logo === "bolt" ? "" : "notbolt"}`} style={{backgroundColor:background||"unset"}}>
              {ReactHtmlParser(message)}
            </div>
          </div>
          {type === "user" && (
            <div
              className="avatar"
              src={img_src}
              style={{backgroundImage:`url(${img_src})`}}
              alt="concierge"
            />
          )}
          
        </div>
      </Fragment>
    );
  }
}

export default MessageItem;
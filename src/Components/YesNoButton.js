import React, { Component } from "react";

class YesNoButton extends Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end"
        }}
      >
        <div
          className={`message-item-wrapper`}
          onClick={() => this.props.setSelectedOption("Yes")}
        >
          <div
            className="message"
            style={{ background: "#f9ff66", color: "#152439" }}
          >
            Yes
          </div>
        </div>
        <div
          className={`message-item-wrapper`}
          onClick={() => this.props.setSelectedOption("No")}
        >
          <div
            className="message"
            style={{ background: "#f9ff66", color: "#152439" }}
          >
            No
          </div>
        </div>
      </div>
    );
  }
}

export default YesNoButton;

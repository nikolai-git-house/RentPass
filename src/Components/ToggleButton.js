import React, { Component } from "react";

class ToggleButton extends Component {
  render() {
    const { options, row } = this.props;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: row ? "row" : "column-reverse",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {options &&
          options.map((message, index) => (
            <div
              className={`message-item-wrapper`}
              key={index}
              onClick={() => this.props.setSelectedOption(index)}
            >
              <div
                className="message"
                style={{ backgroundColor: message.backgroundColor }}
              >
                {message.text}
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default ToggleButton;

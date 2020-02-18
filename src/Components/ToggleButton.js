import React, { Component } from "react";

class ToggleButton extends Component {
  render() {
    const { options } = this.props;
    return (
      <div>
        <hr />
        {options &&
          options.map((message, index) => (
            <div
              className={`message-item-wrapper`}
              key={index}
              onClick={() => this.props.setSelectedOption(index)}
            >
              <div className="message">{message.text}</div>
            </div>
          ))}
      </div>
    );
  }
}

export default ToggleButton;

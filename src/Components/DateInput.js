import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class DateInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }
  convertDate(date) {
    function pad(s) {
      return s < 10 ? "0" + s : s;
    }
    return [
      pad(date.getDate()),
      pad(date.getMonth() + 1),
      date.getFullYear()
    ].join("/");
  }
  addMessage = () => {
    const { addMessage, message } = this.props;
    const { startDate } = this.state;

    let date = this.convertDate(startDate);
    console.log("date", date);
    addMessage(date);
  };
  isFull = () => {
    const { startDate } = this.state;
    if (startDate) return true;
    else return false;
  };
  render() {
    const { logo } = this.props;
    return (
      <div
        className="message-input-container"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end"
        }}
      >
        <DatePicker
          dateFormat="dd/MM/yyyy"
          selected={this.state.startDate}
          onChange={this.handleChange}
        />
        <div
          className={`send-button ${this.isFull() ? "" : "disabled"} ${
            logo === "bolt" ? "" : "notbolt"
          }`}
          onClick={e => {
            if (this.handleTouchStart) {
              setTimeout(() => {
                this.handleTouchStart = false;
              }, 1000);
              e.preventDefault();
              return;
            }
            this.handleTouchStart = true;
            this.addMessage();
          }}
        >
          Go
        </div>
      </div>
    );
  }
}

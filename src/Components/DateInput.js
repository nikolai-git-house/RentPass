import React, { Component, Fragment } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { animateScroll } from "react-scroll";
import Select from "react-select";
const options = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];
const Styles = {
  control: (styles) => ({ ...styles, backgroundColor: "white", width: 120 }),
};
export default class DateInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      isFocused: false,
      selectedOption: null,
      day: "",
      year: "",
      month: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.setState({ month: selectedOption.value });
  };
  handleChangeDY = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  addMessage = () => {
    const { addMessage, message } = this.props;
    const { startDate, day, month, year } = this.state;

    let date = day + "/" + month + "/" + year;
    addMessage(date);
  };
  isFull = () => {
    const { startDate } = this.state;
    if (startDate) return true;
    else return false;
  };
  render() {
    const { isFocused, selectedOption, day, year } = this.state;
    const { isIphoneX } = this.props;
    return (
      <Fragment>
        <div
          className="message-input-container"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "95%",
          }}
        >
          <Select
            value={selectedOption}
            onChange={this.handleChange}
            options={options}
            styles={Styles}
            placeholder="Month"
            menuPlacement="top"
            onFocus={() => {
              this.setState(
                {
                  isFocused: true,
                },
                () => {
                  animateScroll.scrollToBottom({
                    duration: 500,
                    smooth: "easeInOutQuad",
                  });
                }
              );
            }}
            onBlur={() => {
              this.setState({
                isFocused: false,
              });
            }}
          />

          <input
            type="number"
            name="day"
            style={{
              width: 50,
              borderRadius: 4,
              boxShadow: "none",
              padding: 9,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "grey",
              background: "white",
            }}
            placeholder="DD"
            onChange={this.handleChangeDY}
            value={day}
            onFocus={() => {
              this.setState(
                {
                  isFocused: true,
                },
                () => {
                  animateScroll.scrollToBottom({
                    duration: 500,
                    smooth: "easeInOutQuad",
                  });
                }
              );
            }}
            onBlur={() => {
              this.setState({
                isFocused: false,
              });
            }}
          />
          <input
            type="number"
            name="year"
            style={{
              width: 50,
              borderRadius: 4,
              boxShadow: "none",
              borderStyle: "solid",
              padding: 10,
              borderWidth: 1,
              borderColor: "grey",
              background: "white",
            }}
            placeholder="YYYY"
            onChange={this.handleChangeDY}
            value={year}
            onFocus={() => {
              this.setState(
                {
                  isFocused: true,
                },
                () => {
                  animateScroll.scrollToBottom({
                    duration: 500,
                    smooth: "easeInOutQuad",
                  });
                }
              );
            }}
            onBlur={() => {
              this.setState({
                isFocused: false,
              });
            }}
          />
          <div
            className={`send-button ${this.isFull() ? "" : "disabled"}`}
            onClick={(e) => {
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
            <img
              src={require("../images/computer-icons-send.png")}
              alt="send-icon"
            />
          </div>
        </div>
        {isFocused && (
          <div
            style={{
              height: isIphoneX ? 350 : 300,
              backgroundColor: "#ffffff",
              marginLeft: -20,
              marginRight: -20,
            }}
          />
        )}
      </Fragment>
    );
  }
}

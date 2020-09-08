import React, { Component, Fragment } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { animateScroll } from "react-scroll";
import Select from "react-select";
import Firebase from "../firebasehelper";
const Styles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    width: 300,
    marginBottom: 20,
  }),
};
export default class IssueInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      isFocused: false,
      selectedOption: null,
      items: props.items,
      rooms: props.rooms,
      adjectives: [],
      room_value: null,
      openitemMenu: false,
      openadjMenu: false,
    };
  }

  handleChange = (selecteditem) => {
    console.log("selected");
    this.setState({ selecteditem });
    this.setState({ item: selecteditem.value });
    Firebase.getRoomByItem(selecteditem.value, (res, adjectives) => {
      console.log("rooms", res);
      if (res) {
        let room_value = { value: res[0], label: res[0] };
        this.setState({ room_value: room_value });
      } else this.setState({ room_value: null });
      console.log("adjectives", adjectives);
      this.setState({ adjectives: adjectives });
    });
  };
  onChangeRoom = (value) => {
    this.setState({ room_value: value });
  };
  handleChangeAdjective = (value) => {
    this.setState({ adjective: value });
  };
  addMessage = () => {
    const { addMessage, message } = this.props;
    const { selecteditem, room_value, adjective } = this.state;
    const item = selecteditem.value;
    const room = room_value.value;
    const description = adjective.value;

    addMessage(item, room, description);
  };
  isFull = () => {
    const { startDate } = this.state;
    if (startDate) return true;
    else return false;
  };
  handleItemInputChange = (query, { action }) => {
    if (action === "input-change") {
      console.log(query);
      if (query) this.setState({ openitemMenu: true });
      else this.setState({ openitemMenu: false });
    }
  };
  handleAdjInputChange = (query, { action }) => {
    if (action === "input-change") {
      console.log(query);
      if (query) this.setState({ openadjMenu: true });
      else this.setState({ openadjMenu: false });
    }
  };
  filterOption = (option, inputValue) => {
    // if (option.label === "Ostatni") {
    //   const { options } = this.state;
    //   const result = options.filter(opt => opt.label.includes(inputValue));
    //   this.setState({ hasExtraValue: !result.length });
    //   return !result.length;
    // }
    return option.label.startsWith(inputValue);
  };
  render() {
    const {
      isFocused,
      selecteditem,
      items,
      rooms,
      adjectives,
      room_value,
      adjective,
      openitemMenu,
      openadjMenu,
    } = this.state;
    const { isIphoneX } = this.props;
    return (
      <Fragment>
        <div
          className="message-input-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            width: "95%",
          }}
        >
          <p style={{ color: "black" }}>The</p>
          <Select
            value={selecteditem}
            onChange={this.handleChange}
            onInputChange={this.handleItemInputChange}
            options={items}
            styles={Styles}
            placeholder="Item to be repaired"
            menuPlacement="bottom"
            menuIsOpen={openitemMenu}
            filterOption={this.filterOption}
            onFocus={() => {
              this.setState(
                {
                  isFocused: true,
                }
                // () => {
                //   animateScroll.scrollToBottom({
                //     duration: 500,
                //     smooth: "easeInOutQuad"
                //   });
                // }
              );
            }}
            defaultMenuIsOpen={false}
            onBlur={() => {
              this.setState({
                openitemMenu: false,
                isFocused: false,
              });
            }}
          />
          <p style={{ color: "black" }}>in the</p>
          <Select
            value={room_value}
            onChange={this.onChangeRoom}
            options={rooms}
            styles={Styles}
            placeholder="Room"
            menuPlacement="bottom"
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
          <p style={{ color: "black" }}>is</p>
          <Select
            value={adjective}
            onChange={this.handleChangeAdjective}
            onInputChange={this.handleAdjInputChange}
            options={adjectives}
            styles={Styles}
            placeholder="Description of issue"
            menuPlacement="bottom"
            menuIsOpen={openadjMenu}
            filterOption={this.filterOption}
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
                openadjMenu: false,
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
        {/* {isFocused && (
          <div
            style={{
              height: isIphoneX ? 350 : 300,
              backgroundColor: "#ffffff",
              marginLeft: -20,
              marginRight: -20
            }}
          />
        )} */}
      </Fragment>
    );
  }
}

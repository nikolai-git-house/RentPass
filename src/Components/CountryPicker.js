import React, { Component } from "react";

import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

class CountryPicker extends Component {
  constructor(props) {
    super(props);
    this.state = { country: "", region: "" };
  }

  selectCountry(val) {
    this.setState({ country: val });
  }

  selectRegion(val) {
    this.setState({ region: val });
  }
  addMessage = () => {
    const { addMessage, message } = this.props;
    const { country, region } = this.state;
    let data = country + region;
    addMessage(data);
  };
  render() {
    const { country, region } = this.state;
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
        <CountryDropdown
          value={country}
          onChange={val => this.selectCountry(val)}
          className="nationality"
        />
        <div
          className={`send-button  ${logo === "bolt" ? "" : "notbolt"}`}
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
export default CountryPicker;

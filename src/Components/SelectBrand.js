import React, { Fragment } from "react";
import Select from "react-select";
import companies from "../assets/constants/company.json";

const IconSendImg = require("../assets/images/computer-icons-send.png");

const options = companies.map((obj) => ({ label: obj, value: obj }));
const Styles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    width: 250,
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: 14,
  }),
};
export default class SelectBrand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  };

  isFull = () => {
    const { selectedOption } = this.state;
    return !!selectedOption;
  };

  render() {
    const { selectedOption } = this.state;
    const { message } = this.props;
    return (
      <Fragment>
        <div
          className="message-input-container"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            marginTop: 16,
          }}
        >
          <Select
            value={selectedOption}
            onChange={this.handleChange}
            options={message.retailers
              .filter((obj) => obj.ecopayRetailer)
              .map((obj) => ({
                label: obj.retailerName,
                value: obj,
              }))}
            styles={Styles}
            placeholder="Select your store..."
            noOptionsMessage={() => null}
            isSearchable={false}
            className="select-brand-options"
          />
          <div
            className={`send ${this.isFull() ? "" : "disabled"}`}
            onClick={(e) => {
              if (this.isFull()) {
                this.props.addMessage(this.state.selectedOption.value);
              }
            }}
          >
            <img src={IconSendImg} alt="send-icon" />
          </div>
        </div>
      </Fragment>
    );
  }
}

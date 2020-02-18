import React, { Component } from "react";
import Select from "react-select";
import { getAddresses } from "../functions/Auth";

const Styles = {
  control: styles => ({ ...styles, backgroundColor: "white", width: 250 })
};
class Address extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      options: []
    };
  }
  componentDidMount() {
    const { postcode } = this.props;
    getAddresses(postcode)
      .then(res => {
        const arr = res.addresses.map(item => {
          const address = this.modifyAddress(item);
          return { value: address, label: address };
        });
        this.setState({ options: arr });
      })
      .catch(err => {
        alert(err);
        this.setState({
          options: [{ value: "Test address", label: "Test Address" }]
        });
      });
  }
  modifyAddress = text => {
    let arr = text.split(", ");
    return arr[0] + "," + arr[5];
  };
  handleChange = selectedOption => {
    this.setState({ selectedOption });
  };
  addMessage = () => {
    const { selectedOption } = this.state;
    const { addMessage } = this.props;
    addMessage(selectedOption.value);
  };
  render() {
    const { selectedOption, options } = this.state;
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
        <Select
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
          styles={Styles}
        />
        <div
          className={`send-button`}
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

export default Address;

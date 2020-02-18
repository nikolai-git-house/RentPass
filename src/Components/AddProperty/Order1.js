import React, { Component } from "react";
import Select from "react-select";
import { getAddresses } from "../../functions/Auth";
const Styles = {
  control: styles => ({ ...styles, backgroundColor: "white", width: 500 })
};
const property_types = [
  { value: 0, label: "Apartment" },
  { value: 1, label: "Detached house" },
  { value: 2, label: "Terrace house" },
  { value: 3, label: "Bungalow" }
];
class Order1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      property_type: props.property_type,
      bedrooms: props.bedrooms,
      address: props.address,
      postcode: ""
    };
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleChangePropertyType = property_type => {
    this.setState({ property_type });
  };
  handleChangeAddress = address => {
    this.setState({ address });
  };
  chooseAddress = () => {
    const { postcode } = this.state;
    getAddresses(postcode)
      .then(res => {
        const arr = res.addresses.map(item => {
          const address = this.modifyAddress(item);
          return { value: item, label: address };
        });
        this.setState({ addresses: arr });
      })
      .catch(err => {
        alert("We can't find address from your postcode.");
        this.setState({
          addresses: [{ value: "Test address", label: "Test Address" }]
        });
      });
  };
  modifyAddress = text => {
    let arr = text.split(", ");
    let str = arr.reduce((result, item) => {
      if (item) return result + item + ",";
      else return result;
    }, "");
    if (str[str.length - 1] === ",") {
      str = str.substring(0, str.length - 1);
    }
    return str;
  };
  Next = () => {
    const { property_type, bedrooms, address } = this.state;
    const { onNext } = this.props;
    onNext(property_type, bedrooms, address);
  };
  render() {
    const {
      property_type,
      bedrooms,
      address,
      addresses,
      postcode
    } = this.state;
    const { onClose } = this.props;
    return (
      <div>
        <div className="modal-header">
          <h5 className="modal-title">Add Property</h5>
          <button type="button" className="close" onClick={onClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="example-text-input">Postcode</label>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <input
                type="text"
                name="postcode"
                value={postcode}
                className="form-control"
                placeholder="Enter Postcode"
                onChange={this.onChange}
              />
              <button
                className="btn btn-rounded btn-hero-dark"
                style={{ fontSize: 12 }}
                onClick={this.chooseAddress}
              >
                <p>Find address</p>
              </button>
            </div>
          </div>
          <div className="form-group">
            <Select
              className="select-custom-class"
              name="address"
              value={address}
              onChange={this.handleChangeAddress}
              options={addresses}
              styles={Styles}
            />
          </div>
          <div className="form-group">
            <label htmlFor="example-text-input">Number of Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              min="0"
              value={bedrooms}
              className="form-control"
              placeholder="Input number of bedrooms"
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="example-text-input">Property Type</label>
            <Select
              className="select-custom-class"
              name="property_type"
              value={property_type}
              onChange={this.handleChangePropertyType}
              options={property_types}
              styles={Styles}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={this.Next}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}
export default Order1;

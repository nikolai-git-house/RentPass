import React, { Component } from "react";
import Select from "react-select";
import loadImage from "blueimp-load-image";
const Styles = {
  control: styles => ({ ...styles, backgroundColor: "white", width: 300 })
};
const rental_types = [
  { value: 0, label: "Standard" },
  { value: 1, label: "HMO" }
];
class Order2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      property_type: "",
      bedrooms: 0,
      address: "",
      content: ""
    };
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleChangeRentalType = rental_type => {
    this.setState({ rental_type });
  };
  selectedFile = e => {
    let _this = this;
    if (e.target.files && e.target.files[0]) {
      var content = e.target.files[0];
      loadImage.parseMetaData(content, function(data) {
        //default image orientation
        var orientation = 0;
        if (data.exif) {
          orientation = data.exif.get("Orientation");
        }
        loadImage(
          content,
          function(canvas) {
            var base64data = canvas.toDataURL("image/png");
            var img_src = base64data.replace(/^data\:image\/\w+\;base64\,/, "");
            _this.setState({ content: img_src });
            let img_content = "data:image/jpeg;base64," + img_src;
            _this.setState({ img_content });
          },
          {
            canvas: true,
            orientation: orientation
          }
        );
      });
    }
  };
  Add = () => {
    const { rental_type, img_content, price, content } = this.state;
    const { onAdd } = this.props;
    onAdd(rental_type, img_content, price, content);
  };
  render() {
    const { rental_type, img_content, price } = this.state;
    const { onBack, onClose } = this.props;
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
            <label htmlFor="example-text-input">Price per month</label>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <p
                style={{
                  marginRight: -13,
                  marginTop: 0,
                  marginBottom:0,
                  color: "#495057",
                  zIndex: 10
                }}
              >
                £
              </p>
              <input
                type="number"
                name="price"
                value={price}
                className="form-control"
                style={{fontSize:18}}
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="example-text-input">Rental Type</label>
            <Select
              className="select-custom-class"
              name="rental_type"
              value={rental_type}
              onChange={this.handleChangeRentalType}
              options={rental_types}
              styles={Styles}
            />
          </div>
          <div className="form-group">
            <label htmlFor="example-text-input">Property Image</label>
            <input
              type="file"
              id="example-file-input"
              name="example-file-input"
              accept="image/*"
              onChange={this.selectedFile}
            />
            {img_content && (
              <img src={img_content} width="40%" height="100%" alt="property" />
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={onBack}
          >
            Back
          </button>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={this.Add}
          >
            Add
          </button>
        </div>
      </div>
    );
  }
}
export default Order2;

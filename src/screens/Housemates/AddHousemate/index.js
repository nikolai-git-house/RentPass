import React, { Component } from "react";
import Modal from "react-modal";
import Select from "react-select";
import "./index.css";
const Styles = {
  control: styles => ({ ...styles, backgroundColor: "white", width: "100%" })
};
class AddHousemate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phonenumber: "",
      firstname: "",
    };
  }
  componentDidMount(){
    // let new_properties = properties.map(item=>{
    //   let property_id = item.id;
    //   let formatted_address = item.property_address.formatted_address;
    //   let property_address = this.modifyAddress(formatted_address);
    //   return {value:property_id,label:property_address}
    // });
    // console.log("new properties",new_properties);
    // this.setState({properties:new_properties});
  }
  componentDidUpdate(prevProps) {
    if (prevProps.showModal && !this.props.showModal) {
      this.setState({
        phonenumber: "",
        firstname: "",
      });
    }
  }
  // modifyAddress = formatted_address => {
  //   let str = formatted_address.reduce((result, item) => {
  //     if (item) return result + item + ",";
  //     else return result;
  //     }, "");
      
  //   return str.slice(0, -1);
  // };
  
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  addHousemate = () => {
    const { addHousemate,toggleModal } = this.props;
    const { phonenumber, firstname } = this.state;
    if(phonenumber&&firstname){
      addHousemate(firstname, phonenumber);
      this.setState({ firstname: "", phonenumber: "" });
      toggleModal();
    }
    else{
      alert("Please fill all fields.");
    }
  };
  // handleChangeProperty = property => {
  //   this.setState({ property });
  // };
  render() {
    const { firstname, phonenumber } = this.state;
    const { showModal, toggleModal } = this.props;
    return (
      <Modal
        closeTimeoutMS={200}
        isOpen={showModal}
        contentLabel="modal"
        onRequestClose={toggleModal}
      >
        <div className="modal-header">
          <h5 className="modal-title">Add Housemate</h5>
          <button type="button" className="close" onClick={toggleModal}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body pb-1">
          <div className="form-group">
            <label htmlFor="example-text-input">FirstName</label>
            <input
              type="text"
              name="firstname"
              value={firstname}
              className="form-control"
              placeholder="FirstName"
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="example-text-input">Mobile</label>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  marginRight: -34,
                  marginTop: 0,
                  marginBottom:0,
                  color: "#495057",
                  fontSize:18,
                  zIndex: 0,
                }}
              >
                +44
              </p>
              <input
                type="text"
                name="phonenumber"
                value={phonenumber}
                className="form-control"
                style={{ paddingLeft: 34,fontSize:18 }}
                onChange={this.onChange}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-sm btn-light"
            onClick={toggleModal}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={this.addHousemate}
            style={{ backgroundColor: "#bbffa8" }}
          >
            Invite
          </button>
        </div>
      </Modal>
    );
  }
}

export default AddHousemate;

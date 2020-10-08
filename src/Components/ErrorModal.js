import React, { Component } from "react";
import Modal from "react-modal";
import Firebase from "../firebasehelper";
const customStyles = {
  content: {
    width: "94%",
    top: "30%",
    left: "3%",
    right: "auto",
    bottom: "auto",
    padding: 0
  },
  overlay: {
    backgroundColor: "rgb(0,0,0,0.4)",
    zIndex: 1000
  }
};

class ErrorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  registertoRenter = ()=>{
    const { closeModal,content,wantRenter } = this.props;
    // if(!content.renter_owner){
    //   Firebase.addRenterByEcoId(content.eco_id,content.phonenumber).then(res=>{

    //   })
    // }
    wantRenter(content);
  }
  render() {
    const { modalIsOpen, closeModal } = this.props;
    const { caption, content } = this.props;
    return (
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
      >
        {caption!="profile_exist"&&<div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 20
          }}
        >
          <img
            src={require("../images/error.png")}
            width="82"
            height="82"
            alt="error"
          />
          <p
            style={{
              fontSize: 27,
              padding: 10,
              margin: 0,
              color: "rgb(0,0,0,.65)"
            }}
          >
            {caption}
          </p>
          <p style={{ fontSize: 16, margin: 0, color: "rgb(0,0,0,.65)" }}>
            {content}
          </p>
          <button
            style={{
              width: 100,
              background: "#f9ff66",
              borderRadius: 20,
              border: "none",
              margin: 20
            }}
            onClick={closeModal}
          >
            <p style={{ fontSize: 16, margin: 10, color: "rgb(0,0,0,.65)" }}>
              OK
            </p>
          </button>
        </div>}
        {caption==="profile_exist"&&<div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 20
          }}
        >
          <img
            src={content.avatar_url?content.avatar_url:require("../assets/media/logo/avatar.png")}
            width="82"
            height="82"
            alt="error"
          />
          <p
            style={{
              fontSize: 27,
              padding: 10,
              margin: 0,
              color: "rgb(0,0,0,.65)"
            }}
          >
            {content.firstname}
          </p>
          <p style={{ fontSize: 16, margin: 0, color: "rgb(0,0,0,.65)",textAlign:"center" }}>
            {!content.renter_owner&&`${content.firstname}, you are Ecosystem user but not a renter yet. Would you like to be renter?`}
            {content.renter_owner==="Renter"&&`${content.firstname}, you have joined already. You will be entered to Rental Community.`}
          </p>
          <button
            style={{
              width: 200,
              background: "#f9ff66",
              borderRadius: 20,
              border: "none",
              margin: 20
            }}
            onClick={this.registertoRenter}
          >
            <p style={{ fontSize: 16, margin: 10, color: "rgb(0,0,0,.65)" }}>
                {!content.renter_owner&&`I want to be a renter`}
                {content.renter_owner==="Renter"&&`OK`}
            </p>
          </button>
        </div>}
      </Modal>
    );
  }
}
export default ErrorModal;

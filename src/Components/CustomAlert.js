import React, { Component } from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    width: "94%",
    top: "30%",
    left: "3%",
    right: "auto",
    bottom: "auto",
    padding: 0,
  },
  overlay: {
    backgroundColor: "rgb(0,0,0,0.4)",
    zIndex: 1000,
  },
};

class CustomAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
        description:this.props.description
    };
  }
  componentDidUpdate(prevProps,prevState){
    if(prevProps!==this.props){
        this.setState({description:this.props.description});
        this.setState({is_Success:this.props.is_Success});
    }
  }
  render() {
    const { modalIsOpen, closeModal,icon } = this.props;
    const { description,is_Success } = this.state;
    return (
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
      >
        
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 20
          }}
        >
          <div
            style={{
              width:100,
              height: 100,
              borderRadius: 60,
              marginBottom:10,
              backgroundRepeat:"no-repeat",
              backgroundPosition:"center",
              backgroundSize:"cover",
              backgroundImage: `url(${icon})`
            }}
           >
            </div>
         
          <p style={{ fontSize: 16, margin:0, marginTop: 20, color: "rgb(0,0,0,.65)",textAlign:"center" }}>
            {description}
          </p>
          {is_Success&&<button
            style={{
              width: 200,
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
          </button>}
        </div>
    </Modal>
    );
  }
}
export default CustomAlert;

import React, { Component } from "react";
import TerminateTicketModal from "./TerminateTicketModal";
import MessageList from "./MessageList";
import Firebase from "../../../firebasehelper";
import "./Styles/index.css";
class LiveChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewSetting:false,
      isclosemodal_open:false,
      ticket:this.props.ticket
    };
  }
  toggleSetting = ()=>{
    const {viewSetting} = this.state;
    this.setState({viewSetting:!viewSetting});
    console.log("viewSetting",viewSetting);
  }
  openCloseModal = ()=>{
    this.setState({isclosemodal_open:true,viewSetting:false});
  }
  closeCloseModal = ()=>{
    this.setState({isclosemodal_open:false});
  }
  terminateTicket = checked => {
    this.closeCloseModal();
    let { uid } = this.props;
    let {ticket} = this.state;
    let ticket_id =""+ticket.id;
    let ticketID = ticket_id.split(".").join("");
    let feeling = checked;
    Firebase.terminateChat(uid, ticketID, feeling, res => {
      if (res === "success") {
        ticket.status="Closed";
        ticket.feeling = feeling;
        this.setState({ticket});
      }
    });
  };
  render() {
    const { uid, username, onBack, avatar } = this.props;
    const {viewSetting,isclosemodal_open,ticket} = this.state;
    return (
      <div className="live-chat-container">
        <div className="mobile-back" >
          <i className="fa fa-angle-left" onClick={onBack}></i> 
          <div className="right_setting">
            <p>{ticket.title}</p>
            <div className="icons">
              <i className={"si si-settings"} style={{marginLeft:10}} onClick={this.toggleSetting}></i>
            </div>
          </div>
        </div>
        {viewSetting&&<div className="setting">
          <button className="btn btn-green" onClick={onBack}>Close chat</button>
          {ticket.status!=="Closed"&&<button className="btn btn-yellow" onClick={this.openCloseModal}>Close ticket</button>}
          <button className="btn btn-orange">Add note</button>
        </div>}
        <MessageList
          logo="bolt"
          room_id={uid}
          ticket={ticket}
          username={username}
          avatar={avatar}
        />
        <TerminateTicketModal
          modalIsOpen={isclosemodal_open}
          closeModal={this.closeCloseModal}
          terminateTicket={this.terminateTicket}
          />
      </div>
    );
  }
}
export default LiveChat;
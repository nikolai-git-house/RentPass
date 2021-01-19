import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./index.css";
import "../../Styles/Common.css";
import MessageItem from "../../Components/MessageItem";
import MessageInput from "./MessageInput";
import {
  removeAll,
  saveBrand,
  saveProfile,
  saveUID,
} from "../../redux/actions";
import {
  getTimeoutValue,
  getBetweenTimeoutValue,
} from "../../Utils/botMessages";
import Firebase from "../../firebasehelper";
class Support extends React.Component {
  botMessages = [
  ];
  userMessages = [];

  state = {
    messages: [],
    showInput: true,
  };

  loadInfoFromUrl = async () => {
    const parsed = new URLSearchParams(this.props.location.search);
    const parsed_uid = parsed.get("uid");
    const parsed_brand = parsed.get("brand");

    const name = parsed_brand || "Ecosystem";

    let brand = this.props.brand;
    if (!brand || !brand.name) {
      brand = await Firebase.getBrandDataByName(name);
    }
    if (parsed_uid) {
      let profile = await Firebase.getProfileByUID(parsed_uid, name);
      this.props.dispatch(saveProfile(profile));
      this.props.dispatch(saveBrand(brand));
      this.props.dispatch(saveUID(parsed_uid));

      localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("brand", JSON.stringify(brand));
      localStorage.setItem("uid", parsed_uid);
    }
    return {
      uid: parsed_uid || this.props.uid,
      brand: brand || this.props.brand,
    };
  };

  async componentDidMount() {
    const {profile,uid} = this.props;
    if (!uid) {
      this.props.history.push("/");
      return;
    }
    let res = await Firebase.getTicketsbyUID(uid);
    
      this.botMessages = [];
      let supports = res?Object.values(res).filter(ticket=>ticket.title==="Support" && ticket.status!="Closed"):false;
      console.log("supports",supports);
      if(supports.length===0){
        this.addBotMessageGroup([
          {
            type: "bot",
            message: `Hi ${profile.firstname}, How can I help you today?`,
          },
        ]);
        this.addUserMessage({
          type: "user",
          inputType: "input",
          key:"question"
        });
        this.processBotMessageGroup();
      }
      else{
        let current_openticket = supports[0];
        this.props.history.push("/tickets", { ticket: current_openticket });
      }
  }

  componentDidUpdate(){
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  getBotMessageGroup = () => {
    return this.botMessages.shift();
  };

  getUserMessage = () => {
    return this.userMessages.shift();
  };

  addBotMessageGroup = (msgGroup) => {
    return this.botMessages.unshift(msgGroup);
  };

  addUserMessage = (message) => {
    return this.userMessages.unshift(message);
  };

  setMessageInState(message) {
    const messages = this.state.messages.slice();
    messages.push(message);
    this.setState({ messages });
  }

  toggleUserInput() {
    const showInput = !this.state.showInput;
    this.setState({showInput});
  }

  processBotMessageGroup = () => {
    let messageGroup = this.getBotMessageGroup();

    messageGroup.forEach((message, index) => {
      const timeoutValue =
        getTimeoutValue() + (index ? index * getBetweenTimeoutValue() : 0);
      setTimeout(() => {
        this.setMessageInState(message);
        
      }, timeoutValue);
    });
  };
  addMessage = async (message) => {
    this.toggleUserInput();
    this.addBotMessageGroup([
      {
        type: "bot",
        message: `Thanks for letting us know, a specialist will be with you in the next few minutes...`,
      },
    ]);
    this.processBotMessageGroup();
    this.createTicket(message.message);
    this.setMessageInState(message); 
  };
  createTicket = (question)=>{
    const { brand,profile,uid } = this.props;
    let ticket = {};
    let time = new Date().getTime().toString();
    ticket.time = time;
    ticket.title = "Support";
    ticket.issue = question;
    ticket.id = Math.floor(10000000000 + Math.random() * 90000000000);
    ticket.ticket_id = ticket.id;
    ticket.status = "Waiting";
    Firebase.createTicket(uid,profile.firstname,"Rental Community",ticket);
    setTimeout(()=>{
      this.props.history.push("/tickets", { ticket: ticket });
    },5000);
  }
  signOut = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("profile");
    localStorage.removeItem("brand");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };
  setMessages() {
    const { messages } = this.state;
    const { brand,profile } = this.props;
    return messages.map((message, i) => {
      return (
        <MessageItem
          message={message}
          key={i}
          userIcon={profile.avatar_url}
          timeoutValue={getTimeoutValue()}
        />
      );
    });
  }

  render() {
    const { showInput } = this.state;
    return (
      <div id="page-container">
        <div
          id="support-container"
        >
          <div className="message-list-wrapper-container">
            {this.setMessages()}
            <div style={{ float:"left", clear: "both",height:15 }}
              ref={(el) => { this.messagesEnd = el; }}>
            </div>
          </div>
          {showInput&&<div component="div" className="message-input-container message-input">
              <MessageInput
                addMessage={this.addMessage}               
              />
          </div>}
        </div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
    profile: state.profile,
    brand: state.brand,
  };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Support));

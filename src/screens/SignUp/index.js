import React, { Component } from "react";
import { animateScroll } from "react-scroll";
import MessageItem from "../../Components/MessageItem";
import MessageInput from "../../Components/MessageInput";
import Firebase from "../../firebasehelper";
import ErrorModal from "../../Components/ErrorModal";
import { connect } from "react-redux";
import {
  saveUID,
  saveProfile,
  saveProperties,
} from "../../redux/actions";
import {
  getBotMessageGroup,
  getBetweenTimeoutValue,
  getTimeoutValue,
  getInputTimeoutValue,
  addBotMessageGroup,
  addBotMessages,
} from "../../Utils/botMessages";
import {
  getUserMessage,
  addUserMessage,
  addUserMessages,
} from "../../Utils/userMessages";
import {
  registration_botMessages,
  registration_userMessages,
} from "../../Constants/messages";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.messages = [
    ];
    this.state = {
      showInput: false,
      messages: [],
      name: "",
      isIphoneX: true,
      brand: "ecosystem",
      modalIsOpen: false,
      uid: props.uid,
      profile: props.profile,
      showTravel: false,
      super_admins: [],
      chatbot: {},
    };
  }

  componentDidMount() {
    const { logo } = this.props;
    this.setState({ brand: logo });
    addBotMessages(registration_botMessages);
    addUserMessages(registration_userMessages);
    this.getBotMessageGroup();
  }
  getBotMessageGroup = () => {
    this.setState({
      showInput: false,
    });
    let messageGroup = getBotMessageGroup();
    if (messageGroup) {
      messageGroup.forEach((message, index) => {
        const timeoutValue =
          getTimeoutValue() + (index ? index * getBetweenTimeoutValue() : 0);
        setTimeout(() => {
          this.setMessageInState(message);
          this.scrollToBottom();
          if (index === messageGroup.length - 1) this.toggleUserInput(true);
        }, timeoutValue);
      });
    }
  };

  scrollToBottom(delay = 0) {
    if (delay) {
      setTimeout(() => {
        animateScroll.scrollToBottom({
          duration: 500,
          smooth: "easeInOutQuad",
        });
      }, delay);
    } else {
      animateScroll.scrollToBottom({
        duration: 500,
        smooth: "easeInOutQuad",
      });
    }
  }

  setMessages() {
    const { logo, icon } = this.props;
    const { messages } = this.state;
    return messages.map((message, i) => {
      const firstChild = i !== 0 && messages[i - 1].type !== message.type;
      return (
        <MessageItem
          message={message}
          firstChild={firstChild}
          key={i}
          timeoutValue={getTimeoutValue(message.message)}
          logo={logo}
          icon={icon}
        />
      );
    });
  }

  toggleUserInput(timeout) {
    if (!this.state.showInput) this.scrollToBottom(500);
    const { userMessage } = this.state;
    const showInput = !this.state.showInput;
    if (timeout) {
      setTimeout(() => {
        if (!this.state.showInput) this.scrollToBottom(500);
        this.setState({
          showInput,
          userMessage: showInput ? getUserMessage() : userMessage,
        });
      }, getInputTimeoutValue());
    } else {
      this.setState({
        showInput,
        userMessage: showInput ? getUserMessage() : userMessage,
      });
    }
  }

  setMessageInState(message) {
    const messages = this.state.messages.slice();
    messages.push(message);
    this.setState({ messages });
  }
  addMessage = (message) => {
    if (message.inputType === "input" && message.key === "firstname") {
      setTimeout(() => {
        this.scrollToBottom();
        let firstname = message.message;
        this.setMessageInState({
          type: "bot",
          message: `Great, thanks ${firstname}. `,
        });
        this.getBotMessageGroup();
      }, getBetweenTimeoutValue());
    }else if (message.key === "wrong_sms") {
      addUserMessage({
        type: "user",
        inputType: "input",
        placeholder: "6-digits",
        key: "sms",
      });
      addUserMessage({
        type: "user",
        inputType: "input",
        placeholder: "",
        key: "phone",
      });
      addBotMessageGroup([
        {
          type: "bot",
          message: "Please confirm the sms code received.",
        },
      ]);
      addBotMessageGroup([
        {
          type: "bot",
          message: `SMS Code is not matching. Try again.`,
        },
      ]);
      this.getBotMessageGroup();
    } else if (message.key === "no_received") {
      addUserMessage({
        type: "user",
        inputType: "input",
        placeholder: "6-digits",
        key: "sms",
      });
      addUserMessage({
        type: "user",
        inputType: "input",
        placeholder: "",
        key: "phone",
      });
      addBotMessageGroup([
        {
          type: "bot",
          message: "Please confirm the sms code received.",
        },
      ]);
      addBotMessageGroup([
        {
          type: "bot",
          message: `Try again.`,
        },
      ]);
      this.getBotMessageGroup();
    } else if (message.key === "sms") {
      let phone = message.phone;
      let profile = message.profile;
      this.setState({ profile, phone });
      let new_profile = {
        dob: profile.dob,
        firstname: profile.firstname,
        phonenumber: profile.phonenumber,
      };
      console.log("newprofile",new_profile);
      this.signup(new_profile);
    } else {
      if (!message.finish) {
        setTimeout(() => {
          this.getBotMessageGroup();
        }, 1000);
      }
    }

    this.setMessageInState(message);
    this.toggleUserInput();
  };
  signup = (profile) => {
    profile.renter_owner = "Renter";
    Firebase.addEcosystemUser(profile).then(res=>{
      let eco_id = res.id;
      Firebase.addRenterByEcoId(eco_id,profile.phonenumber).then(res=>{
        let renter_id = res.id;
        profile.eco_id = eco_id;
        profile.renter_id = renter_id;
        this.start(profile);
      })
    });
  };
  start = async (profile) => {
    this.unsubscribeProperties = Firebase.firestore()
      .collection("Rental Community")
      .doc("data")
      .collection("user")
      .doc(profile.renter_id)
      .collection("property")
      .onSnapshot((snapshot) => {
        let properties = [];
        if (snapshot.size) {
          snapshot.forEach((doc) => {
            let property = doc.data();
            property.id = doc.id;
            properties.push(property);
          });
          console.log("properties in this user's wishlist", properties);
        }
        this.props.dispatch(saveProperties(properties));
        localStorage.setItem("rentkey_users", JSON.stringify(properties));
      });
    // let brand_Data = await Firebase.getBrandDataByName(brand);
    // console.log("brand_Data", brand_Data);
    // this.props.dispatch(saveBrand(brand_Data));
    // let result = await Firebase.getUserProfile(phonenumber, brand);
    // let profile = result.data();
    console.log("profile", profile);
    // localStorage.setItem("rentkey_uid", result.id);
    // localStorage.setItem("rentkey_profile", JSON.stringify(profile));
    // localStorage.setItem("rentkey_brand_data", JSON.stringify(brand_Data));
    this.props.dispatch(saveProfile(profile));
    this.props.dispatch(saveUID(profile.renter_id));
    this.props.history.push("/explore");
  };
  wantRenter = (profile)=>{
    console.log("this wants to be renter",profile);
    if(!profile.renter_owner){
      Firebase.updateEcoUser(profile.eco_id,{renter_owner:"Renter"});
      Firebase.addRenterByEcoId(profile.eco_id,profile.phonenumber).then(res=>{
        let renter_id = res.id;
        profile.renter_id = renter_id;
        this.start(profile);
      })
    }else if(profile.renter_owner === "Renter"){
      Firebase.getRenterbyPhonenumber(profile.phonenumber).then(res=>{
        profile.renter_id = res.renter_id;
        this.start(profile);
      })
    }
  }
  goBack = () => {
    this.restart();
    this.getBotMessageGroup();
  };
  closeModal = () => {
    this.setState({ modalIsOpen: false });
    window.location.reload();
  };
  render() {
    const { logo, tier_data,chatbot } = this.props;
    const {
      showInput,
      userMessage,
      isIphoneX,
      modalIsOpen,
      caption,
      content,
      is_member,
      profile,
      brand,
      uid
    } = this.state;
    return (
      <div className="app-wrapper">
      <div className="message-list-wrapper">
        {this.setMessages()}
        <div component="div" className="message-input-container">
          {showInput ? (
            <MessageInput
              message={userMessage}
              addMessage={this.addMessage}
              wantRenter={this.wantRenter}
              isIphoneX={isIphoneX}
              logo={logo}
              profile={profile}
              uid={uid}
            />
          ) : null}
        </div>
        <ErrorModal
          caption={caption}
          content={content}
          closeModal={this.closeModal}
          modalIsOpen={modalIsOpen}
        />
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
    users: state.users,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

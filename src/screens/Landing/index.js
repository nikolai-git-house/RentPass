import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { animateScroll } from "react-scroll";
import "./index.css";
import "../../Styles/Common.css";
import MessageItem from "../../Components/MessageItem";
import { removeAll, saveProfile } from "../../redux/actions";
import {
  getTimeoutValue,
  getBetweenTimeoutValue,
} from "../../Utils/botMessages";
import Firebase from "../../firebasehelper";

const happyIcon = require("../../images/landing/happy-colored.png");
const charityIcon = require("../../images/landing/charity.png");
const shopIcon = require("../../images/landing/shop-colored.png");
const tokenIcon = require("../../images/landing/token-colored.png");
const upgradeIcon = require("../../images/landing/upgrade-colored.png");

const staticMessages = [
  {
    type: "bot",
    message:
      "Earn tokens for being a community hero, responding to polls, giving your feedback to forum posts and inviting friends to join you.",
    icon: happyIcon,
    logo: happyIcon,
    isLanding: true,
    color: "#ff0000",
  },
  {
    type: "bot",
    message:
      "Spend your tokens on shopping through EcoPay with 60 premier retailers, redeeming on average 10 tokens for every £1 spent.",
    icon: tokenIcon,
    logo: tokenIcon,
    isLanding: true,
    color: "#ffcfff",
  },
  {
    type: "bot",
    message:
      "Spend your tokens in the EcoStore marketplace to save money and time, with Eco products and subscriptions helping you live your best life.",
    icon: shopIcon,
    logo: shopIcon,
    isLanding: true,
    color: "#ffebad",
  },
  {
    type: "bot",
    message:
      "Your ecosystem makes it easier for you to live your best life through community solidarity, saving time and saving money.",
    icon: upgradeIcon,
    logo: upgradeIcon,
    isLanding: true,
    color: "#c4effc",
  },
];

class Landing extends React.Component {
  state = {
    messages: [],
    isFinished: false,
  };

  componentDidMount() {
    const { uid, brand } = this.props;
    if (!uid) {
      this.props.history.push("/");
      return;
    }
    console.log("props", this.props);
    if (brand) {
      console.log("landing - brand", brand);
      let messages = [
        {
          type: "bot",
          message: `Welcome to the ecosystem community.`,
          logo: brand.logo,
          icon: brand.icon,
          isLanding: true,
        },
      ];
      messages = messages.concat(staticMessages);
      messages.forEach((message, index) => {
        const timeoutValue =
          getTimeoutValue() + getBetweenTimeoutValue() * index;
        setTimeout(() => {
          this.setState({ messages: [...this.state.messages, message] });
          if (index === messages.length - 1) {
            setTimeout(() => {
              this.setState({ isFinished: true }, () => {
                this.scrollToBottom();
              });
            }, getBetweenTimeoutValue());
          }
          this.scrollToBottom();
        }, timeoutValue);
      });
    }
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
    console.log(messages)
    return messages.map((message, i) => {
      return (
        <MessageItem
          message={message}
          key={i}
          logo={message.logo}
          icon={message.icon}
          isLanding={message.isLanding}
          color={message.color}
          timeoutValue={getTimeoutValue()}
        />
      );
    });
  }

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

  onClickGetStarted = async () => {
    const { brand, uid, dispatch,profile } = this.props;
    profile.tokens = 1000;
    await Firebase.updateUserData("Rental Community", uid, {
      tokens: 1000,
    });
    await Firebase.saveTokenHistory("Rental Community", uid, {
      created: new Date(),
      amount: -1000,
      type: "started",
    });
    localStorage.setItem("profile", JSON.stringify(profile));
    dispatch(saveProfile(profile));
    this.props.history.push("/explore");
  };

  render() {
    const { isFinished } = this.state;

    return (
      <div id="page-container">
        <div id="landing-container">{this.setMessages()}</div>
        {isFinished && (
          <div className="row_view landing-control landing-page">
            <button className="btn" onClick={this.onClickGetStarted}>
              <p>Get Started</p>
            </button>
          </div>
        )}
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
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Landing)
);

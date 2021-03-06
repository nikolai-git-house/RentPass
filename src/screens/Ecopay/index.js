import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { animateScroll } from "react-scroll";
import qs from "qs";
import "./index.css";
import "../../Styles/Common.css";
import MessageItem from "../../Components/MessageItem";
import MessageInput from "../../Components/MessageInput";
import TokenGuide from "../../Components/TokenGuide";
import { removeAll, saveProfile } from "../../redux/actions";
import {
  getTimeoutValue,
  getBetweenTimeoutValue,
  getInputTimeoutValue,
} from "../../Utils/botMessages";
import { TerritoryOptions, CurrencyOptions } from "../../Utils/Constants";
import Firebase from "../../firebasehelper";
import { braintreeSendWegift } from "../../functions/BraintreeHelper";
import Purchasing from "../../images/ecopay/purchasing.gif";

class Ecopay extends React.Component {
  botMessages = [
    [
      {
        type: "bot",
        message: "Where are you shopping?",
      },
    ],
  ];

  userMessages = [];

  state = {
    messages: [],
    retailers: [],
    selectedRetailer: {},
    showInput: false,
    billPrice: 0,
    loading: false,
  };

  componentDidMount() {
    const { uid, brand } = this.props;
    if (!uid) {
      this.props.history.push("/");
      return;
    }

    const brandTerritory = "UK";
    Firebase.getAllRetailersOnce((res) => {
      Firebase.getAllDeactiveRetailersOnce((deactiveRes) => {
        let deactive = [];
        if (deactiveRes) deactive = deactiveRes;

        const retailers = (res || []).filter((item) => {
          const territory = item.territory || TerritoryOptions[0];
          return (
            brandTerritory === territory &&
            item.ecopayRetailer &&
            !deactive[item.uid]
          );
        });
        retailers.sort((a, b) => {
          if (a.retailerName > b.retailerName) {
            return 1;
          } else if (a.retailerName < b.retailerName) {
            return -1;
          }

          return 0;
        });

        this.setState({ retailers });
        const { retailerId } = qs.parse(this.props.location.search.slice(1));
        if (retailerId) {
          const retailer = retailers.find((item) => item.uid === retailerId);
          if (retailer) {
            const territory = "UK";
            this.setState({ selectedRetailer: retailer });
            this.setState({
              messages: [
                {
                  type: "bot",
                  message: "Where are you shopping?",
                },
                {
                  type: "user",
                  message: retailer,
                  inputType: "selectbrand",
                  isNext: true,
                },
              ],
            });

            this.botMessages = [];
            this.addBotMessageGroup([
              {
                type: "bot",
                message: "How much is your bill?",
              },
            ]);
            this.addUserMessage({
              type: "user",
              inputType: "input",
              key: "bill-price",
              placeholder: `${CurrencyOptions[territory]}00.00`,
              maxLength: 7,
            });
            this.processBotMessageGroup();
            return;
          }
        }
        this.addUserMessage({
          type: "user",
          inputType: "selectBrand",
          key: "brand",
          retailers,
        });
        this.processBotMessageGroup();
      });
    });

    Firebase.getAllPaymentMethods("Rental Community", uid, (methods) => {
      this.setState({ paymentMethods: methods });
    });
  }

  profileTokenUpdate = async (delta) => {
    this.setState({ loading: true }, () => this.scrollToBottom(500));
    let message = "";
    let data = null;
    try {
      const { uid, profile, brand, dispatch } = this.props;
      const { paymentMethods } = this.state;

      const proValue =
        1 -
        (this.state.selectedRetailer.redeemed
          ? this.state.selectedRetailer.redeemed.fullTokens / 100
          : 0.1);
      const price = (this.state.billPrice * proValue).toFixed(2);

      const result = await braintreeSendWegift(
        paymentMethods[0].token,
        price,
        this.state.selectedRetailer.retailerID,
        uid
      );
      if (result.status === "SUCCESS") {
        await Firebase.updateUserData("Rental Community", uid, {
          tokenSpent: (profile.tokenSpent || 0) + delta,
        });
        await Firebase.saveTokenHistory("Rental Community", uid, {
          created: new Date(),
          amount: delta,
          type: "ecopay",
        });
        dispatch(
          saveProfile({
            ...profile,
            tokenSpent: (profile.tokenSpent || 0) + delta,
          })
        );
        localStorage.setItem(
          "profile",
          JSON.stringify({
            ...profile,
            tokenSpent: (profile.tokenSpent || 0) + delta,
          })
        );
      } else {
        message = result.error || result.error_details;
      }
      data = result;
    } catch (e) {
      message = e.message;
    }
    this.setState({ loading: false });
    return { error: message, data: data };
  };

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

  toggleUserInput(timeout) {
    if (!this.state.showInput) this.scrollToBottom(500);
    const { userMessage } = this.state;
    const showInput = !this.state.showInput;
    if (timeout) {
      setTimeout(() => {
        if (!this.state.showInput) this.scrollToBottom(500);
        this.setState({
          showInput,
          userMessage: showInput ? this.getUserMessage() : userMessage,
        });
      }, getInputTimeoutValue());
    } else {
      this.setState({
        showInput,
        userMessage: showInput ? this.getUserMessage() : userMessage,
      });
    }
  }

  setMessageInState(message) {
    const messages = this.state.messages.slice();
    messages.push(message);
    this.setState({ messages });
  }

  processBotMessageGroup = () => {
    this.setState({
      showInput: false,
    });
    let messageGroup = this.getBotMessageGroup();

    messageGroup.forEach((message, index) => {
      const timeoutValue =
        getTimeoutValue() + (index ? index * getBetweenTimeoutValue() : 0);
      setTimeout(() => {
        this.setMessageInState(message);
        this.scrollToBottom();
        if (index === messageGroup.length - 1) this.toggleUserInput(true);
      }, timeoutValue);
    });
  };

  addMessage = async (message) => {
    const { brand } = this.props;
    const territory = "UK";
    if (message.inputType === "selectbrand") {
      const retailer = message.message;
      console.log("retailer",retailer);
      this.setState({ selectedRetailer: retailer });
      this.addBotMessageGroup([
        {
          type: "bot",
          message: "How much is your bill?",
        },
      ]);
      this.addUserMessage({
        type: "user",
        inputType: "input",
        key: "bill-price",
        placeholder: `${CurrencyOptions[territory]}00.00`,
        maxLength: 7,
      });
      this.processBotMessageGroup();
    } else if (message.inputType === "input" && message.key === "bill-price") {
      const value = parseFloat(message.message.replace(/[^\d.-]/g, ""));
      this.setState({ billPrice: value });
      const proValue =
        1 -
        (this.state.selectedRetailer.redeemed
          ? this.state.selectedRetailer.redeemed.fullTokens / 100
          : 0.1);
      this.addBotMessageGroup([
        {
          type: "bot",
          message: `You spend ${parseInt(
            (value - (value * proValue).toFixed(2)).toFixed(2) * 100,
            10
          )} of your tokens, which is equivalent to ${
            CurrencyOptions[territory]
          }${(value - (value * proValue).toFixed(2)).toFixed(2)}`,
        },
        {
          type: "bot",
          message: `That costs you ${CurrencyOptions[territory]}${(
            value * proValue
          ).toFixed(2)}`,
        },
        // Added it temporary for Notting Hill Carnival
        // {
        //   type: "bot",
        //   message: `EcoPay launches next week. You can spend your tokens soon with over 50 top retailers.`,
        // },
      ]);

      // this.addUserMessage({
      //   type: "user",
      //   inputType: "static",
      //   message: `Explore my Ecosystem`,
      //   subType: "shopping_completed",
      // });

      this.addUserMessage({
        type: "user",
        inputType: "toggleButton",
        options: [
          { text: "Decline", value: "No", backgroundColor: "#ff9caa" },
          {
            text: "Pay",
            value: "I accept the payment",
            backgroundColor: "#DCF8C3",
          },
        ],
        directionRow: true,
        key: "bill-pay-button",
      });
      this.processBotMessageGroup();
    } else if (
      message.inputType === "toggleInput" &&
      message.key === "bill-pay-button"
    ) {
      if (message.message === "I accept the payment") {
        const proValue =
          1 -
          (this.state.selectedRetailer.redeemed
            ? this.state.selectedRetailer.redeemed.fullTokens / 100
            : 0.1);
        const delta = parseInt(
          (
            this.state.billPrice - (this.state.billPrice * proValue).toFixed(2)
          ).toFixed(2) * 100,
          10
        );

        const { profile } = this.props;
        const currentBalance =
          (profile.tokens || 0) - (profile.tokenSpent || 0);
        const { paymentMethods } = this.state;
        if (paymentMethods.length === 0 || currentBalance < delta) {
          this.addBotMessageGroup([
            {
              type: "bot",
              message:
                paymentMethods.length === 0
                  ? `You don't have any registered payment methods`
                  : `You need to earn ${
                      delta - currentBalance
                    } tokens to complete this payment. You can do this by answering the latest poll or helping another member.`,
            },
          ]);
          this.addUserMessage({
            type: "user",
            inputType: "static",
            style: { backgroundColor: "#FEFD9D", color: "#152439" },
            message: paymentMethods.length === 0 ? `Add a saved card` : `OK`,
            subType:
              paymentMethods.length === 0
                ? "add_saved_card"
                : "shopping_completed",
          });
          this.processBotMessageGroup();
        } else {
          this.setState({ showInput: false });
          this.profileTokenUpdate(delta).then((res) => {
            if (res.error === "" && res.data) {
              this.addBotMessageGroup([
                {
                  type: "bot",
                  message: `Paid ${CurrencyOptions[territory]}${(
                    this.state.billPrice * proValue
                  ).toFixed(2)} on card ${paymentMethods[0].details.lastFour}`,
                },
                {
                  type: "bot",
                  key: "barcode",
                  message: res.data.order_id,
                  inputType: "input",
                },
              ]);
            } else {
              this.addBotMessageGroup([
                {
                  type: "bot",
                  message: `Error occured doing payment: ${res.error} on card ${paymentMethods[0].details.lastFour}`,
                },
              ]);
            }

            this.addUserMessage({
              type: "user",
              inputType: "static",
              message: `Shopping Completed.`,
              style: { backgroundColor: "#FEFD9D", color: "#152439" },
              subType: "shopping_completed",
            });

            this.processBotMessageGroup();
          });
        }
      } else {
        window.location.reload();
      }
    } else if (
      message.inputType === "static" &&
      message.subType === "shopping_completed"
    ) {
      this.props.history.push("/explore");
    } else if (
      message.inputType === "static" &&
      message.subType === "add_saved_card"
    ) {
      this.props.history.push("/wallets?section=cards");
    }
    this.setMessageInState(message);
    this.toggleUserInput();
  };

  signOut = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("profile");
    localStorage.removeItem("brand");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };

  setMessages() {
    const { messages } = this.state;
    const { brand } = this.props;
    return messages.map((message, i) => {
      return (
        <MessageItem
          message={message}
          key={i}
          logo={brand && brand.logo}
          icon={brand && brand.icon}
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

  onClickGetStarted = () => {
    this.props.history.push("/explore");
  };

  render() {
    const { showInput, userMessage, loading } = this.state;
    const { profile, brand } = this.props;
    return (
      <div id="ecopay-container">
        <TokenGuide territory="UK" />
        {this.setMessages()}
        {loading && (
          <img src={Purchasing} alt="purchasing" className="purchasing" />
        )}
        <div component="div" className="message-input-container">
          {showInput ? (
            <MessageInput
              message={userMessage}
              addMessage={this.addMessage}
              isIphoneX
              // logo={logo}
              onRestart={this.goBack}
              profile={profile}
              territory="UK"
              // uid={uid}
            />
          ) : null}
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Ecopay));

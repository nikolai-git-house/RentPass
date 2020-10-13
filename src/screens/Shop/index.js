import React from "react";
import { connect } from "react-redux";
import "./index.css";
import Firebase from "../../firebasehelper";
import { removeAll } from "../../redux/actions";
import Package from "../../Components/Package";
import { TerritoryOptions } from "../../Utils/Constants";
import { braintreeCheckout } from "../../functions/BraintreeHelper";
import YesNoModal from "../../Components/YesNoModal";
import SmartPhoneIcon from "../../assets/images/subscriptions/smartphone.png";

class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      packages: [],
      loading: true,
      brand_logo: "",
      paymentMethods: [],
      subscriptions: [],
      confirmModal: {
        visible: false,
        content: "",
        title: "",
        yes: "",
        no: "",
      },
      selectedItem: null,
    };
  }
  componentDidMount() {
    const { uid, brand } = this.props;
    if (!uid) {
      this.props.history.push("/");
      return;
    }

    if (brand.name) {
      Firebase.getAllPaymentMethods(brand.name, uid, (methods) => {
        this.setState({ paymentMethods: methods });
      });

      Firebase.getAllSubscriptions(brand.name, uid, (subscriptions) =>
        this.setState({ subscriptions })
      );
    }

    const { inactiveBoltPackages } = brand;
    Firebase.getBoltPackages((res) => {
      let brand_logo = brand.logo;
      let boltPackages = Object.keys(res)
        .filter(
          (packageId) =>
            !(inactiveBoltPackages || []).find((item) => item === packageId)
        )
        .reduce((prev, id) => {
          const obj = res[id];
          prev[obj.order] = { id, ...obj };
          return prev;
        }, []);
      console.log("ecosystem packages", boltPackages);
      let brandPackages = Object.keys(brand.packages || {}).reduce(
        (prev, id) => {
          const obj = (brand.packages || {})[id];
          prev[obj.order] = { id, ...obj };
          return prev;
        },
        []
      );
      console.log("brand_packages", brandPackages);
      let packages = boltPackages.concat(brandPackages);
      console.log("packages", packages);
      this.setState({ loading: false, packages, brand_logo });
    });
  }

  onSubscribe = (item) => async () => {
    const { paymentMethods } = this.state;
    console.log("onSubscribe");
    if (paymentMethods.length === 0) {
      this.setState({
        selectedItem: null,
        confirmModal: {
          visible: true,
          content: `We need to register a safe linked`,
          title: "No Payment Methods",
          yes: "Save a card",
        },
      });
      return;
    }

    this.setState({
      selectedItem: item,
      confirmModal: {
        visible: true,
        content: `We are going to charge your card ending ${paymentMethods[0].details.lastFour} £${item.price} once. Your purchase will then be available to view via your wallet.`,
        title: "Please cofirm",
        yes: "Confirm",
        no: "Decline",
      },
    });
  };

  confirmPayment = async () => {
    this.setState({ confirmModal: false });

    const { brand, uid } = this.props;
    const { selectedItem: item, paymentMethods } = this.state;
    if (item === null) {
      this.props.history.push("/wallets?section=cards");
    } else {
      if (item.type === 0) {
        // If item is subscription
      } else {
        // If item is one-off payment
        const data = await braintreeCheckout(
          paymentMethods[0].token,
          item.price
        );
        if (data.data && data.data.success) {
          await Firebase.addSubscription(
            brand.name,
            uid,
            item.id,
            "active",
            item.type,
            data.data.transaction.creditCard.last4,
            item.price
          );
        } else {
          alert("sorry, there is problem on the payment");
        }
      }
    }
  };

  cancelPayment = () => {
    this.setState({ confirmModal: { visible: false, content: "", title: "" } });
  };

  showPackages = () => {
    let { packages, subscriptions } = this.state;
    const { profile, brand } = this.props;
    const territory = (brand && brand.territory) || TerritoryOptions[0];
    return packages.map((item, index) => {
      const { visibility } = item;
      if (visibility)
        return (
          <Package
            id={index}
            data={item}
            profile={profile}
            territory={item.isBrand ? territory : TerritoryOptions[0]}
            purchased={subscriptions.find((obj) => obj.product_id === item.id)}
            onSubscribe={this.onSubscribe(item)}
          />
        );
    });
  };
  signOut = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("profile");
    localStorage.removeItem("brand");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };
  render() {
    const { loading } = this.state;
    return (
       
          <div className="div_content h-auto">
            {loading && <i class="fa fa-4x fa-sync fa-spin text-muted" />}
            {!loading && this.showPackages()}
            <YesNoModal
              visible={this.state.confirmModal.visible}
              caption={this.state.confirmModal.title}
              content={this.state.confirmModal.content}
              yes={this.state.confirmModal.yes}
              no={this.state.confirmModal.no}
              icon={SmartPhoneIcon}
              onYes={this.confirmPayment}
              onNo={this.cancelPayment}
            />
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
export default connect(mapStateToProps, mapDispatchToProps)(Shop);

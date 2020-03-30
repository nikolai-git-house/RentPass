import React from "react";
import { connect } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import Housemate from "./Housemate";
import AddHousemate from "./AddHousemate";
import TenantStatus from "../../Components/TenantStatus";
import TenantThumbnail from "../../Components/TenantThumbnail";
import { saveHousemates } from "../../redux/actions";
import "./index.css";
import { sendInvitation, clearZero } from "../../functions/Auth";
import Firebase from "../../firebasehelper";

class Housemates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      property_data: {},
      housemates: [],
      addModal: false,
      statusModal: false,
      tenant: {}
    };
  }
  async componentDidMount() {
    const { uid, profile, brand, housemates } = this.props;
    console.log("uid in Housemates", uid);
    console.log(profile)
    if (!uid) this.props.history.push("/");
    else {
      const { property_id, phonenumber } = profile;
      this.setState({ housemates });
      //let housemates = await Firebase.getPropertyMembersById(groupId, brand.name);
      //this.setState({ housemates, loading: false });
      let _this = this;
      if (!property_id) return
      this.unsubscribeHousemates = Firebase.firestore()
        .collection(brand.name)
        .doc("data")
        .collection("user")
        .where("property_id", "==", property_id)
        .onSnapshot(querySnapshot => {
          var tenants = [];
          querySnapshot.forEach(function(doc) {
            if (phonenumber !== doc.data().phonenumber)
              tenants.push(doc.data());
          });
          console.log("current housemates:", tenants);
          _this.setState({ housemates: tenants });
          this.props.dispatch(saveHousemates(tenants));
        });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { profile, housemates } = nextProps;
    console.log("housemates from nextProps", housemates);
    this.setState({ profile, housemates });
  }
  getRentalText = rental_type => {
    if (rental_type) return "Owner";
    else return "Renter";
  };
  showHousemates = () => {
    const { housemates } = this.state;
    if (housemates.length > 0) {
      return housemates.map((item, index) => {
        return <Housemate profile={item} key={index} />;
      });
    }
  };
  showTenants = () => {
    const { housemates } = this.state;
    console.log("housemates", housemates);
    const { brand } = this.props;
    console.log("brand", brand);
    return housemates.map((item, index) => {
      if (!item.status) {
        Firebase.updateUserById(brand.name, item.uid, {
          status: {
            kyc: "none",
            credit_rating: "none",
            right_to_rent: "none",
            employer: "none",
            accountant: "none",
            affordability: "none",
            rental_history: "none",
            rent_with_pets: "none",
            rent_without_a_deposit: "none",
            rent_a_serviced_home: "none"
          }
        });
      }
      return (
        <TenantThumbnail
          tenant={item}
          brand={brand}
          key={index}
          onClick={() => this.showStatusRenter(item)}
        />
      );
    });
  };
  showStatusRenter = tenant => {
    this.setState({ tenant });
    this.toggleModal("status");
  };
  addHousemate = (username, phonenumber) => {
    console.log("username,phonenumber", username, phonenumber);
    this.inviteTenant(username, phonenumber);
  };
  inviteTenant = async (username, phonenumber) => {
    const { brand, profile } = this.props;
    let brand_name = brand.name;
    const { property_id, property_name } = profile;
    console.log("phone", phonenumber);
    let phone = "+44" + clearZero(phonenumber);
    Firebase.checkPhonenumberInvited(phone).then(async res => {
      if (res) {
        alert(
          "This user already has a property invite. They can't have more than one at any one time."
        );
      } else {
        sendInvitation(phone, username, property_name, brand_name);
        let add_result = await Firebase.addTenant(
          property_id,
          property_name,
          phone,
          username,
          brand_name
        );
        let uid = add_result.id;
        Firebase.createInvitation(
          uid,
          phone,
          brand_name,
          property_id,
          property_name,
          username
        );
      }
    });
  };
  toggleModal = type => {
    const { addModal, statusModal } = this.state;
    if (type === "add") this.setState({ addModal: !addModal });
    else if (type === "status") this.setState({ statusModal: !statusModal });
  };
  render() {
    const { addModal, statusModal, tenant } = this.state;
    return (
      <div id="housemates-container">
        <AddHousemate
          addHousemate={this.addHousemate}
          showModal={addModal}
          toggleModal={() => this.toggleModal("add")}
        />
        <TenantStatus
          tenant={tenant}
          showModal={statusModal}
          toggleModal={() => this.toggleModal("status")}
        />
        {this.showTenants()}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => this.toggleModal("add")}
          style={{ margin: 20 }}
        >
          Add Housemates
        </button>
      </div>
      // </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
    profile: state.profile,
    renters: state.renters,
    brand: state.brand,
    housemates: state.housemates
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Housemates);

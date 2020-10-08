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
    const { uid} = this.props;
    console.log("uid in Housemates", uid);
    if (!uid) this.props.history.push("/");
    else {
      let _this = this;
      this.unsubscribeHousemates = Firebase.firestore()
        .collection("Rental Community")
        .doc("data")
        .collection("user")
        .doc(uid)
        .collection("housemates")
        .onSnapshot(querySnapshot => {
          var housemates = [];
          querySnapshot.forEach(function(doc) {
              housemates.push(doc.data());
          });
          console.log("current housemates:", housemates);
          _this.setState({ housemates });
          this.props.dispatch(saveHousemates(housemates));
        });
    }
  }
  componentDidUpdate(prevProps,prevState) {
    const { housemates } = this.props;
    if(prevState.housemates!==housemates)
      this.setState({housemates });
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
  // showTenants = () => {
  //   const { housemates } = this.state;
  //   console.log("housemates", housemates);
  //   return housemates.map((item, index) => {
  //     if (!item.status) {
  //       Firebase.updateUserById(brand.name, item.uid, {
  //         status: {
  //           kyc: "none",
  //           credit_rating: "none",
  //           right_to_rent: "none",
  //           employer: "none",
  //           accountant: "none",
  //           affordability: "none",
  //           rental_history: "none",
  //           rent_with_pets: "none",
  //           rent_without_a_deposit: "none",
  //           rent_a_serviced_home: "none"
  //         }
  //       });
  //     }
  //     return (
  //       <TenantThumbnail
  //         tenant={item}
  //         key={index}
  //         onClick={() => this.showStatusRenter(item)}
  //       />
  //     );
  //   });
  // };
  showStatusRenter = tenant => {
    this.setState({ tenant });
    this.toggleModal("status");
  };
  addHousemate = (firstname, phonenumber,property) => {
    const {  profile } = this.props;
    let phone = "+44" + clearZero(phonenumber);
    console.log("phone",phone);
    console.log("firstname",firstname);
    console.log("property",property);
    // sendInvitation(phone, firstname, property_name, brand_name);
    // let add_result = await Firebase.addTenant(
    //   property_id,
    //   property_name,
    //   phone,
    //   username,
    //   brand_name
    // );
    // let uid = add_result.id;
    // Firebase.createInvitation(
    //   uid,
    //   phone,
    //   brand_name,
    //   property_id,
    //   property_name,
    //   username
    // );
      
  };
  toggleModal = type => {
    const { addModal, statusModal } = this.state;
    if (type === "add") this.setState({ addModal: !addModal });
    else if (type === "status") this.setState({ statusModal: !statusModal });
  };
  render() {
    const { addModal } = this.state;
    const {properties} = this.props;
    return (
      <div id="housemates-container">
        <AddHousemate
          addHousemate={this.addHousemate}
          showModal={addModal}
          properties={properties}
          toggleModal={() => this.toggleModal("add")}
        />
        {this.showHousemates()}
        {properties.length===0&&<button
          type="button"
          className="btn btn-success"
          onClick={() => this.props.history.push("/property")}
          style={{ margin: 20 }}
        >
          You have not added properties.<br/> 
          Add Property
        </button>}
        {properties.length!==0&&<button
          type="button"
          className="btn btn-secondary"
          onClick={() => this.toggleModal("add")}
          style={{ margin: 20 }}
        >
          Add Housemate
        </button>}
      </div>
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
    properties:state.properties,
    housemates: state.housemates
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Housemates);

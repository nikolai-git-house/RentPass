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
      housemates: [],
      addModal: false,
      statusModal: false,
      adding:false,
    };
  }
  async componentDidMount() {
    const { uid,properties} = this.props;
    if (!uid) this.props.history.push("/");
    else {
      let promises = properties.map(async property=>{
        let housemates = await Firebase.getHousemates(uid,property);
        return housemates;
      });
      Promise.all(promises).then(result=>{
        let housemates = result.reduce((housemates,current)=>housemates.concat(current));
        console.log("housemates",housemates);
        this.setState({housemates});
      })
    }
  }
  async componentDidUpdate(prevProps,prevState){
    const {properties,uid} = this.props;
    if(prevState.adding!==this.state.adding){
      let promises = properties.map(async property=>{
        let housemates = await Firebase.getHousemates(uid,property);
        return housemates;
      });
      Promise.all(promises).then(result=>{
        let housemates = result.reduce((housemates,current)=>housemates.concat(current));
        console.log("housemates",housemates);
        this.setState({housemates});
      })
    }
    
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
  addHousemate = async (firstname, phonenumber,property) => {
    const { uid, profile } = this.props;
    let phone = "+44" + clearZero(phonenumber);
    this.setState({adding:true});
    let property_id = property.value;
    let property_name = property.label;
    sendInvitation(phone, firstname,property_name);
    let renter = await Firebase.getRenterbyPhonenumber(phone);
    if(renter){
      //if invited man is already a renter
      await Firebase.addHousemate(uid,property_id,renter.renter_id,firstname);
      this.setState({adding:false});
    }
    else{
      Firebase.getEcoUserbyPhonenumber(phone).then(res=>{
        if(res){
          //if invited man is already a ecosystem user
          let eco_id = res.id;
          Firebase.addRenterByEcoId(eco_id,phone).then(async res=>{
            let renter_id = res.id;
            await Firebase.addHousemate(uid,property_id,renter_id,firstname);
            this.setState({adding:false});
          })
        }
        else{
          let profile={firstname,phonenumber:phone,renter_owner:"Renter"}
          //if not signed up from ecosystem
          Firebase.addEcosystemUser(profile).then(res=>{
            let eco_id = res.id;
            Firebase.addRenterByEcoId(eco_id,phone).then(async res=>{
              let renter_id = res.id;
              await Firebase.addHousemate(uid,property_id,renter_id,firstname);
              this.setState({adding:false});
            })
          })
        }
      });
    }
      
  };
  toggleModal = type => {
    const { addModal, statusModal } = this.state;
    if (type === "add") this.setState({ addModal: !addModal });
    else if (type === "status") this.setState({ statusModal: !statusModal });
  };
  render() {
    const { addModal,adding } = this.state;
    const {properties} = this.props;
    return (
      <div id="housemates-container">
        <AddHousemate
          addHousemate={this.addHousemate}
          showModal={addModal}
          properties={properties}
          toggleModal={() => this.toggleModal("add")}
        />
        {adding && (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <i className="fa fa-4x fa-sync fa-spin text-muted" />
              <p>Please wait, this takes a few seconds..</p>
            </div>
        )}
        {!adding&&this.showHousemates()}
        {!adding&&<button
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

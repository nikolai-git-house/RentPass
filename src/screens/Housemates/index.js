import React from "react";
import { connect } from "react-redux";
import Housemate from "./Housemate";
import AddHousemate from "./AddHousemate";
import DeactivationModal from "./DeactivationModal";
import TenantStatus from "../../Components/TenantStatus";
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
      deactivationsModal:false,
      adding:false,
      property_address:{line_1:""},
      property:{status:"active"},
      group_leader:""
    };
  }
  async componentDidMount() {
    const { uid} = this.props;
    if (!uid) this.props.history.push("/");
    else {
      const {property} = this.props.location.state;
      let {group_id,property_address} = property;
      let housemates = await Firebase.getHousemates(group_id);
      let group_data = await Firebase.getGroup(group_id);
      let group_leader = group_data.leader_id;
      this.setState({housemates,property,property_address,group_leader});
      console.log("property",property);
      console.log("housemates",housemates);
    }
  }
  async componentDidUpdate(prevProps,prevState){
    const {properties,uid} = this.props;
    if(prevState.adding!==this.state.adding){
      const {property} = this.props.location.state;
      // let property_id = property.id;
      // let myproperty = properties.filter(property=>property.id===property_id)
      // let {housemates} = myproperty[0];
      let {group_id,property_address} = property;
      let housemates = await Firebase.getHousemates(group_id);
      let group_data = await Firebase.getGroup(group_id);
      let group_leader = group_data.leader_id;
      console.log("property",property);
      console.log("housemates",housemates);
      this.setState({housemates,property,property_address,group_leader});
    }
  }
  getRentalText = rental_type => {
    if (rental_type) return "Owner";
    else return "Renter";
  };
  showProfile = (housemate)=>{
      this.setState({housemate});
      this.toggleModal("status");
  }
  showHousemates = () => {
    const { housemates,property } = this.state;
    const { uid } = this.props;
    if (housemates.length > 0) {
      return housemates.map((item, index) => {
        return <Housemate profile={item} active={property.status==="active"?true:false}
                self={item.renter_id===uid?true:false}  key={index} 
                showProfile={()=>this.showProfile(item)}/>;
      });
    }
  };
  isRenterActive(){
    const {groups,uid} = this.props;
    let activeGroupsLeadedByMe = groups.filter(group=>group.leader_id===uid&&group.status==="active");
    if(activeGroupsLeadedByMe.length>0)
      return true;
    else
      return false;
  }
  Deactivate = ()=>{
    const {property} = this.state;
    Firebase.updateGroupStatus(property.group_id,"pending");
    this.props.history.push("/property");
  }
  Activate = ()=>{
    const {property} = this.state;
    if(this.isRenterActive())
      alert("You can activate only one property at one moment.");
    else{
      Firebase.updateGroupStatus(property.group_id,"active");
      this.props.history.push("/property");
    }
  }
  addHousemate = async (firstname, phonenumber) => {
    const { profile } = this.props;
    const {property} = this.state;
    let phone = "+44" + clearZero(phonenumber);
    this.setState({adding:true});
    let response = sendInvitation(phone, profile.firstname,firstname);
    console.log("response", response);
    let renter = await Firebase.getRenterbyPhonenumber(phone);
    if(renter){
      //if invited man is already a renter
      await Firebase.addHousemate(property.group_id,renter.renter_id,firstname);
     this.setState({adding:false});
    }
    else{
      Firebase.getEcoUserbyPhonenumber(phone).then(res=>{
        if(res){
          //if invited man is already a ecosystem user
          let eco_id = res.id;
          Firebase.addRenterByEcoId(eco_id,phone).then(async res=>{
            let renter_id = res.id;
            await Firebase.addHousemate(property.group_id,renter_id,firstname);
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
              await Firebase.addHousemate(property.group_id,renter_id,firstname);
              this.setState({adding:false});
            })
          })
        }
      });
    }
      
  };
  toggleModal = type => {
    const { addModal, statusModal,deactivationsModal } = this.state;
    if (type === "add") this.setState({ addModal: !addModal });
    else if (type === "status") this.setState({ statusModal: !statusModal });
    else if (type === "deactivation") this.setState({ deactivationsModal: !deactivationsModal });
  };
  render() {
    const { addModal,adding,property,property_address,group_leader,statusModal,housemate,deactivationsModal } = this.state;
    const { uid} = this.props;
    return (
      <React.Fragment>
        <div id="address-header">
          <p className="big">{property.status==="active"?"Current Property":"Wishlisted Property"}</p>
          <p className="small">{property_address.line_1+", "+property_address.county}</p>
          {group_leader===uid&&<button
            className={`btn ${property.status==="active"?"btn-activated":"btn-deactivated"}`}
            onClick={property.status==="active"?()=>this.toggleModal("deactivation"):this.Activate}
          >
          {property.status==="active"?"Deactivate Property":"Activate Property"}
        </button>}
        </div>
        <div id="housemates-container">
          <AddHousemate
            addHousemate={this.addHousemate}
            showModal={addModal}
            // properties={properties}
            toggleModal={() => this.toggleModal("add")}
          />
          <TenantStatus
            showModal={statusModal}
            housemate={housemate}
            active={property.status==="active"?true:false}
            toggleModal={() => this.toggleModal("status")}
          />
          <DeactivationModal
            showModal={deactivationsModal}
            toggleModal={() => this.toggleModal("deactivation")}
            Deactivate={this.Deactivate}
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
          {!adding&&group_leader===uid&&<button
            type="button"
            className="btn btn-secondary"
            onClick={() => this.toggleModal("add")}
            style={{ margin: 20 }}
          >
            Add Housemate
          </button>}
        </div>
      </React.Fragment>
      
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
    groups:state.groups,
    housemates: state.housemates
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Housemates);

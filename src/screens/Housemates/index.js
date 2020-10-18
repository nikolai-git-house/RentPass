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
      property_address:{line_1:"",county:""},
      property:{status:"active"},
      group_leader:""
    };
  }
  async componentDidMount() {
    const { uid} = this.props;
    if (!uid) this.props.history.push("/");
    else {
      const {property} = this.props.location.state;
      let {group_id,brand,id} = property;
      if(brand){
        Firebase.getPropertyById(id,brand).then(res=>{
          const {property_address} = res;
          this.setState({property_address});
        })
      }
      else{
        const {property_address} = property;
        console.log("property_address",property_address);
        this.setState({property_address});
      }

      let housemates = await Firebase.getHousemates(group_id);
      let group_data = await Firebase.getGroup(group_id);
      let all_groups = await Firebase.getAllGroups();
      let group_leader = group_data.leader_id;
      this.setState({housemates,property,group_leader,all_groups,group_data});
    }
  }
  async componentDidUpdate(prevProps,prevState){
    if(prevState.adding!==this.state.adding){
      const {property} = this.props.location.state;
      let {group_id,brand,id} = property;
      if(brand){
        Firebase.getPropertyById(id,brand).then(res=>{
          const {property_address} = res;
          this.setState({property_address});
        })
      }
      else{
        const {property_address} = property;
        this.setState({property_address});
      }
      let housemates = await Firebase.getHousemates(group_id);
      let group_data = await Firebase.getGroup(group_id);
      let all_groups = await Firebase.getAllGroups();
      let group_leader = group_data.leader_id;
      this.setState({housemates,property,group_leader,all_groups,group_data});
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
    const {uid} = this.props;
    const {all_groups} = this.state;
    console.log("uid",uid);
    let activeGroupsContainMe = all_groups.filter(group=>group.tenants.filter(tenant=>tenant.renter_id===uid).length>0&&group.status==="active");
    if(activeGroupsContainMe.length>0)
      return true;
    else
      return false;
  }
  isAllRenterofGroup_Deactive(){
    const {group_data} = this.state;
    console.log("group_data",group_data);
    let tenants = group_data.tenants;
    let flag=true;
    tenants.map(tenant=>{
      if(this.isRenterActivebyRenter_ID(tenant.renter_id))
        flag=false;
    });
    return flag;
  }
  isPropertyActive(property_id){
    const {all_groups} = this.state;
    console.log("all_groups",all_groups);
    let activegroupwithpropertyid = all_groups.filter(group=>group.property_id===property_id&&group.status==="active");
    if(activegroupwithpropertyid.length>0)
      return true;
    else 
      return false;
  }
  isRenterActivebyRenter_ID(renter_id){
    console.log("renter_id",renter_id);
    const {all_groups} = this.state;
    let flag = false;
    all_groups.map(group=>{
      if(group.status==="active"){
        if(group.leader_id===renter_id){
          flag= true;
        }
        let tenants = group.tenants;
        let istenant = tenants.filter(tenant=>tenant.renter_id===renter_id);
        if(istenant.length>0){
          flag = true;
        }  
      }
    });
    return flag;
  }
  Deactivate = ()=>{
    const {property} = this.state;
    Firebase.updateGroupStatus(property.group_id,"pending");
    this.props.history.push("/property");
  }
  Activate = ()=>{
    const {property} = this.state;
    if(!this.isAllRenterofGroup_Deactive())
      alert("Sorry, a member of your group is active in one property.");
    else if(this.isPropertyActive(property.id))
      alert("Sorry, this property is already active by other group.");
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
      let renter_id = renter.renter_id;
      if(this.isRenterActivebyRenter_ID(renter_id)&&property.status==="active"){
        alert("Sorry,he is active in other property.");
        this.setState({adding:false});
      }
      else{
        await Firebase.addHousemate(property.group_id,renter.renter_id,firstname);
        this.setState({adding:false});
      }
      
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

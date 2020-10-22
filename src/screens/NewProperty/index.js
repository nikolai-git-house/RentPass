import React from "react";
import { connect } from "react-redux";
import Firebase from "../../firebasehelper";
import AddProperty from "../../Components/AddProperty";
import BugModal from "../../Components/BugModal";
import PropertyThumbnail from "../../Components/PropertyThumbnail";
import "./index.css";
const compare1 = (a,b)=>{
  if(a.brand)
    return 1;
  else if(b.brand)
    return -1;
}
const compare2 = (a,b)=>{
  if(a.status==="active")
    return -1;
  else
    return 1;
}
class NewProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addproperty_visible: false,
      bugModal_open:false,
      properties: [],
      adding:false
    };
  }
  async componentDidMount() {
    const { uid, profile,properties,groups } = this.props;
    if (!uid) this.props.history.push("/");
    this.setState({properties,groups});
  }
  componentDidUpdate(prevProps, prevState) {
    const { properties,groups } = this.props;
    if(prevState.properties!==properties){
      console.log("properties in didupdate",properties);
      this.setState({properties,groups});
    }
  }
  isRenterActive(){
    const {groups} = this.state;
    const {uid} = this.props;
    let flag = false;
    groups.map(group=>{
      if(group.status==="active"){
        if(group.leader_id===uid){
          flag= true;
        }
        let tenants = group.tenants;
        let istenant = tenants.filter(tenant=>tenant.renter_id===uid);
        if(istenant.length>0){
          flag = true;
        }  
      }
    });
    return flag;
  }
  addProperty = async property => {
    const { uid,profile } = this.props;
    let {groups} = this.state;
    this.setState({ adding: true });
    const {
      property_type,
      rental_type,
      price,
      bedrooms,
      address
    } = property;
    let new_property={bedrooms:parseInt(bedrooms),
      property_type,
      rental_type,
      month_price:parseInt(price),
      property_address:address,
    }
    
    if(this.isRenterActive()){
      let property_id = await Firebase.addProperty(new_property);
      let group_id = await Firebase.createGroup(uid,profile.firstname,property_id,"pending");
      console.log("group is created",group_id);
    }
    else{
      let property_id = await Firebase.addProperty(new_property);
      let group_id = await Firebase.createGroup(uid,profile.firstname,property_id,"active");
      console.log("group is created",group_id);
    }
    this.setState({adding:false});
  };
  toggleModal = (type) => {
    if(type==="add_property"){
      const { addproperty_visible } = this.state;
      this.setState({ addproperty_visible: !addproperty_visible });
    }
    else if(type==="bug"){
      const { bugModal_open } = this.state;
      this.setState({ bugModal_open: !bugModal_open });
    }
  };
  requestPropertyTest = () => {
    this.props.history.push("/referencing");
  };
  showHousemates = (property)=>{
    this.props.history.push("/housemates",{property});
  }
  render() {
    const { addproperty_visible,adding,properties,bugModal_open,bug_content } = this.state;
    const {uid} = this.props;
    return (
      <React.Fragment>
        <AddProperty
          addProperty={this.addProperty}
          showModal={addproperty_visible}
          toggleModal={() => this.toggleModal("add_property")}
        />
        <BugModal
          content={bug_content}
          closeModal={()=>this.toggleModal("bug")}
          modalIsOpen={bugModal_open}
        />
        {properties.length===0&&!adding&&
          <div id="comment-container">
              <img src={require("../../assets/media/property_status/home.png")} width="90" style={{marginBottom:20}}/>
              You are yet to add any properties
              <button
                type="button"
                className="btn btn-green"
                onClick={() => this.toggleModal("add_property")}
                style={{ margin: 20 }}
              >
                Add your current property
              </button>
          </div>
        }
        <div id="property-container">
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
          {!adding &&
            properties.length > 0 &&
            properties.sort(compare1).sort(compare2).map((item, index) => {
              return (
                <PropertyThumbnail
                  property={item}
                  uid={uid}
                  order={index}
                  key={index}
                  onRequestPropertyTest={() => this.requestPropertyTest(item)}
                  showHousemates={()=>this.showHousemates(item)}
                />
              );
            })}

          {!adding && properties.length > 0 &&(
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if(properties.filter(property=>!property.brand).length>3){
                  this.setState({bug_content:"You are limited to a maximum of three pending properties."});
                  this.toggleModal("bug");
                }
                else
                  this.toggleModal("add_property")
              }}
              style={{ margin: 20 }}
            >
              {this.isRenterActive()?"Add a wishlist property":"Add your current property"}
            </button>
          )}
        </div>
      </React.Fragment>
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
    properties:state.properties,
    groups:state.groups
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(NewProperty);

import React from "react";
import { connect } from "react-redux";
import Firebase from "../../firebasehelper";
import AddProperty from "../../Components/AddProperty";
import PropertyThumbnail from "../../Components/PropertyThumbnail";
import "./index.css";
class NewProperty extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addproperty_visible: false,
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
    if(prevState.properties!==properties)
      this.setState({properties,groups});
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
  toggleModal = () => {
    const { addproperty_visible } = this.state;
    this.setState({ addproperty_visible: !addproperty_visible });
  };
  requestPropertyTest = () => {
    this.props.history.push("/referencing");
  };
  showHousemates = (property)=>{
    this.props.history.push("/housemates",{property});
  }
  render() {
    const { addproperty_visible,adding,properties } = this.state;
    const {uid} = this.props;
    return (
      <React.Fragment>
        <AddProperty
          addProperty={this.addProperty}
          showModal={addproperty_visible}
          toggleModal={() => this.toggleModal()}
        />
        {properties.length===0&&!adding&&
          <div id="comment-container">
              <img src={require("../../assets/media/property_status/home.png")} width="90" style={{marginBottom:20}}/>
              You are yet to add any properties
              <button
                type="button"
                className="btn btn-green"
                onClick={() => this.toggleModal()}
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
            properties.map((item, index) => {
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
                if(properties.length===4)
                  alert("You cannot add properties more.");
                else
                  this.toggleModal()
              }}
              style={{ margin: 20 }}
            >
              Add a wishlist property
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

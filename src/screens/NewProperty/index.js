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
    const { uid, profile,properties } = this.props;
    if (!uid) this.props.history.push("/");
    this.setState({properties});
  }
  componentDidUpdate(prevProps, prevState) {
    const { properties } = this.props;
    if(prevState.properties!==properties)
      this.setState({properties});
  }
  addProperty = async property => {
    const { uid } = this.props;
    const {properties} = this.state;
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
      status:properties.length?"pending":"active"
    }
    let property_id = await Firebase.addPropertyWishtoRenter(uid,new_property);
    this.setState({adding:false});
    console.log("property_id",property_id);
  };
  toggleModal = () => {
    const { addproperty_visible } = this.state;
    this.setState({ addproperty_visible: !addproperty_visible });
  };
  requestPropertyTest = () => {
    this.props.history.push("/referencing");
  };
  Activate = (id)=>{
    const {uid} = this.props;
    const {properties} = this.state;
    console.log("Activate this",id);
    let active_properties = properties.filter(property=>property.status==="active");
    if(!active_properties.length)
      Firebase.updateRentersPropertyById(uid,id,{status:"active"});
    else
      alert("You can activate only one property at one moment.");
  }
  Deactivate = (id)=>{
    const {uid} = this.props;
    console.log("Deactivate this",id);
    Firebase.updateRentersPropertyById(uid,id,{status:"pending"});
  }
  render() {
    const { addproperty_visible,adding,properties } = this.state;
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
                  order={index}
                  key={index}
                  onRequestPropertyTest={() => this.requestPropertyTest(item)}
                  Activate={this.Activate}
                  Deactivate={this.Deactivate}
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
    properties:state.properties
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(NewProperty);

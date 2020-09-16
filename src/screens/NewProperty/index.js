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
      property: "",
    };
  }
  async componentDidMount() {
    const { uid, brand, profile } = this.props;
    if (!uid) this.props.history.push("/");
    const brand_name = brand.name;
    if (profile) {
      const property_id = profile.property_id;
      console.log(property_id, uid);
      Firebase.getPropertyById(property_id, brand_name).then((res) => {
        console.log("property info", res);
        this.setState({ property: res });
      });
    }
  }
  //   addProperty = async state => {
  //     const { brand_id } = this.state;
  //     this.setState({ adding: true });
  //     const {
  //       property_type,
  //       rental_type,
  //       price,
  //       bedrooms,
  //       property_address,
  //       content
  //     } = state;
  //     const property = {
  //       property_type: property_type.value,
  //       rental_type: rental_type.value,
  //       price,
  //       brand: brand_id,
  //       bedrooms,
  //       property_address
  //     };
  //     console.log("property", property);
  //     Firebase.addProperty(property, content)
  //       .then(res => {
  //         console.log("res", res);
  //         this.setState({ adding: false });
  //         if (res.length === 1) this.toggleModal("success");
  //       })
  //       .catch(err => {
  //         alert(err);
  //         this.setState({ adding: false });
  //       });
  //   };
  toggleModal = () => {
    const { addproperty_visible } = this.state;
    this.setState({ addproperty_visible: !addproperty_visible });
  };
  requestPropertyTest = () => {
    this.props.history.push("/referencing");
  };
  render() {
    const { addproperty_visible, property } = this.state;
    return (
      <div id="property-container">
        {property && (
          <PropertyThumbnail
            property={property}
            onRequestPropertyTest={() => this.requestPropertyTest()}
          />
        )}

        <AddProperty
          addProperty={this.addProperty}
          showModal={addproperty_visible}
          toggleModal={() => this.toggleModal()}
        />

        {property === "" && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => this.toggleModal()}
            style={{ margin: 20 }}
          >
            Add Property
          </button>
        )}
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
    brand: state.brand,
    uid: state.uid,
    profile: state.profile,
    renters: state.renters,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(NewProperty);

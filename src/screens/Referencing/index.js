import React from "react";
import { connect } from "react-redux";
import Firebase from "../../firebasehelper";
import CustomAlert from "../../Components/CustomAlert";
import referencing_png from "../../images/explore/referencing.png";
import "./index.css";
class Referencing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      property_data: {}
    };
  }
  async componentDidMount() {
    const {  profile} = this.props;
    console.log("profile in",profile);
    this.setState({ profile });
    if(profile.request_reference){
      let group_id = profile.request_reference;
      let group_data = await Firebase.getGroup(group_id);
      const {property_id} = group_data;
      let property_data = await Firebase.getProperty(property_id);
      let brand = property_data.brand;
      brand = brand.split(" ").join("")
      this.setState({brand,group_id});
      console.log("brand",brand);
    }
    else{
      this.setState({alertmodalOpen:true, alertIcon:referencing_png,modal_script:"Your property manager must request your reference, to activate your referencing journey."});
    }
  }
  componentDidUpdate(prevProps,prevState) {
    if(prevProps.profile!==this.props.profile){
      console.log("profile",this.props.profile);
    }
  }
  dismissAlert = ()=>{
    this.props.history.goBack();
    this.setState({alertmodalOpen:false});
  }
  render() {
    const { profile,group_id,brand,alertmodalOpen,alertIcon,modal_script } = this.state;
    const { uid } = this.props;
    // let brand_name = brand.name;
    // brand_name = brand_name.replace(/\s/g, "");
    console.log("profile in render", profile);
    return (
      <div id="reference-container" className="row no-gutters flex-md-10-auto">
          <iframe
            frameborder="0"
            marginheight="1"
            marginwidth="1"
            src={`https://rentrobot.io/${brand}?uid=${uid}&group_id=${group_id}`}
            title="rent robot"
            className="rentbot-iframe"
          />
          <CustomAlert 
            description={modal_script}
            closeModal = {this.dismissAlert}
            is_Success={true}
            icon={alertIcon}
            modalIsOpen={alertmodalOpen}
        />
        
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
    renters: state.renters,
    brand: state.brand
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Referencing);

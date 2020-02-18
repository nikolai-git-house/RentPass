import React from "react";
import { connect } from "react-redux";
import Firebase from "../../firebasehelper";
import "./index.css";
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      property_data: {}
    };
  }
  async componentDidMount() {
    const { uid, profile, brand } = this.props;
    if (!uid) this.props.history.push("/");
    console.log("profile", profile);
    const { groupId } = profile;
    let property_data = await Firebase.getPropertyById(groupId, brand.name);
    this.setState({ property_data, loading: false });
  }

  render() {
    const { profile } = this.state;
    const { brand, uid } = this.props;
    let brand_name = brand.name;
    brand_name = brand_name.replace(/\s/g, "");
    console.log("profile in render", profile);
    return (
      <div id="reference-container" className="row no-gutters flex-md-10-auto">
        <iframe
          src={`https://rentrobot.io/${brand_name}?uid=${uid}`}
          title="rent robot"
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
export default connect(mapStateToProps, mapDispatchToProps)(Home);

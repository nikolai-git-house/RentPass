import React from "react";
import { connect } from "react-redux";
import Firebase from "../../firebasehelper";
import Package from "../../Components/Package";
import "./index.css";
class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  async componentDidMount() {
    const { uid, profile, brand } = this.props;
    if (!uid) this.props.history.push("/");
    Firebase.getBoltPackages((res) => {
      let brand_logo = brand.logo;
      let bolt_packages = Object.values(res);
      let brand_packages = [];
      let array = [];
      bolt_packages.map((item) => {
        const { order } = item;
        array[order] = item;
      });
      bolt_packages = array;
      console.log("bolt packages", bolt_packages);
      if (brand.packages) {
        brand_packages = Object.values(brand.packages);
      }
      array = [];
      brand_packages.map((item) => {
        const { order } = item;
        array[order] = item;
      });
      brand_packages = array;
      console.log("brand_packages", brand_packages);
      let packages = bolt_packages.concat(brand_packages);
      console.log("packages", packages);
      this.setState({ loading: false, packages, brand_logo });
    });
  }
  showPackages = () => {
    let { packages } = this.state;
    const { profile } = this.props;
    console.log("packages inside ShowPackages", packages);
    return packages.map((item, index) => {
      const { visibility } = item;
      if (visibility)
        return <Package id={index} data={item} profile={profile} />;
    });
  };
  render() {
    const { profile, loading } = this.state;
    const { brand, uid } = this.props;
    let brand_name = brand.name;
    brand_name = brand_name && brand_name.replace(/\s/g, "");
    console.log("profile in render", profile);
    return (
      <div id="home-container" className="row no-gutters flex-md-10-auto">
        <div className="div_content">
          {loading && <i class="fa fa-4x fa-sync fa-spin text-muted" />}
          {!loading && this.showPackages()}
        </div>
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
    uid: state.uid,
    profile: state.profile,
    renters: state.renters,
    brand: state.brand,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Shop);

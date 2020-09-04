import React from "react";
import { connect } from "react-redux";
import "./index.css";
const default_avatar = require("../../images/community/avatar.png");
const phone_img = require("../../images/profile/phone.png");
const gift_img = require("../../images/profile/gift.png");
class ProfileModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      profile: props.profile,
      avatar: "",
      firstname: "",
      phonenumber: "",
      dob: ""
    };
  }
  componentDidMount() {
    const { profile } = this.props;
    if (profile) {
      this.setState({
        avatar: profile.avatar_url,
        firstname: profile.firstname,
        phonenumber: profile.phonenumber,
        dob: profile.dob
      });
    }
  }
  componentDidUpdate(prevProps) {
    const { profile } = prevProps;
    this.setState({ profile });
  }
  render() {
    const { avatar, firstname, phonenumber, dob } = this.state;
    return (
      <div
        className="modal fade"
        id="profile_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modal-default-fadein"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{firstname}'s Profile</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                ref={button => (this.dismissElement = button)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body pb-1 content">
              <img
                src={avatar ? avatar : default_avatar}
                width="80"
                height="80"
                style={{ borderRadius: 40 }}
                alt="avatar"
              />
              <div className="row_item">
                <img src={phone_img} width="30" height="30" alt="phone" />
                <p>{phonenumber}</p>
              </div>
              <div className="row_item">
                <img src={gift_img} width="30" height="30" alt="dob" />
                <p>{dob}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-light"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
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
    brand: state.brand
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ProfileModal);

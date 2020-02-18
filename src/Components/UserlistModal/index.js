import React from "react";
import { connect } from "react-redux";
import UserItem from "../UserItem";
class UserlistModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: props.users
    };
  }
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    this.setState({ users: nextProps.users });
  }
  tick = (check, index) => {
    let { users } = this.state;
    users[index].checked = check;
    console.log("users", users);
  };
  showUsers() {
    const { users } = this.state;
    return users.map((item, index) => {
      return (
        <UserItem
          key={index}
          Tick={check => this.tick(check, index)}
          avatar={item.avatar_url}
          username={item.firstname}
          birth={item.dob}
        />
      );
    });
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <div
        className="modal fade"
        id="add_tenant"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modal-default-fadein"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add tenant</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body pb-1">{this.showUsers()}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-light"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                data-dismiss="modal"
                onClick={this.addProperty}
              >
                Add
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
    users: state.users
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserlistModal);

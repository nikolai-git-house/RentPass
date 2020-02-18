import React from "react";
import "./index.scss";
class UserItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onChange = e => {
    const { Tick } = this.props;
    Tick(e.target.checked);
  };
  render() {
    const { avatar, username, birth } = this.props;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 5
        }}
      >
        <img
          className="img-avatar img-avatar8"
          src={avatar ? avatar : require("../../assets/media/logo/avatar.png")}
          alt="avatar"
        />
        <p className="username">{username}</p>
        <p className="birth">{birth}</p>
        <input type="checkbox" value={username} onChange={this.onChange} />
      </div>
    );
  }
}
export default UserItem;

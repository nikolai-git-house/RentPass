import React from "react";
class SwitchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { handleSwitch, value } = this.props;
    return (
      <div className="filter_tab">
        <button
          className={`btn btn-switch ${value === "spending" ? "active" : ""}`}
          onClick={() => handleSwitch("spending")}
        >
          Earn on spending
        </button>
        <button
          className={`btn btn-switch ${value === "community" ? "active" : ""}`}
          onClick={() => handleSwitch("community")}
        >
          Earn from community
        </button>
      </div>
    );
  }
}

export default SwitchBar;

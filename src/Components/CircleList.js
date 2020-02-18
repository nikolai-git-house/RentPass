import React, { Component } from "react";
import Circle from "./Circle";

export default class CircleList extends Component {
  render() {
    const { index } = this.props;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: "5%"
        }}
      >
        <Circle color={index === 0 ? "grey" : "#ffffff"} />
        <Circle color={index === 1 ? "grey" : "#ffffff"} />
        <Circle color={index === 2 ? "grey" : "#ffffff"} />
        <Circle color={index === 3 ? "grey" : "#ffffff"} />
        <Circle color={index === 4 ? "grey" : "#ffffff"} />
      </div>
    );
  }
}

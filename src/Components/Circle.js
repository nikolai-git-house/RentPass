import React, { Component } from "react";

export default class Circle extends Component {
  render() {
    const { color } = this.props;
    return <div className={`circle`} style={{ backgroundColor: color }} />;
  }
}

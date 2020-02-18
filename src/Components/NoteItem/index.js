import React from "react";
import { parse } from "url";
import "./index.css";
var getStringfromSeconds = function(time) {
  var t = new Date(parseInt(time));
  var tf = function(i) {
    return (i < 10 ? "0" : "") + i;
  };
  const yyyy = tf(t.getFullYear());
  const month = tf(t.getMonth() + 1);
  const mm = tf(t.getMinutes());
  const dd = tf(t.getDate());
  const hh = tf(t.getHours());
  const ss = tf(t.getSeconds());
  return dd + "/" + month + "/" + yyyy + " " + hh + ":" + mm + ":" + ss;
};
class NoteItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      detail_visible: false
    };
  }
  click = () => {
    const { detail_visible } = this.state;
    this.setState({ detail_visible: !detail_visible });
    console.log("clicked", detail_visible);
  };
  render() {
    const { note, time, noter } = this.props;
    const { detail_visible } = this.state;
    return (
      <div className="note-content">
        <div
          className="note-item"
          onClick={this.click}
          style={{ background: "white" }}
        >
          <p>
            <i className="fas fa-user" />
            &nbsp;&nbsp;&nbsp;{noter}
          </p>
          <p>{getStringfromSeconds(time)}</p>
        </div>
        {detail_visible && <p>{note}</p>}
      </div>
    );
  }
}
export default NoteItem;

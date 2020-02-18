import React, { Component } from "react";
import Firebase from "../../firebasehelper";
import Select from "react-select";
import NoteItem from "../NoteItem/index";
import "./index.css";
const options = [
  { value: "damage", label: "Damage Policy" },
  { value: "void", label: "Default & Void Policy" },
  { value: "response", label: "Response Policy" },
  { value: "appliances", label: "Appliances Policy" }
];
const Styles = {
  control: styles => ({ ...styles, backgroundColor: "white", width: 350 })
};
class Ticket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket: props.ticket,
      username: props.username,
      agency_name: props.agency_name,
      uid: props.uid,
      repair_sla: "",
      response_sla: "",
      selectedOption: null,
      noteview_visible: true,
      note: [],
      mynote: ""
    };
  }
  componentDidMount() {
    this.props.ticket.ticket_id <= 14
      ? Firebase.getAnswerfromTicket(this.props.ticket.ticket_id, res => {
          console.log("answer", res);
          this.setState({
            response_sla: res.response_sla,
            repair_sla: res.repair_sla
          });
        })
      : this.setState({
          response_sla: "None",
          repair_sla: "None"
        });
    const { uid, ticket } = this.props;
    console.log("uid,ticket", uid, ticket);
    Firebase.getTicketData(uid, ticket.ticket_id, res => {
      const { policy, note } = res;
      this.setState({
        selectedOption: policy ? policy : null,
        note: note ? note : []
      });
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ ticket: nextProps.ticket });
    this.setState({ username: nextProps.username });
    this.setState({ uid: nextProps.uid });
    nextProps.ticket.ticket_id <= 14
      ? Firebase.getAnswerfromTicket(nextProps.ticket.ticket_id, res => {
          console.log("answer", res);
          this.setState({
            response_sla: res.response_sla,
            repair_sla: res.repair_sla
          });
        })
      : this.setState({
          response_sla: "None",
          repair_sla: "None"
        });
    const { uid, ticket } = nextProps;
    Firebase.getTicketData(uid, ticket.ticket_id, res => {
      const { policy, note } = res;
      this.setState({
        selectedOption: policy ? policy : null,
        note: note ? note : []
      });
    });
  }
  getCategoryNumber(ticket) {
    let str = ticket.toString();
    let arr = str.split(".");
    return arr[0];
  }
  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
    let { uid, ticket } = this.state;

    let policy = selectedOption;
    Firebase.updateTicketPolicy(uid, ticket.ticket_id, policy);
  };
  onChangeText = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  Save = () => {
    let { uid, ticket, mynote, note, agency_name } = this.state;
    let time = new Date().getTime().toString();
    note.push({ time: time, note: mynote, noter: agency_name });
    Firebase.updateTicketNote(uid, ticket.ticket_id, note);
    this.setState({ mynote: "", noteview_visible: true });
  };
  onAddNote = () => {
    this.setState({ noteview_visible: false });
  };
  onViewNote = () => {
    this.setState({ noteview_visible: true });
  };
  showNotes = () => {
    const { note } = this.state;
    if (note.length)
      return note.map((item, index) => {
        return (
          <NoteItem
            key={index}
            noter={item.noter}
            note={item.note}
            time={item.time}
          />
        );
      });
  };
  render() {
    const {
      ticket,
      uid,
      repair_sla,
      response_sla,
      username,
      selectedOption,
      note,
      mynote,
      noteview_visible
    } = this.state;
    return (
      <div className="ticket-content">
        <h3>{username}</h3>
        <p>Category Number: {this.getCategoryNumber(ticket.ticket_id)}</p>
        <p>Ticket Name: {ticket.issue}</p>
        <p> Ticket Number: {ticket.ticket_id}</p>
        <p> Member ID: {uid}</p>
        <p> Response SLA: {response_sla}</p>
        <p> Repair SLA: {repair_sla}</p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: 20
          }}
        >
          <p>Policy IDs</p>&nbsp;&nbsp;
          <Select
            placeholder="Policy IDs"
            className="select-custom-class"
            value={selectedOption}
            onChange={this.handleChange}
            options={options}
            isMulti={true}
            styles={Styles}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-around",
            marginBottom: 20
          }}
        >
          <button className="btn btn-secondary" onClick={this.onAddNote}>
            Add a note
          </button>
          <button className="btn btn-secondary" onClick={this.onViewNote}>
            View notes
          </button>
        </div>
        {!noteview_visible && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                marginBottom: 10
              }}
            >
              <p>Note</p>&nbsp;&nbsp;&nbsp;&nbsp;
              <textarea
                rows={5}
                name="mynote"
                style={{ width: "80%" }}
                onChange={this.onChangeText}
                value={mynote}
              />
            </div>
            <center>
              <button className="btn btn-success" onClick={this.Save}>
                Save
              </button>
            </center>
          </div>
        )}
        {noteview_visible && this.showNotes()}
      </div>
    );
  }
}
export default Ticket;

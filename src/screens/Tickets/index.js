import React from "react";
import { connect } from "react-redux";
import Firebase from "../../firebasehelper";
import { getStringfromSeconds } from "../../functions";
import LiveChat from "../LiveChat";
import LiveChatModal from "../LiveChatModal";
import "./index.css";
const bolt_img = require("../../assets/media/icons/sun.png");
function compare(a, b) {
  if (parseInt(a.time, 10) < parseInt(b.time, 10)) {
    return 1;
  }
  if (parseInt(a.time, 10) > parseInt(b.time, 10)) {
    return -1;
  }
  return 0;
}
window.mobilecheck = function() {
  var check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
class Tickets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      selected: false,
      chatdiv_visible: false,
      loading: true,
      showModal: false
    };
  }
  componentDidMount() {
    let uid = this.props.uid;
    console.log("uid", uid);
    Firebase.getTicketsById(uid, res => {
      console.log("tickets", res);
      if (res) {
        let array = [];
        let ticket_keys = Object.keys(res);
        let tickets = Object.values(res);
        tickets.map((item, index) => {
          let data = item;
          data.id = ticket_keys[index];
          array.push(data);
        });
        array.sort(compare);
        this.setState({ tickets: array, loading: false });
      } else {
        this.setState({ loading: false });
      }
    });
  }
  toggleModal = () => {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
  };
  clickTicket = (item, index) => {
    const { profile } = this.props;
    console.log("profile", profile);
    this.setState({ ticket: item, focused: index });
    this.setState({ chatdiv_visible: true });
    if (window.mobilecheck()) this.toggleModal();
  };
  getColorByStatus(status) {
    switch (status) {
      case "Open":
        return "#7Ef0a7";
        break;
      case "Waiting":
        return "#FFD366";
        break;
      case "Closed":
        return "red";
        break;
      default:
        return "green";
    }
  }
  showTickets = tickets => {
    const { focused } = this.state;
    return tickets.map((item, index) => {
      return (
        <div
          key={index}
          style={{
            background: focused === index ? "#9F9E9E" : "#152439"
          }}
          className="ticket"
          onClick={() => this.clickTicket(item, index)}
        >
          <div style={{ maxWidth: 500, display: "flex", flexDirection: "row" }}>
            <p>{getStringfromSeconds(item.time)}</p>
            <p>
              &nbsp;&nbsp;&nbsp;<b>Ticket</b>&nbsp;:&nbsp;
              {item.issue}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <p
              style={{
                color: this.getColorByStatus(item.status),
                fontWeight: "bold"
              }}
            >
              {item.status}
            </p>
          </div>
        </div>
      );
    });
  };
  render() {
    const { uid, profile, brand } = this.props;
    let { chatdiv_visible, ticket, tickets, loading, showModal } = this.state;
    console.log("tickets in render", tickets);
    return (
      <div id="page-container">
        <div
          className="row no-gutters flex-md-10-auto"
          style={{ width: "100%", height: "100%" }}
        >
          <div
            className="row no-gutters flex-md-10-auto"
            style={{
              width: "100%",
              height: "100%",
              marginTop: 20
            }}
          >
            <div
              className="col-md-7 col-lg-7 col-xl-7 bg-body-dark"
              style={{ padding: 15, height: "100%", overflow: "scroll" }}
            >
              <div className="content content-full">
                <div className="block block-fx-pop">
                  {this.showTickets(tickets)}
                </div>
              </div>
              {!tickets.length && !loading && (
                <div
                  style={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                    borderRadius: 20,
                    padding: 40,
                    margin: 40
                  }}
                >
                  <img
                    src={bolt_img}
                    width="100"
                    height="100"
                    alt="support"
                    style={{ marginBottom: 20 }}
                  />
                  <p style={{ textAlign: "center" }}>
                    There are currently no live tickets against your properties.
                    Tenants are able to run their property by submitting tickets
                    through their concierge, once you've added them as a tenant.
                  </p>
                </div>
              )}
            </div>
            <div
              className="col-md-5 col-lg-5 col-xl-5"
              style={{ padding: 15, height: "93%", overflow: "scroll" }}
            >
              <div className="content">
                <div className="d-md-none push">
                  <button
                    type="button"
                    className="btn btn-block btn-hero-primary"
                    data-toggle="class-toggle"
                    data-target="#side-content"
                    data-class="d-none"
                  >
                    Live chat
                  </button>
                </div>
                <div id="side-content" className="d-none d-md-block push">
                  {chatdiv_visible && (
                    <LiveChat
                      uid={uid}
                      ticket={ticket}
                      icon={brand.icon}
                      username={profile.firstname}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="chatModal">
            <LiveChatModal
              uid={uid}
              ticket={ticket}
              icon={brand.icon}
              username={profile.firstname}
              showModal={showModal}
              toggleModal={this.toggleModal}
            />
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
    brand: state.brand,
    uid: state.uid,
    profile: state.profile,
    renters: state.renters
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Tickets);

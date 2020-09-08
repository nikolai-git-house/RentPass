import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import "./index.css";

const home_emergency_img = require("../../images/choice/0_home_emergencies.png");
const flood_water_img = require("../../images/choice/0.1_water_flood.png");
const fire_img = require("../../images/choice/0.2_fire.png");
const gas_leak_img = require("../../images/choice/0.3_gas_leak.png");
const burglary_img = require("../../images/choice/0.4_burglary.png");
// const home_repair_img = require("../images/choice/1_home_repairs.png");
// const subscription_packages_img = require("../images/choice/15_subscription_packages.png");
// const my_subscriptions_img = require("../images/choice/16_my_subscriptions.png");
// const wellness_img = require("../images/choice/17_mental_wellness.png");
// const fitness_img = require("../images/choice/18_fitness.png");
// const home_utilities_img = require("../images/choice/19_home_utilities.png");
// const cashback_img = require("../images/choice/20_cashback.png");
// const personal_travel_img = require("../images/choice/21_personal_travel.png");
// const dining_drinking_img = require("../images/choice/22_dining_drinking.png");
// const arts_culture_img = require("../images/choice/23_arts_cultures.png");
// const entertainment_img = require("../images/choice/24_entertainment.png");
// const beauty_treatments_img = require("../images/choice/25_beauty_treatments.png");
// const groceries_shopping_img = require("../images/choice/26_groceries_shopping.png");
// const fashion_shopping_img = require("../images/choice/27_fashion_shopping.png");
// const talk_img = require("../images/choice/30_talk_to_a_human.png");
// const app_bug_img = require("../images/choice/31_app_bugs.png");
// const my_housemates_img = require("../images/choice/39_my_housemates.png");
// const my_trips_img = require("../images/choice/40_my_trips.png");
// const speak_to_a_doctor_img = require("../images/choice/42_speak_to_a_doctor.png");
// const tokens_img = require("../images/choice/35_tokens.png");
// const healthy_eating_img = require("../images/choice/36_healthy_eating.png");
// const music_img = require("../images/choice/37_music.png");
// const my_card_img = require("../images/choice/38_my_card.png");
// const request_callback_img = require("../images/choice/41_request_callback.png");
// const sport_img = require("../images/choice/43_sport.png");

// const business_travel_img = require("../images/choice/44_business_travel.png");
// const find_new_home_img = require("../images/choice/45_find_newhome.png");
// const find_housemates_img = require("../images/choice/46_find_housemates.png");
// const list_my_home_img = require("../images/choice/47_list_my_home.png");
// const view_timeline_img = require("../images/choice/48_view_timeline.png");
// const home_dates_img = require("../images/choice/49_home_dates.png");
// const social_dates_img = require("../images/choice/50_social_dates.png");
// const travel_dates_img = require("../images/choice/51_travel_dates.png");
// const accounting_img = require("../images/choice/52_accounting.png");
// const shipping_img = require("../images/choice/53_shipping.png");
// const printing_img = require("../images/choice/54_printing.png");
// const tax_img = require("../images/choice/55_tax.png");
// const mentors_img = require("../images/choice/56_mentors.png");
// const utilities_img = require("../images/choice/57_utilities.png");
// const swap_img = require("../images/choice/59_swap.png");
// const features_img = require("../images/choice/60_features.png");
// const guide_img = require("../images/choice/61_guide.png");
// const faults_img = require("../images/choice/62_faults.png");
// const find_workspace_img = require("../images/choice/63_find_workspace.png");
// const office_repairs_img = require("../images/choice/64_office_repairs.png");
// const my_home_img = require("../images/choice/1st_layer/my_home.png");
// const my_shopping_img = require("../images/choice/1st_layer/my_shopping.png");
// const my_travel_goals_img = require("../images/choice/1st_layer/my_travel_goals.png");
// const my_health_wellness_img = require("../images/choice/1st_layer/my_health_wellness.png");
// const my_social_life_img = require("../images/choice/1st_layer/my_social_life.png");
// const my_wallet_img = require("../images/choice/1st_layer/my_wallet.png");
// const my_concierge_img = require("../images/choice/1st_layer/my_concierge.png");
// const my_renting_img = require("../images/choice/1st_layer/my_renting.png");
// const my_calendar_img = require("../images/choice/1st_layer/my_calendar.jpg");
// const my_dining_img = require("../images/choice/1st_layer/my_dining.png");
// const my_business_img = require("../images/choice/1st_layer/my_business.png");
// const my_terminal_img = require("../images/choice/1st_layer/my_terminal.png");
// const my_workspace_img = require("../images/choice/1st_layer/my_workspace.png");
window.mobilecheck = function () {
  var check = false;
  (function (a) {
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

class Choice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      emergency_source: [
        { id: 0.1, title: "Flood Water", src: flood_water_img },
        { id: 0.2, title: "Fire", src: fire_img },
        { id: 0.3, title: "Gas Leak", src: gas_leak_img },
        { id: 0.4, title: "Burglary", src: burglary_img },
      ],
      emergency_visible: false,
      second_layer: [],
      second_layer_visible: false,
    };
  }
  componentDidMount() {
    console.log("Choice");
    const tier_data = this.props.tier_data;
    console.log("tier_data in Choice", tier_data);
    const homeTier = tier_data.find((data) => data.title === "My Home");
    console.log(homeTier);
    this.setState({
      dataSource: tier_data,
      second_layer_visible: true,
      second_layer: homeTier ? homeTier.value : [],
    });
  }
  selectInFirstLayer = (item) => {
    const { addMessage } = this.props;
    console.log("item.title", item.title);
    if (item.title === "Dining") {
      addMessage("Dining");
    } else if (item.title === "View timeline") {
      addMessage("View timeline");
    } else if (item.title === "My Health & Wellness") {
      addMessage("My Wellness");
    } else {
      console.log("second_layer", item.value);
      console.log(item);
      this.setState({
        second_layer: item.value,
        second_layer_visible: true,
        is_brandRouting: item.is_brandRouting,
      });
    }
  };
  render() {
    const {
      dataSource,
      second_layer_visible,
      second_layer,
      is_brandRouting,
    } = this.state;
    const { addMessage, tier_data } = this.props;
    console.log("dataSource", dataSource);
    return (
      <div>
        {!second_layer_visible && (
          <div className="gallery">
            {dataSource.map((item) => {
              let title = item.title;
              if (item.active && !item.is_brandRouting)
                return (
                  <button onClick={() => this.selectInFirstLayer(item)}>
                    <img src={item.src} alt="" width="100%" />
                  </button>
                );
              if (item.active && item.is_brandRouting)
                return (
                  <button
                    className="branded_button"
                    onClick={() => this.selectInFirstLayer(item)}
                  >
                    <img src={item.src} alt="" />
                    <p>{title}</p>
                  </button>
                );
            })}
          </div>
        )}
        {second_layer_visible && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="gallery">
              {second_layer.map((item) => {
                const { site_url } = item;
                if (item.active && !is_brandRouting)
                  return (
                    <button onClick={() => addMessage(item.title)}>
                      <img src={item.src} alt="" width="100%" />
                    </button>
                  );
                if (item.active && is_brandRouting)
                  if (site_url)
                    return (
                      <a href={site_url} target="_blank">
                        <button className="branded_button">
                          <img src={item.src} alt="" />
                          <p>{item.title}</p>
                        </button>
                      </a>
                    );
                  else
                    return (
                      <button
                        className="branded_button"
                        onClick={
                          () => console.log("site_url", site_url)
                          // site_url
                          //   ? () => this.props.history.push(site_url)
                          //   : () => addMessage(item.title)
                        }
                      >
                        <img src={item.src} alt="" />
                        <p>{item.title}</p>
                      </button>
                    );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Choice;

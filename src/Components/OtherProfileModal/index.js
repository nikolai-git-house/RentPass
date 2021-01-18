import React from "react";
import moment from "moment";
import "./index.css";
const default_avatar = require("../../images/community/avatar.png");
const heart_img = require("../../images/profile/heart.png");
const profession_img = require("../../images/profile/profession.png");
const superhero_img = require("../../images/profile/superhero.png");
const salary_img = require("../../images/profile/growth.png");
const user_img = require("../../images/community/avatar.png");

function _calculateAge(birthday) {
  // birthday is a date
  if (!birthday) return "TBC";
  const age = birthday
    ? moment().diff(
        isNaN(new Date(birthday).getTime())
          ? moment(birthday, "DD/MM/YYYY")
          : new Date(birthday),
        "years"
      )
    : "";
  if (isNaN(age))
    return "TBC";
  return age;
}

class OtherProfileModal extends React.PureComponent {
  render() {
    const {
      profile: { avatar_url, firstname, profession, dob, super_skill },
      onChatNow,
    } = this.props;
    return (
      <div
        className="modal fade"
        id="other_profile_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modal-default-fadein"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content other-profile-dialog-content">
            <div className="modal-body pb-1 other-profile-content">
              <button
                type="button"
                className="close other-profile-dismiss-btn"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <div className="other-profile-header">
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    marginRight: 10,
                    backgroundImage: `url(${
                      avatar_url ? avatar_url : default_avatar
                    })`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                ></div>
                <p>
                  <b>{firstname}'s</b> <br /> Personal Profile
                </p>
              </div>
              <div className="other-personal-view">
                <div className="other-personal-row">
                  <img src={heart_img} width="30" alt="age"></img>
                  <p className="row_item_value">Age: {_calculateAge(dob)}</p>
                </div>
                <div className="other-personal-row">
                  <img src={profession_img} width="30" alt="profession"></img>
                  <p className="row_item_value">{profession || "Profession"}</p>
                </div>
                <div className="other-personal-row">
                  <img src={superhero_img} width="30" alt="super_skill"></img>
                  <p className="row_item_value">
                    {super_skill || "Super Skill"}
                  </p>
                </div>
              </div>
              <div className="other-personal-view">
                <div className="other-personal-row" style={{ paddingLeft: 0 }}>
                  <div className="user_profile_score_container">
                    <div
                      className="user_profile_score"
                      style={{ borderColor: "#BEBEBE" }}
                    >
                      <p>50</p>
                      <i
                        className="fa fa-user"
                        style={{ background: "#bebebe" }}
                      />
                    </div>
                    <p className="score_label">Profile score</p>
                  </div>
                  <div className="user_profile_score_container">
                    <div
                      className="user_profile_score"
                      style={{ borderColor: "#9BCCB4" }}
                    >
                      <p>50</p>
                      <i
                        className="fa fa-leaf"
                        style={{ background: "#9BCCB4" }}
                      />
                    </div>
                    <p className="score_label">Eco score</p>
                  </div>
                  <div className="user_profile_score_container">
                    <div
                      className="user_profile_score"
                      style={{ borderColor: "#F2AAAA" }}
                    >
                      <p>50</p>
                      <i
                        className="fa fa-heart"
                        style={{ background: "#F2AAAA" }}
                      />
                    </div>
                    <p className="score_label">Social score</p>
                  </div>
                </div>
              </div>
              <div className="actions-container">
                <button
                  className="btn_green"
                  data-dismiss="modal"
                  onClick={onChatNow}
                >
                  Chat now
                </button>
                <button className="btn_share_tokens">Share tokens</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OtherProfileModal;

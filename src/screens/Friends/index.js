import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { removeAll, saveProfile } from "../../redux/actions";
import Firebase from "../../firebasehelper";
import AddCommunityMemberModal from "../../Components/AddCommunityMemberModal";
import OtherProfileModal from "../../Components/OtherProfileModal";
import CustomAlert from "../../Components/CustomAlert";
import live_sub_img from "../../images/new wallet/1.png";
import user_img from "../../images/community/avatar.png";
import error_img from "../../images/error.png";
import "./index.css";
import { TerritoryOptions, CurrencyOptions } from "../../Utils/Constants";
import {inviteUserSMS } from "../../functions/Auth";

class Friends extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: [],
      user: {},
      users:[],
      loading:true,
      alertIcon:require("../../images/livechat/user.png"),
      alertmodalOpen:false,
      desiredUser: {}
    };
    this.hiddenBtnRef = React.createRef();
  }
  async componentDidMount() {
      const {uid} = this.props;
      Firebase.subscribeUserDatafromUID("Rental Community", uid, (user) => {
        if (user) {
          let friends = user.friends || [];
          let final_friends_data = friends.map(async friend=>{
            const {uid} = friend;
            let friend_data = await Firebase.getUserDatafromUID("Rental Community",uid);
            const {eco_id} = friend_data;
            let eco_data = {}
            if(eco_id){
              eco_data = await Firebase.getEcoUserbyId(eco_id)
            }
            return {...friend_data,...eco_data,id:uid}
          });
          Promise.all(final_friends_data).then(res=>{
            this.setState({
              user,
              friends: res,
            });
          })
        }
      });
      let users = await Firebase.getAllUsersInBrand("Rental Community");
      let users_promise = users.map(async user=>{
        const {eco_id} = user;
        let eco_db = {};
        if(eco_id)
          eco_db = await Firebase.getEcoUserbyId(eco_id);
        return {...user,...eco_db}
      });
      Promise.all(users_promise).then(final_users=>{
        console.log("final_users",final_users);
        this.setState({users:final_users,loading:false});
      })
    
  }
  signOut = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("profile");
    localStorage.removeItem("brand");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };
  connectFriend = async (friend_id,friend_name,giveToken) =>{
    const {brand,uid,profile,dispatch} = this.props;
    let {user} = this.state;
    let friend_data = await Firebase.getUserDatafromUID("Rental Community",friend_id);
    let friends = user.friends || [];
    friends.push({uid:friend_id,firstname:friend_name});
    Firebase.updateUserById(uid,"Rental Community",{
      friends
    });
    if(giveToken){
      //update tokens value of profile
      Firebase.updateUserById(uid,"Rental Community",{
        tokens: (user.tokens || 0) + 500,
      });
      //save token history
      Firebase.saveTokenHistory("Rental Community",uid,{
        created: new Date(),
        amount: -500,
        type: "invite",});

      //dispatch user profile
      const newProfile = {
        ...profile,
        tokens: (profile.tokens || 0) + 500,
      };
      dispatch(saveProfile(newProfile));
      localStorage.setItem("profile", JSON.stringify(newProfile));
    }

    //update friend data to updated friend list
    friends = friend_data.friends || [];
    friends.push({uid:uid,firstname:profile.firstname});
    Firebase.updateUserById(friend_id,"Rental Community",{friends});
  }
  addFriend = async (firstname, phonenumber) => {
    const { brand } = this.props;
    let { friends,users } = this.state;
    let phonenumbers_array = friends.map(friend=>friend.phonenumber) || [];
    if(phonenumbers_array.includes(phonenumber)){
      this.setState({modal_script:`${firstname} has already been added to your friends list.`,alertIcon:error_img});
      this.showAlert();
    }
    else{
          let flag = users.filter(user=>user.phonenumber===phonenumber);
          if(flag.length){
            //already a user in brand
            let user_profile = flag[0];
            console.log("user profile",user_profile);
            const {avatar_url} = user_profile;
            if(avatar_url)
              this.setState({alertIcon:avatar_url});
            this.setState({modal_script:`${firstname} is already a member of Rental Community. Now you add ${firstname} to your friends list.`});
            this.showAlert();
            const {id} = user_profile;
            this.connectFriend(id,firstname,false);
          }else{
            let newUser = await Firebase.addPendingUser(firstname,phonenumber,brand.name);
            this.connectFriend(newUser.id,firstname,true);
            inviteUserSMS(phonenumber,"Rental Community",firstname);
          }
      }
    
  };
  dismissAlert = ()=>{
    this.setState({alertmodalOpen:false});
  }
  showAlert = ()=>{
    this.setState({alertmodalOpen:true});
  }
  viewUser = (user) => {
    console.log("desiredUser",user);
    if(user.userstatus==="Active"){
        this.setState({ desiredUser: user }, () => {
          if (this.hiddenBtnRef.current) {
            this.hiddenBtnRef.current.click();
          }
        });
    }
  };
  selectUser = (user)=>{
    const {uid} = this.props;
    console.log("select user id",user.id);
    console.log("uid",uid);
    const message={receiver_id:user.id,sender_id:uid}
    this.props.history.push("/messages", { message });
  }
  
  render() {
    const { brand } = this.props;
    const { friends,loading,alertmodalOpen,modal_script, alertIcon,desiredUser } = this.state;

    const territory = brand.territory || TerritoryOptions[0];

    return (
      <div id="friends-page-container">
        <main id="main-container">
          <button
            className="btn btn-green"
            style={{marginTop:20}}
            data-toggle="modal"
            data-target="#add_community_member"
          >
            Add or invite friends
          </button>
          <div className="token-earning-container">
            <div className="token-wrapper">
              <img src={live_sub_img} alt="coin" />
              <p className="token-count">500</p>
            </div>
            <p>{`Earn ${CurrencyOptions[territory]}5 worth of tokens for each friend you invite to your community.`}</p>
          </div>
          {loading&&<p>Loading data...</p>}
          {!loading&&<div className="friends-container">
            {friends.map((friend,index) => (
              <div className="friend-item" key={index} onClick={()=>this.viewUser(friend)}>
                <div
                  className="avatar_img"
                  style={{backgroundImage:`url(${friend.avatar_url ? friend.avatar_url : user_img})`}}
                />
                <p className="group-username">
                  <b>{friend.firstname}</b>
                </p>
                <p style={{marginLeft:"auto"}}>
                  {friend.userstatus}
                </p>
              </div>
            ))}
          </div>}
        </main>
        <CustomAlert 
          description={modal_script}
          closeModal = {this.dismissAlert}
          is_Success={true}
          icon={alertIcon}
          modalIsOpen={alertmodalOpen}
        />
        <AddCommunityMemberModal addUser={this.addFriend} />
        <OtherProfileModal
            profile={desiredUser}
            onChatNow={() => this.selectUser(desiredUser)}
        />
        <button
            ref={this.hiddenBtnRef}
            type="button"
            data-toggle="modal"
            data-target="#other_profile_modal"
            className="hidden-btn"
          ></button>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
    profile: state.profile,
    brand: state.brand,
  };
}
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Friends)
);

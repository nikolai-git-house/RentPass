import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";
import "@firebase/firestore";
import "@firebase/storage";

import { getDate, isMemberofProperty } from "../functions/index";

const firebaseConfig = {
  apiKey: "AIzaSyBlBJtz1oV7_pWAyjrlkxdJ7ZenisHP5sk",
  projectId: "boltconcierge-2f0f9",
  databaseURL: "https://boltconcierge-2f0f9.firebaseio.com",
  storageBucket: "boltconcierge-2f0f9.appspot.com"
};

class Firebase {
  static initialize() {
    firebase.initializeApp(firebaseConfig);
  }
  //
  static storage() {
    return firebase.storage();
  }
  static getStorage() {
    return firebase.storage;
  }
  static firestore() {
    return firebase.firestore();
  }
  // static async getAllUsers() {
  //   const snapshot = await firebase
  //     .firestore()
  //     .collection("user")
  //     .get();
  //   return snapshot.docs.map(item => {
  //     return { [item.id]: item.data() };
  //   });
  // }
  // static getProfile = phonenumber => {
  //   console.log("phonenumber", phonenumber);
  //   return new Promise((resolve, reject) => {
  //     firebase
  //       .firestore()
  //       .collection("landlord")
  //       .where("phonenumber", "==", phonenumber)
  //       .limit(1)
  //       .get()
  //       .then(res => {
  //         if (res.size === 0) resolve(false);
  //         else resolve(res.docs[0]);
  //       })
  //       .catch(err => {
  //         reject(err);
  //       });
  //   });
  // };
  // static getProfileById = uid => {
  //   return new Promise((resolve, reject) => {
  //     firebase
  //       .firestore()
  //       .collection("user")
  //       .doc(uid)
  //       .get()
  //       .then(res => {
  //         resolve(res.data());
  //       })
  //       .catch(err => {
  //         reject(err);
  //       });
  //   });
  // };
  static getUserProfile = (phonenumber, brand) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection(brand)
        .doc("data")
        .collection("user")
        .where("phonenumber", "==", phonenumber)
        .limit(1)
        .get()
        .then(res => {
          if (res.size === 0) resolve(false);
          else resolve(res.docs[0]);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static getBoltPackages = callback => {
    let path = "packages/";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        let result = [];
        result = snapshot.val();
        //let res = Object.values(result)[0];
        console.log("value", result);
        callback(result);
      });
  };
  static isActive = phonenumber => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("brand_users")
        .where("phonenumber", "==", phonenumber)
        .limit(1)
        .get()
        .then(res => {
          if (res.size === 0) resolve(false);
          else resolve(res.docs[0].data());
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static setActiveUser = invitation_data => {
    const { brand, uid, property_id, phonenumber } = invitation_data;
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection(brand)
        .doc("data")
        .collection("user")
        .doc(uid)
        .set({ accepted: true }, { merge: true });
      firebase
        .firestore()
        .collection("brand_users")
        .doc(uid)
        .set(invitation_data)
        .then(res => {
          console.log("result of add", res);
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static getInvitationList = phonenumber => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("brand_invitations")
        .where("phonenumber", "==", phonenumber)
        .get()
        .then(res => {
          // if (res.size) {
          //   res.docs.map(item => {
          //     firebase
          //       .firestore()
          //       .collection("brand_invitations")
          //       .doc(item.id)
          //       .delete();
          //   });
          // }
          resolve({ size: res.size, array: res.docs });
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static getUserProfileById = uid => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("user")
        .doc(uid)
        .get()
        .then(res => {
          resolve(res.data());
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static async getPropertiesByLandlordId(landlord_id) {
    let data = await firebase
      .firestore()
      .collection("landlord")
      .doc(landlord_id)
      .get();
    return data.data().properties;
  }
  static addAvatar(uid, content) {
    return new Promise((resolve, reject) => {
      let storageRef = this.storage().ref(`/avatars/${uid}.png`);
      storageRef
        .putString(content, "base64")
        .then(function (snap) {
          storageRef
            .getDownloadURL()
            .then(function (url) {
              resolve(url);
            })
            .catch(error => {
              reject(error);
              console.log(error.message);
            });
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  static updateUserById(uid, brand, data) {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection(brand)
        .doc("data")
        .collection("user")
        .doc(`${uid}`)
        .set(data, { merge: true });
    });
  }
  static addPropertyImage(imageName, content) {
    return new Promise((resolve, reject) => {
      let storageRef = this.storage().ref(`/property_logo/${imageName}.png`);
      storageRef
        .putString(content, "base64")
        .then(function (snap) {
          storageRef
            .getDownloadURL()
            .then(function (url) {
              resolve(url);
            })
            .catch(error => {
              reject(error);
              console.log(error.message);
            });
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  static addProperty(landlord_id, property, content) {
    const { property_address } = property;
    const { first_address_line } = property_address;
    return new Promise(async (resolve, reject) => {
      try {
        let url = await this.addPropertyImage(first_address_line, content);
        property.url = url;
        property.landlord_id = landlord_id;
        firebase
          .firestore()
          .collection("property")
          .add(property)
          .then(res => {
            Firebase.addPropertytoProfile(landlord_id, property, res.id, url)
              .then(result => {
                if (result) resolve(result);
              })
              .catch(err => {
                reject(err);
              });
          })
          .catch(err => {
            reject(err);
          });
      } catch (error) {
        console.log("error", error);
      }
    });
  }
  static getPropertyById(property_id, brand) {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection(brand)
        .doc("data")
        .collection("property")
        .doc(`${property_id}`)
        .get()
        .then(res => {
          resolve(res.data());
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  static async getPropertyMembersById(property_id, brand) {
    console.log("property_id", property_id);
    console.log("brand", brand);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection(brand)
        .doc("data")
        .collection("user")
        .where("groupId", "==", property_id)
        .get()
        .then(res => {
          console.log("res.size", res.size);
          const housemates = res.docs.map(item => {
            return item.data();
          });
          resolve(housemates);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  static updatePropertyById(property_id, data) {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("property")
        .doc(`${property_id}`)
        .set(data, { merge: true });
    });
  }
  static addPropertytoProfile(uid, property, property_id, url) {
    let current = new Date().getTime();
    const { property_address } = property;
    const { first_address_line } = property_address;
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("landlord")
        .doc(uid)
        .get()
        .then(doc => {
          if (doc.exists) {
            let profile = doc.data();
            let properties = profile.properties ? profile.properties : [];
            let feed = profile.feed;
            let tokens = profile.tokens;
            let firstname = profile.firstname;
            if (!properties.length) {
              tokens = tokens + 50;
              let new_feed = "Added first property. Earned 50 tokens.";
              feed.push(new_feed);
            } else {
              let new_feed =
                firstname +
                " created a property <b>" +
                first_address_line +
                "</b> on <b>" +
                getDate() +
                "</b>.";
              feed.push(new_feed);
            }
            properties.push({
              id: property_id,
              created_time: current,
              img_url: url,
              property_address: property_address,
              rental_type: property.rental_type
            });
            firebase
              .firestore()
              .collection("landlord")
              .doc(uid)
              .set(
                { properties: properties, feed: feed, tokens: tokens },
                { merge: true }
              )
              .then(() => {
                resolve(properties);
              })
              .catch(err => {
                reject(err);
              });
          } else {
            resolve(false);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  static getMemberList = property_id => {
    return firebase
      .firestore()
      .collection("property")
      .doc(`${property_id}`)
      .get()
      .then(res => {
        let members = res.data().members;
        return members;
      });
  };
  static sendAddTenantRequest = async (
    phone,
    username,
    property_id,
    property_name
  ) => {
    let user_data = await Firebase.getUserProfile(phone);
    let user_profile = null;
    if (user_data) user_profile = user_data.data();
    let member = {
      username: username,
      phone: phone,
      accepted: false,
      property_id,
      property_name
    };
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("property")
        .doc(property_id)
        .get()
        .then(doc => {
          let members = [];
          if (doc.data().members) members = doc.data().members;
          members.push(member);
          firebase
            .firestore()
            .collection("property")
            .doc(property_id)
            .set({ members }, { merge: true });
          firebase
            .firestore()
            .collection("invitations")
            .add({ phone, property_name, property_id })
            .then(() => {
              resolve(user_profile);
            });
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static checkPhonenumberInvited(phone) {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("brand_invitations")
        .where("phonenumber", "==", phone)
        .limit(1)
        .get()
        .then(res => {
          if (res.size === 0) resolve(false);
          else resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  static createInvitation = (
    uid,
    phonenumber,
    brand,
    property_id,
    property_name,
    firstname
  ) => {
    firebase
      .firestore()
      .collection("brand_invitations")
      .add({ phonenumber, brand, property_id, property_name, firstname, uid });
  };
  static addTenant = (
    property_id,
    property_name,
    phonenumber,
    firstname,
    brand
  ) => {
    return new Promise((resolve, reject) => {
      const profile = {
        property_id,
        property_name,
        phonenumber,
        firstname,
        status: {
          kyc: "none",
          credit_rating: "none",
          right_to_rent: "none",
          employer: "none",
          accountant: "none",
          affordability: "none",
          rental_history: "none",
          rent_with_pets: "none",
          rent_without_a_deposit: "none",
          rent_a_serviced_home: "none"
        }
      };
      firebase
        .firestore()
        .collection(brand)
        .doc("data")
        .collection("user")
        .add(profile)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static register = profile => {
    console.log("profile", profile);
    let firstfeed = profile.firstname + " joined Landlord Care.";
    let secondfeed = "Earn £50 tokens by adding your first property.";
    profile.feed = [firstfeed, secondfeed];
    profile.tokens = 0;
    profile.properties = [];
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("landlord")
        .add(profile)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static updateProfileRole = (brand, uid, role) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection(brand)
        .doc("data")
        .collection("user")
        .doc(uid)
        .update({ renter_owner: role })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static isProfileExist = phonenumber => {
    console.log("phonenumber", phonenumber);
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("landlord")
        .where("phonenumber", "==", phonenumber)
        .limit(1)
        .get()
        .then(res => {
          if (res.size === 0) resolve(false);
          else resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  static writeAgencydata(agency_id, data) {
    let path = "agencies/" + agency_id;
    firebase
      .database()
      .ref(path)
      .set(data);
  }
  static getAgencyData(agency_id, callback) {
    let path = "agencies/" + agency_id;

    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        var res = null;

        if (snapshot.val()) {
          res = snapshot.val();
        }
        callback(res);
      });
  }
  static getAgencyByBrandID(brand, callback) {
    let path = "agencies";
    firebase
      .database()
      .ref(path)
      .orderByChild("brand")
      .equalTo(brand)
      .on("value", snapshot => {
        let result = [];
        result = Object.values(snapshot.val());
        callback(result);
      });
  }
  static approveAgency(uid) {
    let path = "agencies/" + uid;
    firebase
      .database()
      .ref(path)
      .update({ approved: true });
  }
  static getAllBrands = callback => {
    console.log("getAllBrands");
    let path = "brands";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        var res = [];
        if (snapshot.val()) {
          res = snapshot.val();
        }
        callback(res);
      });
  };
  static getBrandDataByID(brand, callback) {
    let path = "brands/" + brand;
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        callback(snapshot.val());
      });
  }
  static getBrandDataByName(brandName) {
    let path = "brands/";
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(path)
        .orderByChild("name")
        .equalTo(brandName)
        .on("value", snapshot => {
          let result = [];
          result = Object.values(snapshot.val());
          resolve(result[0]);
        });
    });
  }
  static getAllChatRequest(callback) {
    console.log("getAllChatRequest");
    let path = "livechat";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }
        callback(res);
      });
  }

  static getChats(room_id, ticket_id, callback) {
    console.log("getAllChat");
    let ticket = "" + ticket_id;
    let child_id = ticket.split(".").join("");
    let path = "livechat/" + room_id + "/tickets/" + child_id + "/content";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        var res = [];

        if (snapshot.val()) {
          res = snapshot.val();
        }

        callback(res);
      });
  }
  static getStatus(room_id, ticket_id, callback) {
    let ticket = "" + ticket_id;
    let child_id = ticket.split(".").join("");
    let path = "livechat/" + room_id + "/tickets/" + child_id + "/status";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        if (snapshot.val()) {
          callback(snapshot.val());
        }
      });
  }
  static addMessage(room_id, ticket_id, message, callback) {
    console.log("writedMessage", message);
    let ticket = "" + ticket_id;
    let child_id = ticket.split(".").join("");
    let path = "livechat/" + room_id + "/tickets/" + child_id + "/content";
    var newChild = firebase
      .database()
      .ref(path)
      .push();
    newChild.set(message, callback);
    firebase
      .database()
      .ref("livechat/" + room_id)
      .update({ unread: child_id });
  }
  static setTypeValue(room_id, ticket_id, value) {
    let ticket = "" + ticket_id;
    let child_id = ticket.split(".").join("");
    let path = "livechat/" + room_id + "/tickets/" + child_id;
    firebase
      .database()
      .ref(path)
      .update({ user_typing: value });
  }
  static getAgencyTyping(room_id, ticket_id, callback) {
    let ticket = "" + ticket_id;
    let child_id = ticket.split(".").join("");
    let path =
      "livechat/" + room_id + "/tickets/" + child_id + "/agency_typing";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        if (snapshot.val()) callback(snapshot.val());
        else callback(false);
      });
  }
  static getContractorTyping(room_id, ticket_id, callback) {
    let ticket = "" + ticket_id;
    let child_id = ticket.split(".").join("");
    let path =
      "livechat/" + room_id + "/tickets/" + child_id + "/contractor_typing";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        if (snapshot.val()) callback(snapshot.val());
        else callback(false);
      });
  }
  static getLandlordTyping(room_id, ticket_id, callback) {
    let ticket = "" + ticket_id;
    let child_id = ticket.split(".").join("");
    let path =
      "livechat/" + room_id + "/tickets/" + child_id + "/landlord_typing";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        if (snapshot.val()) callback(snapshot.val());
        else callback(false);
      });
  }
  static getAnswerfromTicket(ticket, callback) {
    let sub_path = "chatbot/answers";
    firebase
      .database()
      .ref(sub_path)
      .orderByChild("ticket")
      .equalTo(ticket)
      .once("value", snapshot => {
        let result = [];
        result = Object.values(snapshot.val());
        callback(result[0]);
      });
  }
  static updateTicketPolicy(room_id, ticket_id, policy) {
    let ticket = "" + ticket_id;
    let child_id = ticket.split(".").join("");
    let path = "livechat/" + room_id + "/tickets/" + child_id;
    firebase
      .database()
      .ref(path)
      .update({ policy: policy });
  }
  static updateTicketNote(room_id, ticket_id, note) {
    let ticket = "" + ticket_id;
    let child_id = ticket.split(".").join("");
    let path = "livechat/" + room_id + "/tickets/" + child_id;
    if (note)
      firebase
        .database()
        .ref(path)
        .update({ note: note });
  }
  static getTicketsById(id, callback) {
    let path = "livechat/" + id + "/tickets";
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        callback(snapshot.val());
      });
  }
  static async getTicketData(room_id, ticket_id, callback) {
    console.log("room_id", room_id);
    console.log("ticket_id", ticket_id);
    let ticket = "" + ticket_id;
    let child_id = ticket.split(".").join("");
    let path = "livechat/" + room_id + "/tickets/" + child_id;
    firebase
      .database()
      .ref(path)
      .on("value", snapshot => {
        callback(snapshot.val());
      });
  }
  static getAllTicket(callback) {
    let path = "livechat";
    firebase
      .database()
      .ref(path)
      .orderByChild("brand")
      .equalTo(null)
      .on("value", snapshot => {
        callback(snapshot.val());
      });
  }
  static getAllBoltRentersTicketDataByUID(uid) {
    let path = "livechat/" + uid;
    console.log("path", path);
    return new Promise((resolve, reject) => {
      firebase
        .database()
        .ref(path)
        .on("value", snapshot => {
          if (snapshot.val()) {
            console.log("snapshot.val()", snapshot.val());
            if (!snapshot.val().brand) resolve(snapshot.val());
            else resolve(false);
          } else resolve(false);
        });
    });
  }
  static acceptRequest(room_id, ticket_id) {
    let ticket = "" + ticket_id;
    let child_id = ticket.split(".").join("");
    let path = "livechat/" + room_id + "/tickets/" + child_id;
    return firebase
      .database()
      .ref(path)
      .update({ status: "Open" });
  }
  static terminateChat(room_id, ticket_id) {
    let ticket = "" + ticket_id;
    let child_id = ticket.split(".").join("");
    let path = "livechat/" + room_id + "/tickets/" + child_id;
    return firebase
      .database()
      .ref(path)
      .update({ status: "Closed", content: null });
  }
  static addBrandUrl(imagename, url) {
    let path = "brands/";
    firebase
      .database()
      .ref(path)
      .once("value", snapshot => {
        console.log(Object.values(snapshot.val()).length);
        let key = Object.values(snapshot.val()).length;
        key.toString();
        path = "brands/" + key;
        firebase
          .database()
          .ref(path)
          .set({ logo: url, name: imagename });
      });
  }
  static addFiletoBrand(imagename, content, callback) {
    console.log("content in fb", content);
    let storageRef = this.storage().ref(`/brand_logo/${imagename}`);
    storageRef
      .putString(content, "base64")
      .then(function (snap) {
        storageRef
          .getDownloadURL()
          .then(function (url) {
            Firebase.addBrandUrl(imagename, url);
            callback(url);
          })
          .catch(function (error) {
            callback("error");
            console.log(error.message);
          });
      })
      .catch(function (error) {
        callback(error.message);
      });
  }
  static updateLandlordData = (uid, data) => {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("landlord")
        .doc(`${uid}`)
        .set(data, { merge: true })
        .then(() => {
          firebase
            .firestore()
            .collection("landlord")
            .doc(`${uid}`)
            .get()
            .then(res => {
              resolve(res.data());
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}
Firebase.initialize();
export default Firebase;

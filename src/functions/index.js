const axios = require("axios");
const HOME_TICKETS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "19",
  "39"
];
export const isTicketforLandlord = ticket_id => {
  let ticket_str = "" + ticket_id;
  let ar = ticket_str.split(".");
  let prefix = ar[0];
  if (HOME_TICKETS.includes(prefix)) return true;
  else return false;
};
var getMonth = month => {
  switch (month) {
    case "01":
      return "January";
    case "02":
      return "February";
    case "03":
      return "March";
    case "04":
      return "April";
    case "05":
      return "May";
    case "06":
      return "June";
    case "07":
      return "July";
    case "08":
      return "August";
    case "09":
      return "September";
    case "10":
      return "October";
    case "11":
      return "November";
    case "12":
      return "December";
    default:
      return "January";
  }
};
export const getStringfromSeconds = function(time) {
  var t = new Date(parseInt(time));
  var dd = String(t.getDate()).padStart(2, "0");
  var mm = String(t.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = t.getFullYear();
  t = dd + "." + mm + "." + yyyy.toString().substr(2, 2);
  return t;
};
export const getDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + "." + mm + "." + yyyy.toString().substr(2, 2);
  return today;
};
export const isMemberofProperty = (member_list, phonenumber) => {
  let flag = false;
  member_list.map(item => {
    if (item.phonenumber === phonenumber) flag = true;
  });
  return flag;
};
export const sendNotification = async (player_ids, content) => {
  let contents = { en: content };
  try {
    let result = await axios.post(
      "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/sendNotification",
      {
        player_ids: player_ids,
        content: contents
      }
    );
    return result;
  } catch (err) {
    throw Error(err);
  }
};

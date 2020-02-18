export const doSMS = async (phoneNumber, pin) => {
  try {
    let response = await fetch(
      `https://apricot-mole-2227.twil.io/rentpass_sms?phoneNumber=${phoneNumber}&pin=${pin}`,
      {
        method: "GET"
      }
    );
    let res = await response.json();
    return res;
  } catch (err) {
    return err;
  }
};
export const clearZero = function(str) {
  if (str.charAt(0) === "0") str = str.replace("0", "");
  return str;
};
export function isDateValidate(date) {
  if (
    date &&
    /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(
      date
    )
  )
    return true;
  else return false;
}
export const getAddresses = async postcode => {
  try {
    let response = await fetch(
      `https://api.getAddress.io/find/${postcode}?api-key=TAOlpULvxkm8OUK_tN6RzA21029`,
      {
        method: "GET"
      }
    );
    let res = await response.json();
    return res;
  } catch (err) {
    return err;
  }
};
export const sendInvitation = async (
  phoneNumber,
  username,
  property_name,
  brand
) => {
  try {
    let response = await fetch(
      `https://apricot-mole-2227.twil.io/property_invite?phoneNumber=${phoneNumber}&username=${username}&property_name=${property_name}&brand_name=${brand}`,
      {
        method: "GET"
      }
    );
    let res = await response.json();
    return res;
  } catch (err) {
    return err;
  }
};

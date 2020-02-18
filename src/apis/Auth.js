export const getToken = async (
  grant_type,
  client_id,
  client_secret,
  username,
  password
) => {
  try {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    console.log("grant_type", grant_type);
    console.log("client_id", client_id);
    console.log("client_secret", client_secret);
    console.log("username", username);
    console.log("password", password);
    return fetch(
      proxyurl +
        `https://test.salesforce.com/services/oauth2/token?grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}&username=${username}&password=${password}`,
      {
        method: "post"
      }
    )
      .then(response => response.json())
      .catch(() =>
        console.log("Can’t access url response. Blocked by browser?")
      );
  } catch (err) {
    return err;
  }
};
export const signUp = async (
  firstname,
  lastname,
  email,
  password,
  postcode,
  street,
  city,
  phone,
  access_token
) => {
  try {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let token = "Bearer " + access_token;
    const body = JSON.stringify({
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: password,
      phone: phone,
      postcode: postcode,
      street: street,
      city: city
    });
    console.log("body", body);
    return fetch(
      proxyurl +
        "https://pin--procopy.my.salesforce.com/services/apexrest/v2/CreateLandlordUser",
      {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: body
      }
    )
      .then(res => res.json())
      .catch(err => {
        console.log("Error", err);
      });

    //let json = await res.json();
    // return json;
  } catch (err) {
    console.log("error_api", err);
    //console.log("error", err);
    return err;
  }
};
export const logIn = async (
  response_type,
  client_id,
  redirect_uri,
  scope,
  display
) => {
  try {
    console.log("response_type", response_type);
    console.log("client_id", client_id);
    console.log("redirect_uri", redirect_uri);
    console.log("scope", scope);
    console.log("display", display);
    return fetch(
      `https://dev-pin.cs106.force.com/members/services/oauth2/authorize?response_type=${response_type}&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&display=${display}`,
      {
        method: "get"
      }
    );
  } catch (err) {
    return err;
  }
};

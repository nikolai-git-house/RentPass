import axios from "axios";

const ADMIN_TOKEN = "24nh9ljk0a23YlkJUlweF2ci5jseCqpie29si";

export function attemptSignIn(data) {
  const apiUrl = process.env.REACT_APP_API_URL;
  // return axios.request({
  // 	url: `${apiUrl}/token/`,
  // 	method: 'POST',
  // 	withCredentials: true,
  // 	headers: {
  // 		Accept: 'application/json',
  // 		'Content-Type': 'application/json',
  // 	},
  // 	data,
  // });
  return {
    access: "Access",
    refresh: "Refresh",
  };
}

export function getCurrentUserDetail(token) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const header = `Bearer ${token}`;
  return axios.request({
    url: `${apiUrl}/users/me/`,
    method: "GET",
    withCredentials: true,
    headers: {
      Accept: "application/json",
      Authorization: header,
    },
  });
}

export const inviteTasker = async (firstName, brandName, phoneNumber, uid) => {
  try {
    let url = "";
    url = `https://apricot-mole-2227.twil.io/invite-tasker?phoneNumber=${phoneNumber}&firstName=${firstName}&brandName=${brandName}&token=${uid}`;
    let response = await fetch(url, {
      method: "GET",
    });
    let res = await response.json();
    return res;
  } catch (err) {
    return err;
  }
};

export const removeTaskerFromAuth = (uid) => {
  return axios.post(
    "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/ecosystem-removeUserById",
    {
      uid,
      token: ADMIN_TOKEN,
    }
  );
};

export const createRetailerLeadAdmin = (email, password) => {
  return axios.post(
    "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/ecosystem-createUser",
    {
      email,
      password,
      token: ADMIN_TOKEN,
    }
  );
};

export const sendResetPassword = (email, firstName, retailerName, password) => {
  return axios.post(
    "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/ecosystem-sendRestPasswordEmail",
    {
      to: email,
      password,
      firstName,
      retailerName,
      token: ADMIN_TOKEN,
    }
  );
};

export const sendUmbrellaPasswordEmail = (email, firstName, brand, password) => {
  return axios.post(
    "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/ecosystem-sendEcosystemAdminRestPasswordEmail",
    {
      to: email,
      password,
      firstName,
      brand,
      token: ADMIN_TOKEN,
    }
  );
};

export const sendInvestorResetPasswordEmail = (email, firstName, password) => {
  return axios.post(
    "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/ecosystem-sendInvestorPasswordEmail",
    {
      to: email,
      password,
      firstName,
      token: ADMIN_TOKEN,
    }
  );
};

export const updateRetailerAdminLead = (uid, email) => {
  return axios.post(
    "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/ecosystem-updateUser",
    {
      uid,
      email,
      token: ADMIN_TOKEN,
    }
  );
};

export const getUsers = (ids) => {
  return axios.post(
    "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/ecosystem-getUsers",
    {
      ids,
      token: ADMIN_TOKEN,
    }
  );
};

export const resetPassword = (uid, password) => {
  return axios.post(
    "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/ecosystem-resetPassword",
    {
      uid,
      password,
      token: ADMIN_TOKEN,
    }
  );
};

const axios = require("axios");
export const createToken = async (number, exp_month, exp_year, cvc) => {
  try {
    let result = await axios.post(
      "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/createToken",
      {
        number: number,
        exp_month: exp_month,
        exp_year: exp_year,
        cvc: cvc
      }
    );
    if (result.status === 200) {
      return result;
    }
  } catch (err) {
    throw new Error(err.response.data);
  }
};
export const createCustomer = async (description, email, token) => {
  try {
    let result = await axios.post(
      "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/createCustomer",
      {
        description: description,
        email: email,
        token: token
      }
    );
    if (result.status === 200) {
      return result;
    }
  } catch (err) {
    throw new Error(err.response.data);
  }
};
export const createPlan = async (amount, product) => {
  try {
    let result = await axios.post(
      "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/createPlan",
      {
        amount: amount,
        product: product
      }
    );
    if (result.status === 200) {
      return result;
    }
  } catch (err) {
    throw new Error(err.response.data);
  }
};
export const createCharge = async (customer, amount) => {
  try {
    let result = await axios.post(
      "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/createCharge",
      {
        customer: customer,
        amount: amount
      }
    );
    if (result.status === 200) {
      return result;
    }
  } catch (err) {
    throw new Error(err.response.data);
  }
};
export const createSubscription = async (customer, plan) => {
  try {
    let result = await axios.post(
      "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/createSubscription",
      {
        customer: customer,
        plan: plan
      }
    );
    if (result.status === 200) {
      return result;
    }
  } catch (err) {
    throw Error(err);
  }
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

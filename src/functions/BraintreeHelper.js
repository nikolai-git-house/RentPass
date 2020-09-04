const axios = require("axios");

export const braintreeToken = async () => {
  try {
    let requestUrl =
      "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/braintree-clientToken";
    // let requestUrl = 'http://localhost:5000/boltconcierge-2f0f9/us-central1/braintreeToken';
    let result = await axios.post(requestUrl, {
      environment: process.env.REACT_APP_ENVIRONMENT,
    });
    if (result.status === 200) {
      // console.log('//// ' + JSON.stringify(result.data));
      return result.data;
    } else {
      return result;
    }
  } catch (err) {
    return err;
  }
};

export const braintreeCheckout = async (paymentMethodToken, amount) => {
  try {
    let requestUrl =
      "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/braintree-checkout";
    // let requestUrl = 'http://localhost:5000/boltconcierge-2f0f9/us-central1/braintreeToken';
    let result = await axios.post(requestUrl, {
      environment: process.env.REACT_APP_ENVIRONMENT,
      payment_method_token: paymentMethodToken,
      amount: amount,
    });
    if (result.status === 200) {
      // console.log('//// ' + JSON.stringify(result.data));
      return result.data;
    } else {
      return result;
    }
  } catch (err) {
    return err;
  }
};

export const braintreeCreateCustomer = async (
  customerId,
  paymentMethodNonce
) => {
  try {
    let requestUrl =
      "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/braintree-createCustomer";
    let result = await axios.post(requestUrl, {
      environment: process.env.REACT_APP_ENVIRONMENT,
      payment_method_nonce: paymentMethodNonce,
      customer_id: customerId,
    });
    if (result.status === 200) {
      return result.data;
    } else {
      return result;
    }
  } catch (err) {
    return err;
  }
};

export const braintreeAddPaymentMethod = async (
  customerId,
  paymentMethodNonce
) => {
  try {
    let requestUrl =
      "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/braintree-addPaymentMethodToCustomer";
    let result = await axios.post(requestUrl, {
      environment: process.env.REACT_APP_ENVIRONMENT,
      payment_method_nonce: paymentMethodNonce,
      customer_id: customerId,
    });
    if (result.status === 200) {
      return result.data;
    } else {
      return result;
    }
  } catch (err) {
    return err;
  }
};

export const braintreeRemovePaymentMethod = async (paymentMethodToken) => {
  try {
    let requestUrl =
      "https://us-central1-boltconcierge-2f0f9.cloudfunctions.net/braintree-removePaymentMethod";
    let result = await axios.post(requestUrl, {
      environment: process.env.REACT_APP_ENVIRONMENT,
      payment_method_token: paymentMethodToken,
    });
    if (result.status === 200) {
      return result.data;
    } else {
      return result;
    }
  } catch (err) {
    return err;
  }
};

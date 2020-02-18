import { signup_botMessages, chatbot_botMessages } from "../Constants/messages";

export const getTimeoutValue = () => {
  return 1000;
};

export const getBetweenTimeoutValue = () => {
  return 2500;
};

export const getInputTimeoutValue = () => {
  return 1500;
};

export const getBotMessageGroup = type => {
  switch (type) {
    case "signup_botMessages":
      console.log("botMessages", signup_botMessages);
      return signup_botMessages.shift();
    case "chatbot_botMessages":
      console.log("botMessages", chatbot_botMessages);
      return chatbot_botMessages.shift();
    default:
      return signup_botMessages.shift();
  }
};

export const addBotMessageGroup = (type, msgGroup) => {
  switch (type) {
    case "signup_botMessages":
      return signup_botMessages.unshift(msgGroup);
    case "chatbot_botMessages":
      return chatbot_botMessages.unshift(msgGroup);
    default:
      return signup_botMessages.unshift(msgGroup);
  }
};

export const getBotMessage = message => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(message);
    }, getTimeoutValue(message.message));
  });
};

import {
  signup_userMessages,
  chatbot_userMessages
} from "../Constants/messages";

export const getUserMessage = type => {
  switch (type) {
    case "signup_botMessages":
      return signup_userMessages.shift();
    case "chatbot_botMessages":
      return chatbot_userMessages.shift();
    default:
      return signup_userMessages.shift();
  }
};
export const addUserMessage = (type, message) => {
  switch (type) {
    case "signup_botMessages":
      signup_userMessages.unshift(message);
      break;
    case "chatbot_botMessages":
      chatbot_userMessages.unshift(message);
      break;
    default:
      signup_userMessages.unshift(message);
  }
};

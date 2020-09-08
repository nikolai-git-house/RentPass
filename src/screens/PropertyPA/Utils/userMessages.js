import { userMessages } from "../Constants/messages";

export const getUserMessage = () => {
  return userMessages.shift();
};
export const addUserMessage = message => {
  userMessages.unshift(message);
};
export const addUserMessages = messages => {
  console.log("originalUser", userMessages);
  messages.map(item => {
    return userMessages.push(item);
  });
  console.log("userMessages", userMessages);
};

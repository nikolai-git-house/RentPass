import { userMessages } from "../Constants/messages";

export const getUserMessage = () => {
  console.log("originalUser", userMessages);
  return userMessages.shift();
};
export const addUserMessage = (message) => {
  userMessages.unshift(message);
};
export const addUserMessages = (messages) => {
  console.log("originalUser", userMessages);
  messages.forEach((item) => {
    userMessages.push(item);
  });
  console.log("userMessages", userMessages);
};
export const clearUserMessages = ()=>{
  userMessages.length = 0;
}
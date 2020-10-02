import { botMessages } from "../Constants/messages";

export const getTimeoutValue = () => {
  return 1000;
};

export const getBetweenTimeoutValue = () => {
  return 2500;
};

export const getInputTimeoutValue = () => {
  return 1500;
};

export const getBotMessageGroup = () => {
  console.log("originalbot", botMessages);
  return botMessages.shift();
};

export const addBotMessageGroup = msgGroup => {
  return botMessages.unshift(msgGroup);
};

export const getRemainingMessages = () => {
  return botMessages.length;
};
export const getBotMessage = message => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(message);
    }, getTimeoutValue(message.message));
  });
};
export const addBotMessages = messages => {
  console.log("originalbot", botMessages);
  messages.map(item => {
    return botMessages.push(item);
  });
  console.log("botMessages", botMessages);
};
export const clearBotMessages = ()=>{
  botMessages.length = 0;
}
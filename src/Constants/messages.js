// export const serverUrl = 'http://api.flightdrop.co/';
export const serverUrl = "https://flightdrop-backend-jack.herokuapp.com/";

export const botMessages = [
  
];

export const userMessages = [

];
export const registration_botMessages = [
  [
    {
      type: "bot",
      message: "May I take your first name please?",
    },
  ],
  [
    {
      type: "bot",
      message: "What is your date of birth?",
    },
  ],

  [
    {
      type: "bot",
      message: "Perfect. I need to verify your mobile number now please?",
    },
  ],
  [
    {
      type: "bot",
      message: "Please confirm the sms code received.",
    },
  ],
];
export const registration_userMessages = [
  {
    type: "user",
    inputType: "input",
    key: "firstname",
    placeholder: "First Name Only",
    isNext: true,
  },
  {
    type: "user",
    inputType: "date",
    key: "dob",
  },
  {
    type: "user",
    inputType: "input",
    placeholder: "",
    key: "phone",
  },
  {
    type: "user",
    inputType: "input",
    placeholder: "6-digits",
    key: "sms",
  },
];
export const registered_botMessages = [
  [
    {
      type: "bot",
      message: "Ok. I need to verify your mobile number now please?",
    },
  ],
  [
    {
      type: "bot",
      message: "Please confirm the sms code received.",
    },
  ],
];
export const registered_userMessages = [
  {
    type: "user",
    inputType: "input",
    placeholder: "",
    key: "phone",
  },
  {
    type: "user",
    inputType: "input",
    placeholder: "6-digits",
    key: "sms",
  },
];

// export const serverUrl = 'http://api.flightdrop.co/';
export const serverUrl = "https://flightdrop-backend-jack.herokuapp.com/";

export const signup_botMessages = [
  [
    {
      type: "bot",
      message: "Hello I'm your new personal property concierge... "
    },
    {
      type: "bot",
      message:
        "I'll handle all the hassle so you can sit back with a clear, stronger yield."
    },
    {
      type: "bot",
      message:
        "Creating an account takes a few minutes and you'll unlock tokens to spend."
    },
    {
      type: "bot",
      message:
        "Once your portal is created, I'll get to work in saving you time and money."
    },
    {
      type: "bot",
      message: "I only ask for your first name, for now."
    }
  ],
  [
    {
      type: "bot",
      message: "May I have your mobile number, so I can create your account?"
    }
  ],
  [
    {
      type: "bot",
      message: "Please confirm the sms code received."
    }
  ],
  [
    {
      type: "bot",
      message: "Great that's you verified."
    },
    {
      type: "bot",
      message: "Please let me know how you manage your properties?"
    }
  ],
  [
    {
      type: "bot",
      message: "You are fully activated."
    }
  ]
];

export const signup_userMessages = [
  {
    type: "user",
    inputType: "input",
    key: "firstname",
    placeholder: "Enter your First Name only.",
    isNext: true
  },
  {
    type: "user",
    inputType: "input",
    placeholder: "",
    key: "phone"
  },

  {
    type: "user",
    inputType: "input",
    placeholder: "6-digits",
    key: "sms"
  },
  {
    type: "user",
    inputType: "toggleButton",
    options: [
      {
        text: "Self manage",
        value: "Self Manage"
      },
      {
        text: "High street agent",
        value: "High Street Agent"
      },
      {
        text: "online agent",
        value: "Online Agent"
      }
    ],
    key: "manageType",
    isActivate: true
  },
  {
    type: "user",
    inputType: "static",
    register: true,
    message: "Get Started"
  }
];
export const chatbot_botMessages = [];

export const chatbot_userMessages = [];

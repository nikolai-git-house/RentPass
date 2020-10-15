import { createReducer } from "reduxsauce";

export const initialState = {
  profile: null,
  uid: "",
  users: [],
  brand: {},
  housemates: [],
  properties: [],
  groups: []
};

const saveProfileReducer = (state, action) => ({
  ...state,
  profile: action.profile
});
const savePropertiesReducer = (state, action) => ({
  ...state,
  properties: action.properties
});
const saveGroupsReducer = (state, action) => ({
  ...state,
  groups: action.groups
});
const saveUIDReducer = (state, action) => ({
  ...state,
  uid: action.uid
});
const saveBrandReducer = (state, action) => ({
  ...state,
  brand: action.brand
});
const saveUsersReducer = (state, action) => ({
  ...state,
  users: action.users
});

const saveHousematesReducer = (state, action) => ({
  ...state,
  housemates: action.housemates
});

const removeAllReducer = (state, action) => ({
  ...state,
  profile: null,
  properties: [],
  groups: [],
  renters: [],
  brand: {},
  housemates: [],
  uid: null
});
const actionHandlers = {
  SAVE_PROFILE: saveProfileReducer,
  SAVE_PROPERTIES: savePropertiesReducer,
  SAVE_GROUPS: saveGroupsReducer,
  SAVE_UID: saveUIDReducer,
  SAVE_USERS: saveUsersReducer,
  SAVE_HOUSEMATES: saveHousematesReducer,
  SAVE_BRAND: saveBrandReducer,
  REMOVE: removeAllReducer
};
export default createReducer(initialState, actionHandlers);

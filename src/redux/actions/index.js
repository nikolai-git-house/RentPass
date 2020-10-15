/**
 * Author: Moses Adekunle Esan for E&M Digital
 * Date: 6/29/2017
 * Project: React Native Redux Quotes App with CRUD operations
 */

"use strict";
export const SAVE_PROFILE = "SAVE_PROFILE";
export const SAVE_UID = "SAVE_UID";
export const SAVE_USERS = "SAVE_USERS";
export const REMOVE = "REMOVE";
export const SAVE_RENTERS = "SAVE_RENTERS";
export const SAVE_HOUSEMATES = "SAVE_HOUSEMATES";
export const SAVE_PROPERTIES = "SAVE_PROPERTIES";
export const SAVE_BRAND = "SAVE_BRAND";
export const SAVE_GROUPS = "SAVE_GROUPS";

export const saveProfile = profile => ({
  type: SAVE_PROFILE,
  profile: profile
});
export const saveProperties = properties => ({
  type: SAVE_PROPERTIES,
  properties: properties
});
export const saveGroups = groups => ({
  type: SAVE_GROUPS,
  groups: groups
})
export const saveUID = uid => ({ type: SAVE_UID, uid: uid });
export const saveRenters = renters => ({
  type: SAVE_RENTERS,
  renters: renters
});
export const saveUsers = users => ({
  type: SAVE_USERS,
  users: users
});
export const saveBrand = brand => ({
  type: SAVE_BRAND,
  brand: brand
});
export const saveHousemates = housemates => ({
  type: SAVE_HOUSEMATES,
  housemates: housemates
});
export const removeAll = () => ({
  type: REMOVE
});

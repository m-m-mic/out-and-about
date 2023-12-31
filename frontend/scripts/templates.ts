import { AccountType, AccountValidatorType, ActivityType, ActivityValidatorType } from "./types";

// Templates for activity, account and validators

export const registrationTemplate: AccountType = {
  username: "",
  email: "",
  password: "",
  categories: [],
  saved_activities: [],
  planned_activities: [],
};

export const registrationValidatorTemplate: AccountValidatorType = {
  username: undefined,
  email: undefined,
  password: undefined,
  password_repeat: undefined,
  categories: true,
  saved_activities: true,
  planned_activities: true,
};

export const newActivityTemplate: ActivityType = {
  name: "",
  categories: [],
  date: new Date().valueOf() + 86400000,
  location: {
    type: "Point",
    coordinates: [11.576124, 48.137154],
  },
  information_text: "",
  maximum_participants: 0,
  only_logged_in: false,
  participants: [],
};

export const createActivityValidatorTemplate: ActivityValidatorType = {
  name: undefined,
  location: true,
  maximum_participants: undefined,
  categories: false,
  information_text: true,
  date: true,
};

export const editActivityValidatorTemplate: ActivityValidatorType = {
  name: true,
  location: true,
  maximum_participants: true,
  categories: true,
  information_text: true,
  date: true,
};

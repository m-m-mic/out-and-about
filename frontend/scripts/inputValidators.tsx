import { Dispatch, SetStateAction } from "react";
import { AccountType, ActivityType, ActivityValidatorType } from "./types";

export const emailPattern: RegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const numberPattern = /^[0-9]*$/;
const specialCharacterPattern: RegExp = /^[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\d]*$/g;

// Validates email using regex pattern
export const setEmailInput = (
  input: string,
  data: AccountType,
  setData: Dispatch<SetStateAction<AccountType>>,
  validation: object,
  setValidation: Dispatch<SetStateAction<any>>,
  setEmailError: Dispatch<SetStateAction<string>>
) => {
  if (input.match(emailPattern)) {
    setData({ ...data, email: input });
  } else {
    setValidation({ ...validation, email: false });
    setEmailError("Eingabe entspricht keiner validen E-Mail.");
  }
};

// Validates username using regex pattern
export const setUsernameInput = (
  input: string,
  data: AccountType,
  setData: Dispatch<SetStateAction<AccountType>>,
  validation: object,
  setValidation: Dispatch<SetStateAction<any>>
) => {
  if (input.length >= 3 && input.length <= 20 && !input.match(specialCharacterPattern)) {
    setData({ ...data, username: input });
    setValidation({ ...validation, username: true });
  } else {
    setValidation({ ...validation, username: false });
  }
};

// Password must be between 8 and 20 characters long
export const setPasswordInput = (
  input: string,
  data: AccountType,
  setData: Dispatch<SetStateAction<AccountType>>,
  validation: object,
  setValidation: Dispatch<SetStateAction<any>>
) => {
  if (input.length >= 8 && input.length <= 30) {
    setData({ ...data, password: input });
    setValidation({ ...validation, password: true, password_repeat: false });
  } else {
    setValidation({ ...validation, password: false });
  }
};

// Repeated password must match initial password
export const setPasswordRepeatInput = (
  input: string,
  data: AccountType,
  validation: object,
  setValidation: Dispatch<SetStateAction<any>>
) => {
  if (input === data.password) {
    setValidation({ ...validation, password_repeat: true });
  } else {
    setValidation({ ...validation, password_repeat: false });
  }
};

export const setNameInput = (
  input: string,
  data: ActivityType,
  setData: Dispatch<SetStateAction<ActivityType | undefined>>,
  validation: ActivityValidatorType,
  setValidation: Dispatch<SetStateAction<ActivityValidatorType>>
) => {
  if (input.length >= 1 && input.length <= 30 && !input.match(specialCharacterPattern)) {
    setData({ ...data, name: input });
    return setValidation({ ...validation, name: true });
  } else {
    return setValidation({ ...validation, name: false });
  }
};

export const setMaximumParticipantsInput = (
  input: string,
  data: ActivityType,
  setData: Dispatch<SetStateAction<ActivityType | undefined>>,
  validation: ActivityValidatorType,
  setValidation: Dispatch<SetStateAction<ActivityValidatorType>>,
  currentConfirmations: number
) => {
  if (Number(input) >= currentConfirmations && Number(input) >= 1 && Number(input) <= 100 && input.match(numberPattern)) {
    setData({ ...data, maximum_participants: Number(input) });
    return setValidation({ ...validation, maximum_participants: true });
  } else {
    return setValidation({ ...validation, maximum_participants: false });
  }
};

export const setInformationTextInput = (
  input: string,
  data: ActivityType,
  setData: Dispatch<SetStateAction<ActivityType | undefined>>,
  validation: ActivityValidatorType,
  setValidation: Dispatch<SetStateAction<ActivityValidatorType>>
) => {
  if (!input) {
    setData({ ...data, information_text: input });
    return setValidation({ ...validation, information_text: true });
  }
  if (input.length <= 300) {
    setData({ ...data, information_text: input });
    return setValidation({ ...validation, information_text: true });
  } else {
    return setValidation({ ...validation, information_text: false });
  }
};

export const setDateInput = (
  input: Date,
  data: ActivityType,
  setData: Dispatch<SetStateAction<ActivityType | undefined>>,
  validation: ActivityValidatorType,
  setValidation: Dispatch<SetStateAction<ActivityValidatorType>>
) => {
  const currentDate = new Date();
  if (input.valueOf() > currentDate.valueOf()) {
    setData({ ...data, date: input.valueOf() });
    return setValidation({ ...validation, date: true });
  } else {
    setData({ ...data, date: input.valueOf() });
    return setValidation({ ...validation, date: false });
  }
};

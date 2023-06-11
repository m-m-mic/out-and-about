import { Dispatch, SetStateAction } from "react";
import { Account } from "./types";

const emailPattern: RegExp =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const specialCharacterPattern: RegExp = /^[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\d]*$/g;

// Validates email using regex pattern
export const setEmailInput = (
  input: string,
  data: Account,
  setData: Dispatch<SetStateAction<Account>>,
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
  data: Account,
  setData: Dispatch<SetStateAction<Account>>,
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
  data: Account,
  setData: Dispatch<SetStateAction<Account>>,
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
  data: Account,
  validation: object,
  setValidation: Dispatch<SetStateAction<any>>
) => {
  if (input === data.password) {
    setValidation({ ...validation, password_repeat: true });
  } else {
    setValidation({ ...validation, password_repeat: false });
  }
};

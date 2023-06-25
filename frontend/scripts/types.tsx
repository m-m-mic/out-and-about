export type AuthState = "RESTORE_CREDENTIALS" | "SIGN_IN" | "SIGN_OUT";

export interface AuthType {
  signIn: Function;
  signOut: Function;
  signUp: Function;
}

export type AccountType = {
  _id?: string;
  username: string;
  email: string;
  password: string;
  categories: string[];
  saved_activities: any[];
  planned_activities: any[];
};

export type CategoryType = {
  _id: string;
  name: string;
};

export type ActivityType = {
  _id?: string;
  name: string;
  categories: CategoryType[];
  date: number;
  information_text: string;
  location: GeoType;
  organizer?: AccountType | string;
  maximum_participants: number;
  only_logged_in: boolean;
  participants: AccountType[];
  distance?: number;
};

type GeoType = {
  type: string;
  coordinates: number[];
};

export type ActivityValidatorType = {
  name: boolean | undefined;
  location: boolean | undefined;
  maximum_participants: boolean | undefined;
  categories: boolean | undefined;
  information_text: boolean | undefined;
  date: boolean | undefined;
};

export type AccountValidatorType = {
  username: boolean | undefined;
  email: boolean | undefined;
  password: boolean | undefined;
  password_repeat: boolean | undefined;
  categories: boolean | undefined;
  saved_activities: boolean | undefined;
  planned_activities: boolean | undefined;
};

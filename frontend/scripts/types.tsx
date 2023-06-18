export type AuthState = "RESTORE_CREDENTIALS" | "SIGN_IN" | "SIGN_OUT";

export interface AuthType {
  signIn: Function;
  signOut: Function;
  signUp: Function;
}

export type Account = {
  username: string;
  email: string;
  password: string;
  categories: string[];
  saved_activities: any[];
  planned_activities: any[];
};

export type Category = {
  _id: string;
  name: string;
};

export type ActivityType = {
  _id: string;
  name: string;
  categories: Category[];
  date: number;
  active: boolean;
  information_text: string;
  location: GeoType;
  organizer: Account;
  maximum_participants: number;
  only_logged_in: boolean;
  participants: Account[];
};

type GeoType = {
  type: string;
  coordinates: number[];
};

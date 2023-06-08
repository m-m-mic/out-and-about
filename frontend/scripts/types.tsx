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
  categories: Category[];
  saved_activities: any[];
  planned_activities: any[];
};

export type Category = {
  id: string;
  name: string;
};

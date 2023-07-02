import { NavigatorScreenParams } from "@react-navigation/native";

export type ActivityStackType = {
  Activity: { id: string; fromCreated?: boolean };
  EditActivity: { id: string };
  CreateActivity: undefined;
  Participants: { id: string; name: string };
};

export type OverviewStackType = {
  Overview: undefined;
  ActivityStack: NavigatorScreenParams<ActivityStackType>;
};

export type SearchStackType = {
  Search: undefined;
  ActivityStack: NavigatorScreenParams<ActivityStackType>;
};

export type ProfileStackType = {
  Profile: undefined;
  ActivityStack: NavigatorScreenParams<ActivityStackType>;
  Settings: undefined;
};

export type LoggedOutStackType = {
  LandingPage: undefined;
  Register: undefined;
  ChoosePreferences: { data: AccountType };
  Login: undefined;
};

export type LoggedInStackType = {
  OverviewStack: NavigatorScreenParams<OverviewStackType>;
  SearchStack: NavigatorScreenParams<SearchStackType>;
  ProfileStack: NavigatorScreenParams<ProfileStackType>;
};

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
  saved_activities: ActivityType[];
  planned_activities: ActivityType[];
};

export type CategoryType = {
  _id: string;
  name: string;
};

export type ActivityType = {
  _id?: string;
  name: string;
  categories: Array<CategoryType>;
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
  type: "Point";
  coordinates: [number, number];
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

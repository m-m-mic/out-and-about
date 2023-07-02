// TypeScript Interface mit allen Typen für values in einer Aktivität
import { Document, PopulatedDoc } from "mongoose";

export interface ActivityType {
  _id: string;
  name: string;
  categories: PopulatedDoc<CategoryType & Document>[];
  date: number;
  maximum_participants: number;
  information_text: string;
  location: GeoType;
  only_logged_in: boolean;
  organizer: PopulatedDoc<AccountType & Document>;
  participants: PopulatedDoc<AccountType & Document>[];
  distance?: number;
}

export interface AccountType {
  _id: string;
  name: string;
  email: string;
  password: string;
  categories: PopulatedDoc<CategoryType & Document>[];
  saved_activities: PopulatedDoc<ActivityType & Document>[];
  planned_activities: PopulatedDoc<ActivityType & Document>[];
}

export interface CategoryType {
  _id: string;
  name: string;
  activities: PopulatedDoc<ActivityType & Document>[];
}

interface GeoType {
  type: string;
  coordinates: number[];
}

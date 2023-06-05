// TODO: Interface an neue Struktur von Aktivität anpassen (GeoJSON)
// TypeScript Interface mit allen Typen für values in einer Aktivität
export interface ActivityType {
  _id: string;
  name: string;
  categories: PreselectOption[];
  date: number;
  active: boolean;
  maximum_participants: number;
  information_text: string;
  location: GeoType;
  only_logged_in: boolean;
  organizer: AccountType[];
  participants: AccountType[];
}

export interface AccountType {
  _id: string;
  name: string;
  email: string;
}

interface PreselectOption {
  _id: string;
  name: string;
}

interface GeoType {
  type: string;
  coordinates: number[];
}

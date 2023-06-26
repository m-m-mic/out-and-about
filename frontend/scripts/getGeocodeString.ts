import { reverseGeocodeAsync } from "expo-location";

export async function getGeocodeString(longitude: number, latitude: number): Promise<string | undefined> {
  const geocodeLocation = await reverseGeocodeAsync({
    latitude: latitude,
    longitude: longitude,
  });
  if (geocodeLocation.length > 0 && geocodeLocation[0].postalCode && geocodeLocation[0].city) {
    if (geocodeLocation[0].street) {
      return `${geocodeLocation[0].street} ${geocodeLocation[0].streetNumber}, ${geocodeLocation[0].postalCode} ${geocodeLocation[0].city}`;
    } else {
      return `${geocodeLocation[0].postalCode} ${geocodeLocation[0].city}`;
    }
  } else {
    return undefined;
  }
}

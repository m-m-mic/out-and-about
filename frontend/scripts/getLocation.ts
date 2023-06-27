import * as Location from "expo-location";
import { Platform } from "react-native";

export const getLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission to access location was denied");
    return null;
  }
  // Unfortunately it seems like getCurrentPositionAsync is bugged and simply doesn't work sometimes:
  // https://github.com/expo/expo/issues/15478
  return await Location.getCurrentPositionAsync({
    accuracy: Platform.OS === "android" ? Location.Accuracy.Low : Location.Accuracy.Lowest,
  });
};

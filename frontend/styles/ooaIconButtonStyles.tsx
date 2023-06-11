import { StyleSheet } from "react-native";
import { appColors } from "./StyleAttributes";

export const ooaIconButtonStyles = StyleSheet.create({
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 200,
  },
  ghost: {},
  transparent: { backgroundColor: "rgba(0,0,0,0.4)" },
});

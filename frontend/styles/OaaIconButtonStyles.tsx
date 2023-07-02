import { StyleSheet } from "react-native";
import { appColors } from "./StyleAttributes";

export const OaaIconButtonStyles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 200,
  },
  rectangle: {
    borderRadius: 8,
  },
  ghost: {},
  primary: {
    backgroundColor: appColors.buttonPrimary,
  },
  transparent: {
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});

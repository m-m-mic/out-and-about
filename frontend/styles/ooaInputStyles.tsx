import { StyleSheet } from "react-native";
import { appColors, typefaces } from "./StyleAttributes";

export const ooaInputStyles = StyleSheet.create({
  wrapper: {
    display: "flex",
    width: "100%",
    gap: 5,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: "100%",
    borderRadius: 8,
    borderWidth: 3,
    fontFamily: typefaces.body.fontFamily,
    fontSize: typefaces.body.size,
  },
  errorMessage: {
    fontFamily: typefaces.body.fontFamily,
    width: "100%",
    textAlign: "right",
    color: appColors.body,
  },
});

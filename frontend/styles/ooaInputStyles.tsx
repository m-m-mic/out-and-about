import { StyleSheet } from "react-native";
import { appColors, typefaces } from "./StyleAttributes";

export const ooaInputStyles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    gap: 5,
  },
  wrapper: {
    height: 50,
    paddingHorizontal: 12,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 3,
    alignItems: "center",
    gap: 8,
  },
  input: {
    width: "100%",
    flex: 1,
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

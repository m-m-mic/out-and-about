import { StyleSheet } from "react-native";
import { appColors, typefaces } from "./StyleAttributes";

export const OaaInputStyles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    gap: 5,
  },
  wrapper: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 3,
    alignItems: "center",
    gap: 8,
  },
  input: {
    height: 30,
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

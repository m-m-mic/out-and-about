import { StyleSheet } from "react-native";
import { appColors, typefaces } from "./StyleAttributes";

export const OaaButtonStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    height: 50,
    borderRadius: 12,
  },
  expand: {
    flexGrow: 1,
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  elevation: {
    elevation: 2,
  },
  text: {
    color: appColors.bodyInverted,
    fontFamily: typefaces.button.fontFamily,
  },
  primary: {
    backgroundColor: appColors.buttonPrimary,
  },
  caution: {
    backgroundColor: appColors.caution,
  },
  outline: {
    backgroundColor: appColors.background,
    borderColor: appColors.buttonPrimary,
    borderWidth: 3,
  },
  outlineText: {
    color: appColors.buttonPrimary,
  },
  warning: {
    backgroundColor: appColors.error,
  },
  ghost: {},
  ghostText: { color: appColors.body },
  disabled: { backgroundColor: appColors.buttonDisabled },
  disabledText: { color: appColors.bodyDisabled },
});

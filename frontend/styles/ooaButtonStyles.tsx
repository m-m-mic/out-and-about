import { StyleSheet } from "react-native";
import { appColors, typefaces } from "./StyleAttributes";

export const ooaButtonStyles = StyleSheet.create({
  wrapper: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    height: 50,
    borderRadius: 12,
  },
  text: {
    color: appColors.bodyInverted,
    fontFamily: typefaces.button.fontFamily,
  },
  primary: {
    backgroundColor: appColors.buttonPrimary,
  },
  caution: {},
  outline: {
    backgroundColor: appColors.background,
    borderColor: appColors.buttonPrimary,
    borderWidth: 3,
  },
  outlineText: {
    color: appColors.buttonPrimary,
  },
  ghost: {},
  ghostText: {},
  disabled: { backgroundColor: appColors.buttonDisabled },
  disabledText: { color: appColors.bodyDisabled },
});

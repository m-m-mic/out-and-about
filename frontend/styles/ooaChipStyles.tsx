import { StyleSheet } from "react-native";
import { appColors, typefaces } from "./StyleAttributes";

export const ooaChipStyles = StyleSheet.create({
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
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
  unselected: { backgroundColor: appColors.buttonInactive },
  disabled: { backgroundColor: appColors.buttonDisabled },
  disabledText: { color: appColors.bodyDisabled },
});

import { StyleSheet } from "react-native";
import { appColors, typefaces } from "./StyleAttributes";

export const OaaChipStyles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  expand: {
    flex: 1,
  },
  cSmall: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tSmall: {
    fontSize: 12,
  },
  text: {
    color: appColors.bodyInverted,
    fontFamily: typefaces.button.fontFamily,
  },
  primary: {
    backgroundColor: appColors.buttonPrimary,
  },
  caution: { backgroundColor: appColors.caution },
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

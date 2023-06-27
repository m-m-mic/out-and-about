import { Platform, StyleSheet } from "react-native";
import { appColors, typefaces } from "./StyleAttributes";

export const TabBarStyles = StyleSheet.create({
  bar: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 12,
    backgroundColor: appColors.background,
    borderTopColor: "#eaeaea",
    borderTopWidth: 2,
  },
  tab: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  label: {
    fontFamily: typefaces.body.fontFamily,
    fontSize: typefaces.body.size,
  },
});

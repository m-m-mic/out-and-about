import { StyleSheet } from "react-native";
import { appColors, typefaces } from "./StyleAttributes";

export const OaaActivityButtonStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    backgroundColor: appColors.background,
    gap: 8,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 50,
  },
  label: {
    fontFamily: typefaces.h2.fontFamily,
    fontSize: typefaces.h2.size,
    letterSpacing: typefaces.h2.letterSpacing,
    flex: 1,
    overflow: "hidden",
  },
});

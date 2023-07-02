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
    paddingRight: 8,
    gap: 8,
    elevation: 2,
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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

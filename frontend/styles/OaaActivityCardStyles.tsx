import { StyleSheet } from "react-native";
import { appColors, typefaces } from "./StyleAttributes";

export const OaaActivityCardStyles = StyleSheet.create({
  container: {
    backgroundColor: appColors.background,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    display: "flex",
    gap: 10,
    padding: 10,
    marginHorizontal: 20,
    marginTop: 30,
    backgroundColor: appColors.background,
    zIndex: 3,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
  },
  name: {
    height: 60,
    fontFamily: typefaces.hero.fontFamily,
    fontSize: typefaces.h1.size,
    letterSpacing: typefaces.h1.letterSpacing,
    color: typefaces.hero.color,
    textTransform: "uppercase",
  },
  chips: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

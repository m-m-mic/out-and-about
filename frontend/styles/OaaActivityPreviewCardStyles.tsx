import { Dimensions, StyleSheet } from "react-native";
import { appColors, typefaces } from "./StyleAttributes";
const width = Dimensions.get("window").width;

export const OaaActivityPreviewCardStyles = StyleSheet.create({
  container: {
    display: "flex",
    width: width * 0.8,
    height: "100%",
    maxHeight: 360,
    minHeight: 260,
    overflow: "hidden",
    backgroundColor: appColors.background,
    borderRadius: 12,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: "100%",
    flex: 1,
  },
  title: {
    height: 80,
    fontFamily: typefaces.hero.fontFamily,
    fontSize: 28,
    letterSpacing: typefaces.h1.letterSpacing,
    color: typefaces.h1.color,
    textTransform: "uppercase",
    marginVertical: 16,
    marginHorizontal: 10,
  },
});

import { StyleSheet } from "react-native";
import { typefaces } from "./StyleAttributes";

export const PageStyles = StyleSheet.create({
  page: {
    marginVertical: 16,
    marginHorizontal: 12,
    display: "flex",
    flexDirection: "column",
  },
  spaceBetween: {
    flex: 1,
    gap: 20,
    justifyContent: "space-between",
  },
  hero: {
    fontFamily: typefaces.hero.fontFamily,
    fontSize: typefaces.hero.size,
    color: typefaces.hero.color,
    textTransform: "uppercase",
  },
  h1: {
    fontFamily: typefaces.h1.fontFamily,
    fontSize: typefaces.h1.size,
    letterSpacing: typefaces.h1.letterSpacing,
    color: typefaces.h1.color,
  },
  h2: {
    fontFamily: typefaces.h2.fontFamily,
    fontSize: typefaces.h2.size,
    letterSpacing: typefaces.h2.letterSpacing,
  },
});
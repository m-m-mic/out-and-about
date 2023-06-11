import { StyleSheet } from "react-native";
import { typefaces } from "./StyleAttributes";

export const LandingPageStyles = StyleSheet.create({
  page: {
    gap: 20,
  },
  hero: {
    fontFamily: typefaces.hero.fontFamily,
    fontSize: typefaces.hero.size,
    color: typefaces.hero.color,
  },
  description: {
    fontFamily: typefaces.h1.fontFamily,
    fontSize: typefaces.h1.size,
    letterSpacing: typefaces.h1.letterSpacing,
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
});

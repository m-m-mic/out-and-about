import { Platform, StyleSheet } from "react-native";
import { typefaces } from "./StyleAttributes";

export const PageStyles = StyleSheet.create({
  page: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  header: {},
  spaceBetween: {
    flex: 1,
    justifyContent: "space-between",
  },
  hero: {
    fontFamily: typefaces.hero.fontFamily,
    fontSize: typefaces.hero.size,
    color: typefaces.hero.color,
    textTransform: "uppercase",
    lineHeight: typefaces.hero.lineHeight,
  },
  subtitle: {
    fontFamily: typefaces.subtitle.fontFamily,
    fontSize: typefaces.subtitle.size,
    color: typefaces.subtitle.color,
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
  body: {
    fontFamily: typefaces.body.fontFamily,
    fontSize: typefaces.body.size,
    letterSpacing: typefaces.body.letterSpacing,
    color: typefaces.body.color,
  },
  categorySelection: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
});

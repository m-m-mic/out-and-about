import { Text, View } from "react-native";
import * as React from "react";
import { typefaces } from "../styles/StyleAttributes";

export default function Loading({ padding = false }) {
  return (
    <View
      style={{
        height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text
        style={{
          paddingTop: padding ? 150 : 0,
          textAlign: "center",
          fontFamily: typefaces.hero.fontFamily,
          fontSize: typefaces.hero.size,
          color: typefaces.hero.color,
        }}>
        LOADING
      </Text>
    </View>
  );
}

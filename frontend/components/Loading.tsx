import { Text, View } from "react-native";
import * as React from "react";
import { typefaces } from "../styles/StyleAttributes";

export default function Loading() {
  return (
    <View style={{ display: "flex", justifyContent: "center", flex: 1, alignItems: "center" }}>
      <Text
        style={{
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

import { Text, View } from "react-native";
import * as React from "react";

export default function Loading() {
  return (
    <View style={{ display: "flex", justifyContent: "center", flex: 1, alignItems: "center" }}>
      <Text style={{ textAlign: "center", marginTop: 300 }}>LOADING</Text>
    </View>
  );
}

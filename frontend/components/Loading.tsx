import { Image, View } from "react-native";
import * as React from "react";

export default function Loading({ padding = false }) {
  return (
    <View
      style={{
        height: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <View style={{ paddingTop: padding ? 150 : 0 }}>
        <Image
          style={{
            height: 60,
            width: 60,
          }}
          source={require("../assets/loading-animation.gif")}
        />
      </View>
    </View>
  );
}

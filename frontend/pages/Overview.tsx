import { Button, Text, View } from "react-native";
import * as React from "react";

// @ts-ignore
export default function Overview({ navigation }) {
  return (
    <View>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Übersicht</Text>
      <Button title="Go to Activity" onPress={() => navigation.navigate("Activity")} />
      <Button title="Go to CreateActivity" onPress={() => navigation.navigate("CreateActivity")} />
    </View>
  );
}

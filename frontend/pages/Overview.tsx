import { Button, Text, View } from "react-native";
import * as React from "react";
import { PageStyles } from "../styles/PageStyles";

// @ts-ignore
export default function Overview({ navigation }) {
  return (
    <View style={PageStyles.page}>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Übersicht</Text>
      <Button title="Go to Activity" onPress={() => navigation.navigate("ActivityStack")} />
      <Button title="Go to CreateActivity" onPress={() => navigation.navigate("CreateActivity")} />
    </View>
  );
}

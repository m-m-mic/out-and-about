import { Button, Text, View } from "react-native";
import * as React from "react";
import { PageStyles } from "../styles/PageStyles";

export default function Search({ navigation }: any) {
  return (
    <View style={PageStyles.page}>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Suche</Text>
      <Button title="Go to CreateActivity" onPress={() => navigation.navigate("Activity")} />
    </View>
  );
}

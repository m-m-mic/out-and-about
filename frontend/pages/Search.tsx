import { Button, Text, View } from "react-native";
import * as React from "react";

export default function Search({ navigation }: any) {
  return (
    <View>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Suche</Text>
      <Button title="Go to CreateActivity" onPress={() => navigation.navigate("Activity")} />
    </View>
  );
}

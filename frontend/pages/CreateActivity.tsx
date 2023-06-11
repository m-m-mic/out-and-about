import { Text, View } from "react-native";
import * as React from "react";
import { PageStyles } from "../styles/PageStyles";

export default function CreateActivity() {
  return (
    <View style={PageStyles.page}>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Aktivität erstellen</Text>
    </View>
  );
}

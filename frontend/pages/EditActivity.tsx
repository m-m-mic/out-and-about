import { Text, View } from "react-native";
import * as React from "react";
import { PageStyles } from "../styles/PageStyles";

export default function EditActivity() {
  return (
    <View style={PageStyles.page}>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Aktivität bearbeiten</Text>
    </View>
  );
}

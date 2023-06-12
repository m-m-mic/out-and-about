import { Button, ScrollView, Text, View } from "react-native";
import * as React from "react";
import { PageStyles } from "../styles/PageStyles";

export default function Search({ navigation }: any) {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={PageStyles.page}>
        <Text style={PageStyles.h1}>Suche</Text>
      </View>
    </ScrollView>
  );
}

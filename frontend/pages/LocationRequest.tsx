import { View, Text, Linking, ScrollView } from "react-native";
import { OaaButton } from "../components/OaaButton";
import React from "react";
import { PageStyles } from "../styles/PageStyles";

export function LocationRequest() {
  return (
    <ScrollView style={[{ flex: 1 }, PageStyles.header]} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[PageStyles.page, { width: "100%", justifyContent: "center", alignItems: "center" }]}>
        <Text style={[PageStyles.h1, { textAlign: "center" }]}>Diese Seite kann ohne Standortrechte nicht geladen werden</Text>
        <OaaButton label="Out & About Einstellungen" onPress={() => Linking.openSettings()} variant="primary" />
      </View>
    </ScrollView>
  );
}

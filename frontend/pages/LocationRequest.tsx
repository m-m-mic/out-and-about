import { View, Text, Linking, ScrollView } from "react-native";
import { OaaButton } from "../components/OaaButton";
import React from "react";
import { PageStyles } from "../styles/PageStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function LocationRequest() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, marginTop: insets.top, marginLeft: insets.left, marginRight: insets.right }}
      contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[PageStyles.page, { width: "100%", justifyContent: "center", alignItems: "center" }]}>
        <Text style={[PageStyles.h1, { textAlign: "center" }]}>Diese Seite kann ohne Standortrechte nicht geladen werden</Text>
        <OaaButton label="Out & About Einstellungen" onPress={() => Linking.openSettings()} variant="primary" />
      </View>
    </ScrollView>
  );
}

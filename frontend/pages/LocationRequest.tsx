import { View, Text, Linking, ScrollView } from "react-native";
import { OaaButton } from "../components/OaaButton";
import React from "react";
import { PageStyles } from "../styles/PageStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function LocationRequest() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, marginTop: insets.top, marginLeft: insets.left, marginRight: insets.right, marginBottom: insets.bottom }}
      contentContainerStyle={{ flex: 1 }}>
      <View style={[PageStyles.page, { flex: 1, justifyContent: "center", gap: 50 }]}>
        <View>
          <Text style={[PageStyles.h1, { textAlign: "center" }]}>Diese Seite kann ohne Standortrechte nicht geladen werden</Text>
        </View>
        <View style={{ display: "flex" }}>
          <OaaButton label="Out & About Einstellungen" icon="cog" onPress={() => Linking.openSettings()} variant="primary" />
        </View>
      </View>
    </ScrollView>
  );
}

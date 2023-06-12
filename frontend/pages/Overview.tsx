import { Button, ScrollView, Text, View } from "react-native";
import * as React from "react";
import { PageStyles } from "../styles/PageStyles";
import { appColors } from "../styles/StyleAttributes";
import { OaaButton } from "../components/OaaButton";

// @ts-ignore
export default function Overview({ navigation }) {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={PageStyles.page}>
        <Text style={PageStyles.h1}>Übersicht</Text>
        <OaaButton
          label="Go to specific Activity"
          onPress={() => navigation.navigate("ActivityStack", { screen: "Activity", params: { id: "647e03848e6a1f6e9fdc586a" } })}
        />
        <OaaButton
          label="Aktivität erstellen"
          icon="plus"
          variant="ghost"
          onPress={() => navigation.navigate("CreateActivity")}
        />
      </View>
    </ScrollView>
  );
}

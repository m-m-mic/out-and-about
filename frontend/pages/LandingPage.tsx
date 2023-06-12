import { ScrollView, Text, View } from "react-native";
import * as React from "react";
import { PageStyles } from "../styles/PageStyles";
import { OaaButton } from "../components/OaaButton";
import { appColors } from "../styles/StyleAttributes";

// @ts-ignore
export default function LandingPage({ navigation }) {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[PageStyles.page, PageStyles.spaceBetween]}>
        <Text style={PageStyles.hero}>OUT & ABOUT</Text>
        <Text style={[PageStyles.h1, { color: appColors.body }]}>
          Raus aus dem Haus!{"\n"}Bei uns findest du schnell und einfach Aktivitäten und Events in deiner Nähe.
        </Text>
        <Text style={{ backgroundColor: "grey", height: 300 }}>Placeholder</Text>
        <View style={{ display: "flex", gap: 16 }}>
          <OaaButton label="Registrieren" onPress={() => navigation.navigate("Register")} />
          <OaaButton label="Anmelden" variant="outline" onPress={() => navigation.navigate("Login")} />
        </View>
      </View>
    </ScrollView>
  );
}

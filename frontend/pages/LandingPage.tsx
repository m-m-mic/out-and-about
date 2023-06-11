import { Button, ScrollView, Text, View } from "react-native";
import * as React from "react";
import { PageStyles } from "../styles/PageStyles";
import { LandingPageStyles as styles } from "../styles/LandingPageStyles";
import { OaaButton } from "../components/OaaButton";

// @ts-ignore
export default function LandingPage({ navigation }) {
  return (
    <ScrollView>
      <View style={[PageStyles.page, styles.page]}>
        <Text style={styles.hero}>OUT & ABOUT</Text>
        <Text style={styles.description}>
          Raus aus dem Haus!{"\n"}Bei uns findest du schnell und einfach Aktivitäten und Events in deiner Nähe.
        </Text>
        <View style={styles.buttons}>
          <Button title="Go to Register" onPress={() => navigation.navigate("Register")} />
          <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
          <OaaButton label="Registrieren" onPress={() => navigation.navigate("Register")} />
        </View>
      </View>
    </ScrollView>
  );
}

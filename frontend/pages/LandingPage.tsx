import { Button, Text, View } from "react-native";
import * as React from "react";

// @ts-ignore
export default function LandingPage({ navigation }) {
  return (
    <View>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Startseite</Text>
      <Button title="Go to Register" onPress={() => navigation.navigate("Register")} />
      <Text>Login</Text>
      <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}

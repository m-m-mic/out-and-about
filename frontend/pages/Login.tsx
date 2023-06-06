import { Button, Text, View } from "react-native";
import * as React from "react";

// @ts-ignore
export default function Login({ navigation, route }: any) {
  // @ts-ignore
  const { setUserToken } = route.params;

  return (
    <View>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Anmelden</Text>
      <Button title="Anmelden" onPress={() => setUserToken("ters")} />
    </View>
  );
}

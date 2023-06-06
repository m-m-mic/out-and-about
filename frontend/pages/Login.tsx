import { Button, Text, View } from "react-native";
import * as React from "react";
import { AuthContext } from "../App";

// @ts-ignore
export default function Login({ navigation }: any) {
  // @ts-ignore
  const { signIn } = React.useContext(AuthContext);

  return (
    <View>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Anmelden</Text>
      <Button title="Anmelden" onPress={() => signIn()} />
    </View>
  );
}

import { Button, Text, TextInput, View } from "react-native";
import * as React from "react";
import { AuthContext } from "../App";
import { useState } from "react";
import { PageStyles } from "../styles/PageStyles";

// @ts-ignore
export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = React.useContext(AuthContext);

  return (
    <View style={PageStyles.page}>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Anmelden</Text>
      <Text>Email</Text>
      <TextInput onChangeText={(text) => setEmail(text)} />
      <Text>Password</Text>
      <TextInput onChangeText={(text) => setPassword(text)} />
      <Button title="Anmelden" onPress={() => signIn({ email: email, password: password })} />
    </View>
  );
}

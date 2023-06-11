import { Button, ScrollView, Text, TextInput, View } from "react-native";
import * as React from "react";
import { AuthContext } from "../App";
import { useState } from "react";
import { PageStyles } from "../styles/PageStyles";
import { OaaIconButton } from "../components/OaaIconButton";
import { OaaInput } from "../components/OaaInput";
import { OaaButton } from "../components/OaaButton";

// @ts-ignore
export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = React.useContext(AuthContext);

  const runValidators = () => {
    return email.length === 0 && password.length === 0;
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[PageStyles.page, PageStyles.spaceBetween]}>
        <View style={{ display: "flex", gap: 16 }}>
          <OaaIconButton name="arrow-left" onPress={() => navigation.goBack()} />
          <Text style={PageStyles.hero}>REGISTRIEREN</Text>
        </View>
        <View style={{ display: "flex", gap: 12 }}>
          <Text style={PageStyles.h2}>E-Mail</Text>
          <OaaInput placeholder="E-Mail..." onChangeText={(value: string) => setEmail(value)} />
          <Text style={PageStyles.h2}>Passwort</Text>
          <OaaInput placeholder="Passwort..." secureTextEntry={true} onChangeText={(value: string) => setPassword(value)} />
        </View>
        <OaaButton
          label="Anmelden"
          variant={runValidators() ? "disabled" : "primary"}
          onPress={() => signIn({ email: email, password: password })}
        />
      </View>
    </ScrollView>
  );
}

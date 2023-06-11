import { Button, Text, View } from "react-native";
import * as React from "react";
import { AuthContext } from "../App";
import { PageStyles } from "../styles/PageStyles";

export default function Profile({ navigation }: any) {
  // @ts-ignore
  const { signOut } = React.useContext(AuthContext);

  return (
    <View style={PageStyles.page}>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Profil</Text>
      <Button title="Abmelden" onPress={() => signOut()} />
    </View>
  );
}

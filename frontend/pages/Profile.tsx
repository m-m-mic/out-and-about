import { Button, Text, View } from "react-native";
import * as React from "react";
import { AuthContext } from "../App";

export default function Profile({ navigation }: any) {
  // @ts-ignore
  const { signOut } = React.useContext(AuthContext);

  return (
    <View>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Profil</Text>
      <Button title="Abmelden" onPress={() => signOut()} />
    </View>
  );
}

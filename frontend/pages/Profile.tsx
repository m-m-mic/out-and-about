import { Button, Text, View } from "react-native";
import * as React from "react";

export default function Profile({ navigation, route }: any) {
  const { setUserToken } = route.params;

  return (
    <View>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Profil</Text>
      <Button title="Abmelden" onPress={() => setUserToken(null)} />
    </View>
  );
}

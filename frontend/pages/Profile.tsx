import { Button, ScrollView, Text, View } from "react-native";
import * as React from "react";
import { AuthContext } from "../App";
import { PageStyles } from "../styles/PageStyles";
import { OaaIconButton } from "../components/OaaIconButton";
import { OaaButton } from "../components/OaaButton";

export default function Profile({ navigation }: any) {
  // @ts-ignore
  const { signOut } = React.useContext(AuthContext);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={PageStyles.page}>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={PageStyles.h1}>Profil</Text>
          <OaaIconButton name="logout" onPress={() => signOut()} />
        </View>
        <OaaButton
          label="Aktivität erstellen"
          icon="plus"
          variant="ghost"
          onPress={() => navigation.navigate("CreateActivity")}
        />
      </View>
    </ScrollView>
  );
}

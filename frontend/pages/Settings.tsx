import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useContext } from "react";
import { AuthContext } from "../App";
import { Linking, ScrollView, Text, View } from "react-native";
import { ActivityStyles as styles } from "../styles/ActivityStyles";
import { OaaIconButton } from "../components/OaaIconButton";
import { PageStyles } from "../styles/PageStyles";
import * as React from "react";
import { OaaButton } from "../components/OaaButton";
import { primary } from "../styles/StyleAttributes";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import { ProfileStackType } from "../scripts/types";

type SettingsProps = NativeStackScreenProps<ProfileStackType, "Settings">;

export function Settings({ navigation }: SettingsProps) {
  const insets = useSafeAreaInsets();
  const { signOut } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, marginTop: insets.top, marginLeft: insets.left, marginRight: insets.right }}>
      <View style={styles.topBar}>
        <OaaIconButton name="close" onPress={() => navigation.goBack()} />
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={PageStyles.page}>
          <Text style={PageStyles.h1}>Einstellungen</Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 8, width: "100%" }}>
            <OaaButton
              icon="book-open-variant"
              label="Impressum"
              variant="primary"
              onPress={() => Linking.openURL("https://www.hm.edu/impressum/index.de.html")}
            />
            <OaaButton
              icon="shield-alert"
              label="Datenschutz"
              variant="primary"
              onPress={() => Linking.openURL("https://www.hm.edu/datenschutz/index.de.html")}
            />
          </View>
          <View style={{ height: 1, width: "100%", backgroundColor: primary["100"], marginVertical: 10 }}></View>
          <OaaButton icon="logout" label="Abmelden" variant="outline" onPress={() => signOut()} />
        </View>
      </ScrollView>
    </View>
  );
}

import { ScrollView, Text, View } from "react-native";
import * as React from "react";
import { AuthContext } from "../App";
import { useState } from "react";
import { PageStyles } from "../styles/PageStyles";
import { OaaIconButton } from "../components/OaaIconButton";
import { OaaInput } from "../components/OaaInput";
import { OaaButton } from "../components/OaaButton";
import { appColors, typefaces } from "../styles/StyleAttributes";
import { Icon } from "@react-native-material/core";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import { LoggedOutStackType } from "../scripts/types";

type LoginProps = NativeStackScreenProps<LoggedOutStackType, "Login">;

export default function Login({ navigation }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { signIn } = React.useContext(AuthContext);

  // Attempts sign in, makes disclaimer visible if sign in fails
  const handleSignIn = () => {
    signIn({ email: email, password: password }).then((response: number) => {
      if (response != 200) {
        setIsDisclaimerVisible(true);
      }
    });
  };

  // Checks if user has entered email and password
  const runValidators = () => {
    return email.length === 0 || password.length === 0;
  };

  return (
    <ScrollView
      style={{ flex: 1, marginTop: insets.top, marginLeft: insets.left, marginRight: insets.right, marginBottom: insets.bottom }}
      contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[PageStyles.page, PageStyles.spaceBetween]}>
        <View style={{ display: "flex", gap: 16 }}>
          <OaaIconButton name="arrow-left" onPress={() => navigation.goBack()} />
          <Text style={PageStyles.hero}>Anmelden</Text>
        </View>
        <View style={{ display: "flex", gap: 12 }}>
          <Text style={PageStyles.h2}>E-Mail</Text>
          <OaaInput placeholder="E-Mail..." keyboardType="email-address" onChangeText={(value: string) => setEmail(value)} />
          <Text style={PageStyles.h2}>Passwort</Text>
          <OaaInput placeholder="Passwort..." secureTextEntry={true} onChangeText={(value: string) => setPassword(value)} />
          {isDisclaimerVisible && (
            <View
              style={{
                borderColor: appColors.error,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 3,
                paddingVertical: 18,
                marginTop: 10,
                borderRadius: 8,
                gap: 8,
              }}>
              <Icon name="alert-circle" size={24} color={appColors.error} />
              <Text
                style={{
                  fontFamily: typefaces.button.fontFamily,
                  color: appColors.error,
                }}>
                Bitte überprüfe deine Angaben.
              </Text>
            </View>
          )}
        </View>
        <View style={{ display: "flex", gap: 16 }}>
          <OaaButton label="Anmelden" variant={runValidators() ? "disabled" : "primary"} onPress={() => handleSignIn()} />
          <OaaButton label="Noch kein Konto? Hier registrieren" variant="ghost" onPress={() => navigation.navigate("Register")} />
        </View>
      </View>
    </ScrollView>
  );
}

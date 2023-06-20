import { ScrollView, Text, View } from "react-native";
import * as React from "react";
import { useState } from "react";
import { backendUrl } from "../scripts/backendConnection";
import { registrationTemplate, registrationValidationTemplate } from "../scripts/templates";
import { emailPattern, setPasswordInput, setPasswordRepeatInput, setUsernameInput } from "../scripts/inputValidators";
import { Account } from "../scripts/types";
import { PageStyles } from "../styles/PageStyles";
import { OaaInput } from "../components/OaaInput";
import { OaaButton } from "../components/OaaButton";
import { OaaIconButton } from "../components/OaaIconButton";

// @ts-ignore TODO
export default function Register({ navigation }) {
  const [registrationData, setRegistrationData] = useState<Account>(registrationTemplate);
  const [registrationValidator, setRegistrationValidator] = useState<any>(registrationValidationTemplate);
  const [emailError, setEmailError] = useState<string>("Eingabe entspricht keiner validen E-Mail.");

  // Checks if entered email is available
  const verifyEmail = (input: string) => {
    if (input.length == 0) {
      setEmailError("Bitte geben sie eine E-Mail an.");
      setRegistrationValidator({ ...registrationValidator, email: false });
      return;
    } else if (!input.match(emailPattern)) {
      setEmailError("Eingabe entspricht keiner validen E-Mail.");
      setRegistrationValidator({ ...registrationValidator, email: false });
      return;
    }
    const url = backendUrl + "/account/check-email";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input }),
    };
    fetch(url, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          setRegistrationData({ ...registrationData, email: input });
          setRegistrationValidator({ ...registrationValidator, email: true });
        } else if (response.status === 403) {
          setEmailError("E-Mail wird bereits verwendet.");
          setRegistrationValidator({ ...registrationValidator, email: false });
        } else {
          setEmailError("Es ist ein unerwarteter Fehler aufgetreten.");
          setRegistrationValidator({ ...registrationValidator, email: false });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // Checks if all validators are set to true
  const runValidators = () => {
    for (const [key, value] of Object.entries(registrationValidator)) {
      if (!value) {
        return true;
      }
    }
    return false;
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[PageStyles.page, PageStyles.spaceBetween]}>
        <View style={{ display: "flex", gap: 16 }}>
          <OaaIconButton name="arrow-left" onPress={() => navigation.goBack()} />
          <Text style={PageStyles.hero}>REGISTRIEREN</Text>
        </View>
        <View style={{ display: "flex", gap: 12 }}>
          <Text style={PageStyles.h2}>Nutzername</Text>
          <OaaInput
            placeholder="Nutzername..."
            onChangeText={(value: string) =>
              setUsernameInput(value, registrationData, setRegistrationData, registrationValidator, setRegistrationValidator)
            }
            isError={registrationValidator.username === false}
            isValid={registrationValidator.username}
            errorMessage="Nutzername muss 3 bis 20 Zeichen lang sein."
          />
          <Text style={PageStyles.h2}>E-Mail</Text>
          <OaaInput
            placeholder="E-Mail..."
            keyboardType="email-address"
            onChangeText={(value: string) => verifyEmail(value)}
            isError={registrationValidator.email === false}
            isValid={registrationValidator.email}
            errorMessage={emailError}
          />
          <Text style={PageStyles.h2}>Passwort</Text>
          <OaaInput
            placeholder="Passwort..."
            secureTextEntry={true}
            onChangeText={(value: string) =>
              setPasswordInput(value, registrationData, setRegistrationData, registrationValidator, setRegistrationValidator)
            }
            isError={registrationValidator.password === false}
            isValid={registrationValidator.password}
            errorMessage="Password muss 8 bis 30 Zeichen lang sein."
          />
          <Text style={PageStyles.h2}>Passwort wiederholen...</Text>
          <OaaInput
            placeholder="Passwort wiederholen..."
            secureTextEntry={true}
            onChangeText={(value: string) =>
              setPasswordRepeatInput(value, registrationData, registrationValidator, setRegistrationValidator)
            }
            isError={registrationValidator.password_repeat === false}
            isValid={registrationValidator.password_repeat}
            errorMessage="Passwörter stimmen nicht miteinander überein."
          />
        </View>
        <View>
          <OaaButton
            label="Weiter"
            variant={runValidators() ? "disabled" : "primary"}
            onPress={() => navigation.navigate("ChoosePreferences", { data: registrationData })}
          />
        </View>
      </View>
    </ScrollView>
  );
}

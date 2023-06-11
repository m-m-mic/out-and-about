import { Button, Text, TextInput, View } from "react-native";
import * as React from "react";
import { useState } from "react";
import { backendUrl } from "../scripts/backendConnection";
import { registrationTemplate, registrationValidationTemplate } from "../scripts/templates";
import { setEmailInput, setPasswordInput, setPasswordRepeatInput, setUsernameInput } from "../scripts/inputValidators";
import { Account } from "../scripts/types";
import { PageStyles } from "../styles/PageStyles";

// @ts-ignore TODO
export default function Register({ navigation }) {
  const [registrationData, setRegistrationData] = useState<Account>(registrationTemplate);
  const [registrationValidator, setRegistrationValidator] = useState(registrationValidationTemplate);
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState<boolean>(false);
  const [disclaimer, setDisclaimer] = useState<string>("Error");

  // Checks if entered email is available
  const checkForExistingEmail = () => {
    const url = backendUrl + "/account/check-email";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: registrationData.email }),
    };
    fetch(url, requestOptions)
      .then((response) => {
        if (response.status === 200) {
          setIsDisclaimerVisible(false);
          setRegistrationValidator({ ...registrationValidator, emailUnique: true });
        } else if (response.status === 403) {
          setDisclaimer("E-Mail wird bereits verwendet");
          setIsDisclaimerVisible(true);
          setRegistrationValidator({ ...registrationValidator, emailUnique: false });
        } else {
          setDisclaimer("E-Mail konnte nicht überprüft werden");
          setIsDisclaimerVisible(true);
          setRegistrationValidator({ ...registrationValidator, emailUnique: false });
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
    <View style={PageStyles.page}>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Registrieren</Text>
      <Text>Nutzername</Text>
      <TextInput
        placeholder="Benutzername..."
        onChangeText={(text) =>
          setUsernameInput(text, registrationData, setRegistrationData, registrationValidator, setRegistrationValidator)
        }
      />
      <Text>E-Mail</Text>
      <TextInput
        placeholder="E-Mail..."
        onChangeText={(text) =>
          setEmailInput(text, registrationData, setRegistrationData, registrationValidator, setRegistrationValidator)
        }
        onEndEditing={() => checkForExistingEmail()}
      />
      <Text>Passwort</Text>
      {isDisclaimerVisible && <Text>{disclaimer}</Text>}
      <TextInput
        placeholder="Passwort..."
        onChangeText={(text) =>
          setPasswordInput(text, registrationData, setRegistrationData, registrationValidator, setRegistrationValidator)
        }
      />
      <Text>Passwort wiederholen...</Text>
      <TextInput
        placeholder="Passwort wiederholen..."
        onChangeText={(text) => setPasswordRepeatInput(text, registrationData, registrationValidator, setRegistrationValidator)}
      />
      <Button
        title="Registrieren"
        disabled={runValidators()}
        onPress={() => navigation.navigate("ChoosePreferences", { data: registrationData })}
      />
    </View>
  );
}

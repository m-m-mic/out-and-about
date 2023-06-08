import { Button, Text, TextInput, View } from "react-native";
import * as React from "react";
import { useState } from "react";
import { backendUrl } from "../scripts/backendConnection";

// @ts-ignore
export default function Register({ navigation }) {
  const registrationTemplate = {
    username: "",
    email: "",
    password: "",
    categories: [],
    saved_activities: [],
    planned_activities: [],
  };

  const registrationValidationTemplate = {
    username: false,
    email: false,
    emailUnique: false,
    password: false,
    categories: true,
    saved_activities: true,
    planned_activities: true,
  };

  const [registrationData, setRegistrationData] = useState(registrationTemplate);
  const [registrationValidator, setRegistrationValidator] = useState(registrationValidationTemplate);
  const [isDisclaimerVisible, setIsDisclaimerVisible] = useState(false);
  const [disclaimer, setDisclaimer] = useState("Error");

  const emailPattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const specialCharacterPattern = /^[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\d]*$/g;

  // @ts-ignore
  const setEmailInput = (input, data, setData, validation, setValidation) => {
    if (input.match(emailPattern)) {
      setData({ ...data, email: input });
      return setValidation({ ...validation, email: true });
    } else {
      return setValidation({ ...validation, email: false });
    }
  };

  // @ts-ignore
  const setUsernameInput = (input, data, setData, validation, setValidation) => {
    if (input.length >= 1 && input.length <= 20 && !input.match(specialCharacterPattern)) {
      setData({ ...data, username: input });
      return setValidation({ ...validation, username: true });
    } else {
      return setValidation({ ...validation, username: false });
    }
  };

  // Password muss mindestens 8 Zeichen und darf maximal 20 Zeichen lang sein
  // @ts-ignore
  const setPasswordInput = (input, data, setData, validation, setValidation) => {
    if (input.length >= 8 && input.length <= 20) {
      setData({ ...data, password: input });
      return setValidation({ ...validation, password: true, password_repeat: false });
    } else {
      return setValidation({ ...validation, password: false });
    }
  };

  // PasswordRepeat Validator wird auf true gesetzt, wenn Password und PasswordRepeat gleich sind
  // @ts-ignore
  const setPasswordRepeatInput = (input, data, validation, setValidation) => {
    if (input === data.password) {
      return setValidation({ ...validation, password_repeat: true });
    } else {
      return setValidation({ ...validation, password_repeat: false });
    }
  };

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

  const checkValidators = () => {
    for (const [key, value] of Object.entries(registrationValidator)) {
      if (!value) {
        return true;
      }
    }
    return false;
  };

  return (
    <View>
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
        placeholder="Paswort wiederholen..."
        onChangeText={(text) => setPasswordRepeatInput(text, registrationData, registrationValidator, setRegistrationValidator)}
      />
      <Button
        title="Registrieren"
        disabled={checkValidators()}
        onPress={() => navigation.navigate("ChoosePreferences", { data: registrationData })}
      />
    </View>
  );
}

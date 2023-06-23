import { Text, View } from "react-native";
import * as React from "react";
import { PageStyles } from "../styles/PageStyles";
import { Account, ActivityType, ActivityValidatorType, Category } from "../scripts/types";
import { useCallback, useEffect, useState } from "react";
import { backendUrl } from "../scripts/backendConnection";
import { getItemAsync } from "expo-secure-store";
import ModifyActivity from "../components/ModifyActivity";
import Loading from "../components/Loading";
import { useFocusEffect } from "@react-navigation/native";

//@ts-ignore
export default function CreateActivity({ route, navigation }) {
  const ActivityInputValidator: ActivityValidatorType = {
    name: true,
    location: true,
    maximum_participants: true,
    categories: true,
    information_text: true,
    date: true,
  };

  const [activityInfo, setActivityInfo] = useState<ActivityType>();
  const [validation, setValidation] = useState(ActivityInputValidator);

  useFocusEffect(
    useCallback(() => {
      if (!activityInfo) {
        createNewActivity();
      }
    }, [])
  );

  const createNewActivity = async () => {
    const userId = await getItemAsync("userId");
    console.log(userId);
    setActivityInfo({
      name: "",
      categories: [],
      date: 0,
      information_text: "",
      //@ts-ignore
      organizer: userId,
      maximum_participants: 0,
      only_logged_in: false,
      participants: [],
    });
    console.log(activityInfo);
  };

  if (!activityInfo) {
    return <Loading />;
  }
  return (
    <ModifyActivity
      activityInfo={activityInfo}
      /* @ts-ignore */
      setActivityInfo={setActivityInfo}
      validation={validation}
      setValidation={setValidation}
      editMode={false}
      navigation={navigation}
    />
  );
}

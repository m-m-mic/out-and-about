import * as React from "react";
import { ActivityStackType, ActivityType } from "../scripts/types";
import { useCallback, useState } from "react";
import { getItemAsync } from "expo-secure-store";
import ModifyActivity from "../components/ModifyActivity";
import Loading from "../components/Loading";
import { useFocusEffect } from "@react-navigation/native";
import { createActivityValidatorTemplate, newActivityTemplate } from "../scripts/templates";
import { getLocation } from "../scripts/getLocation";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";

type CreateActivityProps = NativeStackScreenProps<ActivityStackType, "CreateActivity">;

export default function CreateActivity({ navigation }: CreateActivityProps) {
  const [activityInfo, setActivityInfo] = useState<ActivityType>();
  const [validator, setValidator] = useState(createActivityValidatorTemplate);

  useFocusEffect(
    useCallback(() => {
      createNewActivity();
    }, [])
  );

  // Creates template for new activity which is then used by ModifyActivity component
  const createNewActivity = async () => {
    const userId = await getItemAsync("userId");
    if (userId) {
      let newActivity = { ...newActivityTemplate, organizer: userId, categories: [] };
      const location = await getLocation();
      if (location)
        newActivity = {
          ...newActivity,
          location: { ...newActivity.location, coordinates: [location.coords.longitude, location.coords.latitude] },
        };
      setActivityInfo(newActivity);
    }
  };

  if (!activityInfo) {
    return <Loading />;
  } else {
    return (
      <ModifyActivity
        activityInfo={activityInfo}
        setActivityInfo={setActivityInfo}
        validation={validator}
        setValidation={setValidator}
        editMode={false}
        navigation={navigation}
      />
    );
  }
}

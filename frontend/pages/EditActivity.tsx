import * as React from "react";
import { useEffect, useState } from "react";
import { ActivityType } from "../scripts/types";
import { getItemAsync } from "expo-secure-store";
import { backendUrl } from "../scripts/backendConnection";
import Loading from "../components/Loading";
import ModifyActivity from "../components/ModifyActivity";
import { editActivityValidatorTemplate } from "../scripts/templates";

//@ts-ignore
export default function EditActivity({ route, navigation }) {
  const [activityInfo, setActivityInfo] = useState<ActivityType>();
  const [validator, setValidator] = useState(editActivityValidatorTemplate);
  const activityId = route.params.id;

  useEffect(() => {
    getActivityInfo();
  }, []);

  // Fetches activity data
  const getActivityInfo = async () => {
    const url = backendUrl + "/activity/" + activityId;
    const token = await getItemAsync("userToken");
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, requestOptions);
    if (response.status === 200) {
      const data = await response.json();
      setActivityInfo(data);
    } else {
      console.log("error 404: activity not found");
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
        editMode={true}
        navigation={navigation}
      />
    );
  }
}

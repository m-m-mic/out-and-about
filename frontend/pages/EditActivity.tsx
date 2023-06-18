import * as React from "react";
import { useEffect, useState } from "react";
import { ActivityType, ActivityValidatorType } from "../scripts/types";
import { getItemAsync } from "expo-secure-store";
import { backendUrl } from "../scripts/backendConnection";
import Loading from "../components/Loading";
import ModifyActivity from "../components/ModifyActivity";

//@ts-ignore
export default function EditActivity({ route, navigation }) {
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
  const activityId = route.params.id;

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
      //return navigate("/404");
    }
  };

  useEffect(() => {
    getActivityInfo();
  }, []);

  if (!activityInfo) {
    return <Loading />;
  } else {
    return (
      <ModifyActivity
        activityInfo={activityInfo}
        /* @ts-ignore */
        setActivityInfo={setActivityInfo}
        validation={validation}
        setValidation={setValidation}
        editMode={true}
        navigation={navigation}
      />
    );
  }
}

import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { ActivityStackType, ActivityType } from "../scripts/types";
import { getItemAsync } from "expo-secure-store";
import { backendUrl } from "../scripts/backendConnection";
import Loading from "../components/Loading";
import ModifyActivity from "../components/ModifyActivity";
import { editActivityValidatorTemplate } from "../scripts/templates";
import { AuthContext } from "../App";
import { showToast } from "../scripts/showToast";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";

type EditActivityProps = NativeStackScreenProps<ActivityStackType, "EditActivity">;

export default function EditActivity({ route, navigation }: EditActivityProps) {
  const [activityInfo, setActivityInfo] = useState<ActivityType>();
  const [validator, setValidator] = useState(editActivityValidatorTemplate);
  const activityId = route.params.id;
  const { signOut } = useContext(AuthContext);

  useEffect(() => {
    getActivityInfo();
  }, []);

  // Fetches activity data
  const getActivityInfo = async () => {
    const url = backendUrl + "/activity/" + activityId;
    const token = await getItemAsync("userToken");
    if (!token) signOut();
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(url, requestOptions);
      if (response.status === 200) {
        const data = await response.json();
        setActivityInfo(data);
      } else if (response.status === 401 || response.status === 403) {
        signOut();
      } else {
        showToast("Aktivitätsdetails konnten nicht geladen werden");
      }
    } catch (error) {
      showToast("Aktivitätsdetails konnten nicht geladen werden");
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

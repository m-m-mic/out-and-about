import { Text, TextInput, View } from "react-native";
import * as React from "react";
import { useState } from "react";
import { ActivityType } from "../scripts/types";
import { getItemAsync } from "expo-secure-store";
import { backendUrl } from "../scripts/backendConnection";

//@ts-ignore
export default function EditActivity({ route, navigate }) {
  const [activityInfo, setActivityInfo] = useState<ActivityType>();
  const [userId, setUserId] = useState<string | null>(null);
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
    fetch(url, requestOptions).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setActivityInfo(data);
        });
      } else {
        console.log("error 404: activity not found");
        //return navigate("/404");
      }
    });
  };

  return (
    <View>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Aktivität bearbeiten</Text>
      <Text> Titel </Text>
      <TextInput
        placeholder={activityInfo?.name}
        onChangeText={(text) => {
          if (activityInfo) {
            activityInfo.name = text;
          }
        }}
      />
    </View>
  );
}

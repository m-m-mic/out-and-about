import { Button, Text, View } from "react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import { getItemAsync } from "expo-secure-store";
import { backendUrl } from "../scripts/backendConnection";
import { ActivityType } from "../scripts/types";

//@ts-ignore
export default function Activity({ route, navigate }) {
  const [activityInfo, setActivityInfo] = useState<ActivityType | null>(null);
  const [isOwner, setOwner] = useState(false);
  const [isParticipant, setParticipant] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const id = route.params.id;

  const getActivityInfo = async () => {
    const url = backendUrl + "/activity/" + id;
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
          if (token) {
            setRelations(data);
          }
        });
      } else {
        console.log("error 404: activity not found");
        //return navigate("/404");
      }
    });
  };

  // Entscheidet anhand von activityInfo, welches Verhältnis der Nutzer zur aufgerufenen Aktivität hat
  // z.B. ist er als Teilnehmer angemeldet, oder ein Organisator der Aktivität etc.
  const setRelations = (data: any) => {
    if (data.organizer.id === userId) {
      setOwner(true);
    } else {
      if (data.participants.includes(userId)) {
        setParticipant(true);
      } else {
        setParticipant(false);
      }
    }
  };

  const changeParticipantSub = async () => {
    const url = backendUrl + "/activity/" + id + "/save";
    const token = await getItemAsync("userToken");
    let requestOptions;
    if (token) {
      requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      fetch(url, requestOptions).then((response) => {
        if (response.status === 200) {
          getActivityInfo();
        } else {
          console.log("error 404: activity not found");
        }
      });
    } else {
      console.log("no token");
      //requestOptions = {method: "PATCH"};
    }
  };

  const handleButtonPress = async () => {
    if (isOwner) {
      navigate("Participants", { data: activityInfo });
    } else {
      await changeParticipantSub();
      await getActivityInfo();
    }
  };

  useEffect(() => {
    getItemAsync("userId")
      .then((userId) => setUserId(userId))
      .then(() => getActivityInfo());
  }, []);

  if (!activityInfo) {
    return <Text> loading... </Text>;
  }
  return (
    <View>
      <Text style={{ textAlign: "center", marginTop: 300 }}> {activityInfo.name} </Text>
      <Text> organisiert von {activityInfo.organizer.username}</Text>
      <View>
        {activityInfo.categories.map((category, key) => (
          <Text style={{ color: "blue", margin: 5 }}>{category.name}</Text>
        ))}
      </View>
      <Text> Wann? </Text>
      <Text> {activityInfo.date} </Text>
      <Text> Wo? </Text>
      <Text> {activityInfo.location.coordinates} </Text>
      <Text> Wie viele? </Text>
      <Text> {activityInfo.participants.length} </Text>
      {activityInfo.information_text && (
        <>
          <Text> Weitere Informationen </Text>
          <Text> {activityInfo.information_text} </Text>
        </>
      )}
      <Button title={isOwner ? "Zusagenliste ansehen" : isParticipant ? "Absagen" : "Zusagen"} onPress={handleButtonPress} />
    </View>
  );
}

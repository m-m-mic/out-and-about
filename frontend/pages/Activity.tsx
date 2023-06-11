import { Button, Text, View } from "react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import { getItemAsync } from "expo-secure-store";
import { backendUrl } from "../scripts/backendConnection";
import { ActivityType } from "../scripts/types";
//import { LoadingAnimation } from "../components/LoadingAnimation";

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
      if(data.participants.includes(userId)) {
        setParticipant(true);
      } else {
        setParticipant(false);
      }
    }
  };

export default function Activity() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getItemAsync("userToken").then((token) => setToken(token));
  }, []);
  return (
    <View>
      <Text style={{ textAlign: "center", marginTop: 300 }}>Aktivität</Text>
      {token && <Text>{token}</Text>}
    </View>
  );
}

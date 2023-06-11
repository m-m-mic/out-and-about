import { Button, Text, View } from "react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import { getItemAsync } from "expo-secure-store";
import { backendUrl } from "../scripts/backendConnection";
import { ActivityType } from "../scripts/types";
//import { LoadingAnimation } from "../components/LoadingAnimation";

//@ts-ignore
export default function Activity(route, navigate) {
  const [token, setToken] = useState<string | null>(null);
  const [activityInfo, setActivityInfo] = useState<ActivityType | null>(null);
  const [isOwner, setOwner] = useState(false);
  const [isParticipant, setParticipant] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const id = route.params.id;

  useEffect(() => {
    getActivityInfo();
  }, [id]);

  const getActivityInfo = () => {
    const url = backendUrl + "/activity/" + id;
    let requestOptions;
    if (token) {
      requestOptions = {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`
        }
      };
    } else {
      requestOptions = {method: "GET"};
    }
    fetch(url, requestOptions).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          setActivityInfo(data);
          if (token) {
            setRelations(data);
          }
          document.title = `${data.name} - activee`;
        });
      } else {
        console.log("error 404: activity not found");
        //return navigate("/404");
      }
    });
  }

  // Entscheidet anhand von activityInfo, welches Verhältnis der Nutzer zur aufgerufenen Aktivität hat
  // z.B. ist er als Teilnehmer angemeldet, oder ein Organisator der Aktivität etc.
  const setRelations = (data: any) => {
    if (data.organizer.id === userId) {
      setOwner(true);
    } else {
      for( const participant of data.participants){
        if (participant.id === userId) {
          setParticipant(true);
        }
      }
    }
  };

  const changeParticipantSub = (idtoChange: string | null) => {
    if (idtoChange) {
      const url = backendUrl + "/activity/" + id + "/save";
      let requestOptions;
      if (token) {
        requestOptions = {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ accounts: [idtoChange] }),
        };
        fetch(url, requestOptions).then((response) => {
        if (response.status === 200) {
          
        } else {
          console.log("error 404: activity not found");
        }
      });
      } else {
        console.log("no token")
        //requestOptions = {method: "PATCH"};
      }
      
    }
  }

  const handleButtonPress = () => {
    if (isOwner) {
      navigate("Participants", {data: activityInfo})
    } else {
      changeParticipantSub(userId);
      getActivityInfo();
    }
  }


  useEffect(() => {
    getItemAsync("userToken").then((token) => setToken(token));
    getItemAsync("userId").then((userId) => setUserId(userId));
  }, []);

  if (!activityInfo) {
    return <Text> loading... </Text>
  }
  return (
    <View>
      <Text style={{ textAlign: "center", marginTop: 300 }}> { activityInfo.name } </Text>
      <Text> organisiert von {activityInfo.organizer.username}</Text>
      <View>
        {
          activityInfo.categories.map((category, key) => (
            <Text style = {{color: "blue", margin: 5}}>
              {category.name}
            </Text>
          ))
        }
      </View>
      <Text> Wann? </Text>
      <Text> {activityInfo.date} </Text>
      <Text> Wo? </Text>
      <Text> {activityInfo.location.coordinates} </Text>
      <Text> Wie viele? </Text>
      <Text> {activityInfo.participants.length} </Text>
      {activityInfo.information_text && 
        <>
          <Text> Weitere Informationen </Text>
          <Text> {activityInfo.information_text} </Text>
        </>
      }
      <Button
        title = {
        isOwner?"Zusagenbliste ansehen": isParticipant?"Absagen":"Zusagen"        
        }
        onPress={handleButtonPress}
      />
    </View>
  );
}

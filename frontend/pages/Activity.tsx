import { BackHandler, RefreshControl, ScrollView, Text, View } from "react-native";
import * as React from "react";
import { useEffect, useState } from "react";
import { getItemAsync } from "expo-secure-store";
import { backendUrl } from "../scripts/backendConnection";
import { ActivityType } from "../scripts/types";
import { PageStyles } from "../styles/PageStyles";
import { OaaButton } from "../components/OaaButton";
import { OaaChip } from "../components/OaaChip";
import { OaaIconButton } from "../components/OaaIconButton";
import { OaaActivityImage } from "../components/OaaActivityImage";
import { ActivityStyles as styles } from "../styles/ActivityStyles";
import Loading from "../components/Loading";

//@ts-ignore
export default function Activity({ route, navigation }) {
  const [activityInfo, setActivityInfo] = useState<ActivityType | null>(null);
  const [isOwner, setOwner] = useState(false);
  const [isParticipant, setParticipant] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isChangingUserRelation, setIsChangingUserRelation] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const id = route.params.id;
  let fromCreated: boolean = false;
  if (route.params.fromCreated) {
    fromCreated = true;
  }

  const getActivityInfo = async () => {
    const url = backendUrl + "/activity/" + id;
    const storedToken = await getItemAsync("userToken");
    const storedUserId = await getItemAsync("userId");
    setUserId(storedUserId);
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    };
    const response = await fetch(url, requestOptions);
    if (response.status === 200) {
      const data = await response.json();
      setActivityInfo(data);
      setRelations(data, storedUserId);
    } else {
      console.log("error 404: activity not found");
    }
  };

  // Entscheidet anhand von activityInfo, welches Verhältnis der Nutzer zur aufgerufenen Aktivität hat
  // z.B. ist er als Teilnehmer angemeldet, oder ein Organisator der Aktivität etc.
  const setRelations = (data: any, userId: any) => {
    if (data.organizer._id === userId) {
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
      const response = await fetch(url, requestOptions);
      if (response.status === 200) {
        await getActivityInfo();
      } else {
        console.log("error 404: activity not found");
      }
    } else {
      console.log("no token");
    }
  };

  const handleButtonPress = async () => {
    if (isOwner) {
      navigation.navigate("Participants", { data: activityInfo });
    } else {
      setIsChangingUserRelation(true);
      await changeParticipantSub();
      await getActivityInfo();
      setIsChangingUserRelation(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getActivityInfo();
    setRefreshing(false);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    getActivityInfo();
    return () => backHandler.remove();
  }, []);

  const handleBackButton = () => {
    if (fromCreated) {
      // TODO: Logik für Back button override wenn man von createActivity kam
      console.log("Special back button");
    } else {
      navigation.goBack();
    }
    return true;
  };

  if (!activityInfo) {
    return <Loading />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <OaaIconButton name="close" variant="transparent" onPress={() => handleBackButton()} />
        <OaaIconButton name="pencil" variant="transparent" onPress={() => navigation.navigate("EditActivity", { id: id })} />
      </View>
      <View style={styles.absoluteButton}>
        <OaaButton
          expand={false}
          elevation={true}
          variant={isChangingUserRelation ? "disabled" : isOwner || !isParticipant ? "primary" : "caution"}
          icon={isOwner ? "account" : isParticipant ? "close" : "check"}
          label={isOwner ? "Zusagenliste ansehen" : isParticipant ? "Absagen" : "Zusagen"}
          onPress={handleButtonPress}
        />
      </View>
      <OaaActivityImage id={id} blur={scrollPosition} />
      <ScrollView
        style={{ flex: 1 }}
        onScroll={(event) => setScrollPosition(Math.round(event.nativeEvent.contentOffset.y / 20))}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={[PageStyles.page, styles.mainView]}>
          <View style={{ display: "flex", gap: 8 }}>
            <Text style={PageStyles.hero}>{activityInfo.name}</Text>
            <Text style={PageStyles.subtitle}>Organisiert von {activityInfo.organizer.username}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
            {activityInfo.categories.map((category, key) => (
              <OaaChip key={key} label={category.name} size="small" />
            ))}
          </View>
          <Text style={PageStyles.h2}>Wann?</Text>
          <Text style={PageStyles.body}>
            {new Date(activityInfo.date).toLocaleString("de-DE", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Text style={PageStyles.h2}>Wo?</Text>
          <Text style={PageStyles.body}>{activityInfo.location.coordinates}</Text>
          <Text style={PageStyles.h2}>Wie viele?</Text>
          <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <Text style={PageStyles.body}>
              {activityInfo.maximum_participants} {activityInfo.maximum_participants === 1 ? "Person" : "Personen"}
            </Text>
            {1 - activityInfo.participants.length / activityInfo.maximum_participants <= 0.2 && (
              <OaaChip
                label={`Noch ${activityInfo.maximum_participants - activityInfo.participants.length} Plätze frei!`}
                size="small"
                variant="caution"
              />
            )}
          </View>
          {activityInfo.information_text && (
            <>
              <Text style={PageStyles.h2}>Weitere Informationen</Text>
              <Text style={PageStyles.body}>{activityInfo.information_text}</Text>
            </>
          )}
        </View>
        <View style={{ height: 65 }}></View>
      </ScrollView>
    </View>
  );
}
